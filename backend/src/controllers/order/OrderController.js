const Product = require('../../models/products/Product');
const OrderProduct = require('../../models/products/OrderProduct');
const Order = require('../../models/orders/Order');
module.exports = class OrderController {
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
		if (!paymentMethod && typeof paymentMethod !== 'string' ) throw Error('paymentMethod is required');
		if (!products || !Array.isArray(products) || products.length < 1) throw Error('products is required');
		if (typeof withDelivery !== 'boolean') throw Error('withDelivery must be a boolean');

		const client = await this.utils.clients.getClient({ clientId });
		if (!client) throw Error('Client does not exist with that clientId');

		let address;
		if (withDelivery) {
			address = await this.utils.addresses.getAddress(addressId);
			if (!address) throw Error('Address not found!');
			const isAddressFromClient = await this.utils.addresses.isAddressFromClient(addressId, clientId);
			if (!isAddressFromClient) throw Error('The provided address is not from the given client');
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
			return await this.getOrder(order[0].id);
		} catch (error) {
			console.error('Failed to create order:', error);
			await trx.rollback();
			throw error;
		}
	}

	async updateOrderStatus({ orderId, state }) {
		await this.db('orders')
			.where('id', orderId)
			.update({ 'status': state })
			.returning('*');
		return true;
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

		const client = await this.utils.clients.getClient({ userId: order.clientId });

		let dbOrderProducts = await this.db('orderProducts')
			.select('*')
			.innerJoin('products', 'products.id', 'orderProducts.productId' )
			.where({ orderId });

		const  orderProducts = [];

		for (const orderProduct of dbOrderProducts) {
			const { amount, price, ...productData } = orderProduct;
			const product = new Product(this.server, productData, null, parseInt(price));
			orderProducts.push(new OrderProduct(this.server, product, parseInt(price), parseInt(amount)));
		}

		return new Order(this.server, order, orderProducts, client);
	}

	async getOrders() {
		// TODO
	}
}