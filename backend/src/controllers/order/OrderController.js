const PublicError = require('../../errors/PublicError');
const { Op } = require('sequelize');
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
		if (!products || !Array.isArray(products) || products.length < 1) throw new PublicError('products is required');
		if (typeof withDelivery !== 'boolean') throw new PublicError('withDelivery must be a boolean');

		const client = await this.utils.clients.getClient({ clientId });
		if (!client) throw new PublicError('Client does not exist with that clientId');

		let address;
		if (withDelivery) {
			address = await this.utils.addresses.getAddress(addressId);
			if (!address) throw new PublicError('Address not found!');
			const isAddressFromClient = await this.utils.addresses.isAddressFromClient(addressId, clientId);
			if (!isAddressFromClient) throw new PublicError('The provided address is not from the given client');
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
					amount: product.amount,
					// orderId: order[0],
					selectedVariants: product.variants,
				})
			}

			if (productsToInsert.length !== products.length) {
				throw new PublicError('The provided products doesn\'t exist or they are not available');
			}

			const status = await this.utils.orders.getOrderStatus({ key: 'pending' });

			const order = await this.models.Order.create({
				clientId,
				paymentMethod,
				withDelivery,
				addressId,
				products: productsToInsert,
				statusId: status.id
			}, { include: ['products', 'address', 'delivery'] });

			const payment = await this.utils.mercadopago.createOrderPayment(order.id);
			if (payment) order.paymentLink = payment.init_link;
			return order;
		} catch (error) {
			console.error('Failed to create order:', error);
			throw error;
		}
	}

	async updateOrder({ orderId, statusId, isPaid, deliveryId }) {
		if (deliveryId) {
			const delivery = await this.utils.deliveries.getDelivery(deliveryId);
			if (!delivery) throw new PublicError('the Delivery doesn\'t exists');
		}

		if (statusId) {
			const status = await this.utils.orders.getOrderStatus({ id: statusId });
			if (!status) throw new PublicError('the status doesn\'t exists');
		}

		const order = await this.models.Order.findByPk(orderId);
		if (deliveryId)
			order.deliveryId = deliveryId;
		if (typeof isPaid === 'boolean')
			order.isPaid = isPaid;
		if (statusId)
			order.statusId = statusId;

		await order.save();

		return order;
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
		if (isNaN(perPage)) throw new PublicError('perPAge should be a number');

		const order = [];
		order.push(['createdAt', orderBy.createdAt === 'asc' ? 'ASC' : 'DESC']);
		const whereQuery = {}
		const { fromDate, toDate, clientsId, deliveriesId } = filters || {};
		if (fromDate) whereQuery.createdAt = { [Op.gte]: fromDate };
		if (toDate) whereQuery.createAt = { ...whereQuery.createdAt, [Op.lte]: toDate };
		if (Array.isArray(clientsId)) whereQuery.clientId = { [Op.in]: clientsId };
		if (Array.isArray(deliveriesId)) whereQuery.deliveryId = { [Op.in]: deliveriesId };

		const { count: total, rows: orders }= await this.models.Order.findAndCountAll({
			where: whereQuery,
			offset: (page - 1) * perPage,
			limit: perPage,
			order
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
}