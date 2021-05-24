const Product = require('../../models/products/Product');
const OrderProduct = require('../../models/products/OrderProduct');
const Order = require('../../models/orders/Order');
const Server = require('../../Server');
const PublicError = require('../../errors/PublicError');
module.exports = class OrderController {
	/**
	 *Creates an instance of OrderController.
	 * @param {Server} server
	 */
	constructor(server) {
		this.server = server;
	}

	get db() {
		return this.server.db;
	}

	get utils() {
		return this.server.utils;
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

		const productsId = []
		for (const product of products) {
			productsId.push(product.id);
		}

		const productsData = await this.utils.products.getProducts(productsId);

		const trx = await this.db.transaction();
		try {
			const order = await this.db('orders')
				.insert({
					clientId,
					paymentMethod,
					withDelivery,
					addressId,
				})
				.returning('*')
				.transacting(trx);

			let productsToInsert = [];

			for (const product of products) {
				const productData = productsData.find(p => String(p.id) === String(product.id));
				if (!productData) continue;
				productsToInsert.push({
					productId: productData.id,
					price: productData.price,
					orderId: order[0].id,
					amount: product.amount
				})
			}

			if (productsToInsert.length > 0)
				await this.db('orderProducts').insert(productsToInsert).transacting(trx);

			await trx.commit();
			await this.utils.mercadopago.createOrderPayment(order[0].id)
			return await this.getOrder(order[0].id);
		} catch (error) {
			console.error('Failed to create order:', error);
			await trx.rollback();
			throw error;
		}
	}

	async updateOrder({ orderId, status, isPaid, deliveryId }) {
		if (deliveryId) {
			const delivery = await this.utils.deliveries.getDelivery(deliveryId);
			if (!delivery) throw new PublicError('the Delivery doesn\'t exists');
		}

		await this.db('orders')
			.where('id', orderId)
			.update({ status, isPaid, deliveryId })
			.returning('*');

		return await this.getOrder(orderId);
	}

	/**
	 * gets an order
	 *
	 * @param {string|number} orderId
	 * @returns {Order} order
	 */
	async getOrder(orderId) {
		const order = await this.db('orders')
			.where('id', orderId)
			.first();

		if (!order) return null;

		const client = await this.utils.clients.getClient({ userId: order.clientId });

		let dbOrderProducts = await this.db('orderProducts')
			.select('*')
			.innerJoin('products', 'products.id', 'orderProducts.productId' )
			.where({ orderId });

		let mpLink = null;
		if (order.paymentMethod === 'online') {
			mpLink = await this.utils.mercadopago.getPaymentLink(orderId);
		}

		const  orderProducts = [];

		for (const orderProduct of dbOrderProducts) {
			const { amount, price, ...productData } = orderProduct;
			const product = new Product(this.server, productData, null, parseInt(price));
			orderProducts.push(new OrderProduct(this.server, product, parseInt(price), parseInt(amount)));
		}

		return new Order(this.server, { ...order, mpLink }, orderProducts, client);
	}

	async getOrders() {
		// TODO
	}
}