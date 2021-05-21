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

			for (const product of products) {
				const productData = productsData.find(p => p.id == product.id);
				product.productId = product.id;
				product.price = productData.price;
				product.orderId = order[0].id;
				delete product.id;
			}

			await this.db('orderProducts').insert(products).transacting(trx);

			await trx.commit();
		} catch (error) {
			console.error(error);
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

	async getOrder(orderId) {
		const order = await this.db('orders')
			.where('id', orderId)
			.first();

		const productsOrder = await this.db('orderProducts')
			.select('*')
			.innerJoin('products', 'product.id', 'orderProduct.productId' )
			.where({ orderId });

		return {
			order,
			products: productsOrder
		}
	}

	async getOrders() {
		// TODO
	}
}