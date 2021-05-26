const Route = require('../../models/Route');

module.exports = class OrderGET extends Route {
	constructor() {
		super('/admin/orders', 'post', { isPublic: false, permissions: 'orders' });
	}

	async run(req, res, user) {
		try {
			const { page = 1, perPage = 20, filters, orderBy } = req.body;
			const { orders, pagination } = await this.utils.orders.getOrders({ page, perPage, filters, orderBy });
			return res.json({
				message: 'Orders successfully retrieved',
				orders,
				pagination
			});
		} catch (error) {
			return super.error(res, error);
		}
	}
}