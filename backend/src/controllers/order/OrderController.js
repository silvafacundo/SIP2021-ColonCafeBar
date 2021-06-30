const PublicError = require('../../errors/PublicError');
const { Op, where } = require('sequelize');
const axios = require('axios');
module.exports = class OrderController {
	/**
	 *Creates an instance of OrderController.
	 * @param {Server} server
	 */
	constructor(server) {
		/**
		 * @type {Server}
		 */
		this.server = server;
	}

	get db() {
		return this.server.db;
	}

	get utils() {
		return this.server.utils
	}
	get sequelize() {
		return this.server.sequelize;
	}

	get models () {
		return this.server.models;
	}

	_isValidVariant(product, productData) {
		let verifiedVariantsAmount = 0;
		for (const variantIndex in productData.variants) {
			const variant = productData.variants[variantIndex];
			const selectedVariant = product.variants ? product.variants[variantIndex] : null;
			if (variant.required) {
				if (!selectedVariant) throw new PublicError(`Variant "${variantIndex}" is required`);
			}
			if (selectedVariant && !variant.values.includes(selectedVariant)) throw new PublicError(`Invalid variant "${selectedVariant}" for "${variantIndex}"`);
			if (selectedVariant) ++verifiedVariantsAmount;
		}
		if (typeof product.variants === 'object' && Object.keys(product.variants).length > verifiedVariantsAmount) throw new PublicError('Unexpected variants');
		return true;
	}

	async createOrder({ clientId, withDelivery, paymentMethod, addressId, products }) {
		if (!clientId) throw Error('clientId is required');

		if (!paymentMethod && typeof paymentMethod !== 'string' ) throw new PublicError('paymentMethod is required');
		if (!['cash', 'points', 'online'].includes(paymentMethod)) throw new PublicError('paymentMethod is not valid!');

		if (!products || !Array.isArray(products) || products.length < 1) throw new PublicError('products is required');

		if (typeof withDelivery !== 'boolean') throw new PublicError('withDelivery must be a boolean');

		const client = await this.utils.clients.getClient({ clientId });
		if (!client) throw new PublicError('Client does not exist with that clientId');

		let address;
		let deliveryPrice = 0;
		if (withDelivery) {
			address = await this.utils.addresses.getAddress(addressId);
			if (!address) throw new PublicError('Address not found!');
			const isAddressFromClient = await this.utils.addresses.isAddressFromClient(addressId, clientId);
			if (!isAddressFromClient) throw new PublicError('The provided address is not from the given client');

			deliveryPrice = await this.getDeliveryPrice(address.id);
			if (deliveryPrice === -1) throw new PublicError('The distance between the given address and the bar address exceeds the max');
		}

		let productsId = new Set(products.map(product => product.id));
		productsId = Array.from(productsId.values());

		const productsData = await this.utils.products.getProducts(productsId);
		if (productsData.length !== productsId.length) throw new PublicError('The provided products doesn\'t exist');

		try {
			let productsToInsert = [];

			for (const product of products) {
				const productData = productsData.find(p => String(p.id) === String(product.id));
				if (!productData || (productData && !productData.isActive)) continue;
				if (productData.variants && !this._isValidVariant(product, productData)) throw new PublicError(`Product ${product.id} variant is wrong`);

				productsToInsert.push({
					productId: productData.id,
					price: productData.price,
					pointsPrice: productData.pointsPrice,
					grantablePoints: productData.grantablePoints,
					amount: product.amount,
					// orderId: order[0],
					selectedVariants: product.variants,
				})
			}

			if (productsToInsert.length !== products.length) {
				throw new PublicError('The provided products doesn\'t exist or they are not available');
			}

			const pointsPrice = productsToInsert.reduce((count, product) => count + product.pointsPrice * product.amount, 0);
			if (paymentMethod === 'points' && client.availablePoints <= pointsPrice) throw new PublicError('Not enough points to pay');

			const status = await this.utils.orders.getOrderStatus({ key: 'pending' });

			const order = await this.models.Order.create({
				clientId,
				paymentMethod,
				withDelivery,
				addressId,
				products: productsToInsert,
				deliveryPrice,
				statusId: status.id,
				isPaid: paymentMethod === 'points'
			}, { include: ['products', 'address', 'delivery'] });

			if (paymentMethod === 'online') {
				const payment = await this.utils.mercadopago.createOrderPayment(order.id);
				if (payment) order.paymentLink = payment.init_link;
			}

			if (paymentMethod === 'points') {
				await this.utils.clients.discountPoints(clientId, pointsPrice);
			}

			return order;
		} catch (error) {
			console.error('Failed to create order:', error);
			throw error;
		}
	}

	validateStatus(newStatus, oldStatus) {
		const finalStatus = ['dispatched', 'delivered', 'cancelled'];
		if (newStatus === 'cancelled') return true;
		if (oldStatus === 'canceled' && newStatus !== 'cancelled') return false;
		if (oldStatus === 'inPreparation' && newStatus === 'awaitingPreparation') return false;
		if (newStatus === 'pending' && oldStatus !== 'pending') return false;
		if (oldStatus === 'awaitingWithdrawal' && !finalStatus.includes(newStatus)) return false;
		if (finalStatus.includes(oldStatus) && newStatus !== oldStatus) return false;
		return true;
	}

	async updateOrder({ orderId, statusId, isPaid, deliveryId }) {
		const order = await this.models.Order.findByPk(orderId);
		if (!order) throw new PublicError('The Order doesn\'t exists');

		let status = null;
		if (statusId) {
			status = await this.getOrderStatus({ id: statusId });
			if (!status) throw new PublicError('the status doesn\'t exists');
			const isValidStatus = this.validateStatus(status.key, order.orderStatus.key);
			if (!isValidStatus) throw new PublicError(`Can not switch from status "${order.orderStatus.key}" to "${status.key}"`);
			order.statusId = statusId;
		}

		let delivery = null;
		if (deliveryId)	delivery = await this.utils.deliveries.getDelivery(deliveryId);
		if (deliveryId && !delivery) throw new PublicError('the Delivery doesn\'t exists');
		if (deliveryId && delivery) order.deliveryId = deliveryId;

		if (typeof isPaid === 'boolean') order.isPaid = isPaid;

		await order.save();

		return order;
	}

	async refundOrder(orderId) {
		const order = await this.models.Order.findByPk(orderId);
		if (order.orderStatus.key !== 'cancelled' || order.refunded) return;

		const paymentMethod = order.paymentMethod;

		switch (paymentMethod) {
			case 'online':
				if (order.isPaid) {
					// TODO: Reembolsar MP
					// UPDATE: Aparentemente no hay manera de hacer un reembolzo con Mp
				} else {
					await this.utils.mercadopago.endMpOrder(order.id);
				}
				break;
			case 'points':
				await this.utils.clients.addPoints(Number(order.client.id), order.pointsPriceTotal);
				break;
		}
		order.refunded = true;
		order.save();
	}

	/**
	 * gets an order
	 *
	 * @param {string|number} orderId
	 * @returns {Order} order
	 */
	async getOrder(orderId) {
		const order = await this.models.Order.findByPk(orderId, { include: ['client', 'products'] });
		// TODO: Chequear si el payment method es online
		order.paymentLink = await this.utils.mercadopago.getPaymentLink(order.id);
		return order;
	}

	async getOrders({ perPage = 20, page = 1, filters = {}, orderBy = {} }) {
		if (isNaN(page)) throw new PublicError('page should be a number');
		if (isNaN(perPage)) throw new PublicError('perPage should be a number');

		const Sequelize = this.sequelize.Sequelize;
		const order = [];
		order.push(['createdAt', orderBy.createdAt === 'asc' ? 'ASC' : 'DESC']);

		const whereQuery = {}
		const { fromDate, toDate, clientsId, statusesId, deliveriesId } = filters || {};
		if (fromDate) whereQuery.createdAt = { [Op.gte]: fromDate };
		if (toDate) whereQuery.createdAt = { ...whereQuery.createdAt, [Op.lte]: toDate };
		if (Array.isArray(clientsId) && clientsId.length > 0) whereQuery.clientId = { [Op.in]: clientsId };
		if (Array.isArray(deliveriesId) && deliveriesId.length > 0) whereQuery.deliveryId = { [Op.in]: deliveriesId };
		if (Array.isArray(statusesId) && statusesId.length > 0) whereQuery.statusId = { [Op.in]: statusesId }

		const { count: total, rows: orders }= await this.models.Order.findAndCountAll({
			where: whereQuery,
			offset: (page - 1) * perPage,
			limit: perPage,
			order,
		});

		return { orders, pagination: { page, perPage, total } }
	}

	async getOrderStatus({ id, key }) {
		const whereObj = {};
		if (id) whereObj.id = id;
		if (key) whereObj.key = key;

		const status = await this.models.OrderStatus.findOne({
			where: whereObj
		});

		return status;

	}

	async getAllOrderStatus() {
		const status = await this.models.OrderStatus.findAll();
		return status;
	}

	async getDeliveryPrice(addressId) {
		const address = await this.utils.addresses.getAddress(addressId);
		if (!address) throw new PublicError('the address doesn\'t exists');

		const store = await this.utils.store.getStoreConfig();
		const { coordinates: storeCoordinates, minDeliveryPrice, maxDeliveryPrice, deliveryPricePerKm, maxDeliveryKm } = store;

		const { data } = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${address.coordinates.replace(';', ',')}&destinations=${storeCoordinates.replace(';', ',')}&key=${process.env.MAPS_APIKEY}`)

		if (!data || !data.rows || !Array.isArray(data.rows) || data.rows.length < 1) throw new PublicError('Failed to retrieve km distance');
		const distanceRow = data.rows[0];
		if (!distanceRow || !distanceRow.elements || !Array.isArray(distanceRow.elements) || data.rows.distanceRow < 1
			|| !distanceRow.elements[0].distance || !distanceRow.elements[0].distance.value) throw new PublicError('Failed to retrieve km distance');

		const distance = Math.floor(distanceRow.elements[0].distance.value/1000);

		if (distance >= maxDeliveryKm) return -1;
		let deliveryPrice = deliveryPricePerKm * distance;

		if (deliveryPrice < minDeliveryPrice) deliveryPrice = minDeliveryPrice;
		if (deliveryPrice > maxDeliveryPrice) deliveryPrice = maxDeliveryPrice;
		return deliveryPrice;
	}
}