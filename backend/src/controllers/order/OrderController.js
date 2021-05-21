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

		const client = await this.utils.clients.getClient({ clientId });
		if (!client) throw Error('Client does not exist with that clientId');

		let address;
		if (addressId) {
			address = await this.utils.addresses.getAddress(addressId);
			if (!address) throw Error('Address not found!');
			const isAddressFromClient = await this.utils.addresses.isAddressFromClient(addressId, clientId);
			if (!isAddressFromClient) throw Error('The provided address is not from the given client');
		}


		const allProducts = await this.utils.products.getAllProducts();

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
				const productData = allProducts.find(p => p.id === product.id);
				product.productId = product.id;
				product.price = productData.price;
				product.orderId = order[0].id
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

	async updateOrderStatus() {

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