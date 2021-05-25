const Route = require('../../models/Route');

module.exports = class OrderGET extends Route {
	constructor() {
		super('/admin/orders', 'post', { isPublic: false, permissions: 'orders' });
	}

	async run(req, res, user) {
		try {
			const { fromDate, toDate, clientId } = req.body;
			const orders = await this.utils.orders.getOrders({
				fromDate,
				toDate,
				clientId
			});

			return res.json({
				message: 'Orders successfully retrieved',
				orders
			});
		} catch (error) {
			return res.status(400).json({ message: error.message });
		}
	}
}