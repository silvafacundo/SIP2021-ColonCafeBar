const Route = require('../../models/Route');

module.exports = class OrderGET extends Route {
	constructor() {
		super('/order', 'get', { isPublic: false });
	}

	async run(req, res, user) {
		try {
			const { orderId } = req.query;

			const order = await this.utils.orders.getOrder(orderId);
			return res.json({ message: 'order successfully created', order });
		} catch (error) {
			return res.status(400).json({ message: error.message });
		}
	}
}