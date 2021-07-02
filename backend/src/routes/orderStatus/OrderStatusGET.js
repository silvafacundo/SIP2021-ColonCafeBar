const Route = require('../../models/Route');

module.exports = class OrderStatusGET extends Route {
	constructor() {
		super('/orderstatus', 'get', { isPublic: true });
	}

	async run(req, res, user) {
		try {
			const orderStatus = await this.utils.orders.getAllOrderStatus();

			return res.json({ message: 'successfully retrieved order status', orderStatus });
		} catch (error) {
			return super.error(res, error)
		}
	}
}