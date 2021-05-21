const Route = require('../../models/Route');

module.exports = class orderCreatePOST extends Route {
	constructor() {
		super('/order', 'post', { isPublic: false });
	}

	async run(req, res, user) {
		try {

			const { withDelivery, paymentMethod, addressId, products } = req.body;

			const clientId = user.id;
			const order = await this.utils.orders.createOrder({
				clientId,
				withDelivery,
				paymentMethod,
				addressId,
				products
			});
			return res.json({ message: 'order successfully created', order });
		} catch (error) {
			console.error('Failed to create', error)
			return res.status(400).json({ message: error.message });
		}
	}
}