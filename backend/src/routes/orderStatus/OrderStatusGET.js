const Route = require('../../models/Route');

module.exports = class OrderStatusGET extends Route {
	constructor() {
		super('/admin/orderstatus', 'get', { isPublic: false });
	}

	async run(req, res, user) {
		try {
			const orderStatus = await this.utils.orders.getAllOrderStatus();

			return res.json({ message: 'order successfully created', orderStatus });
		} catch (error) {
			return super.error(res, error)
		}
	}
}