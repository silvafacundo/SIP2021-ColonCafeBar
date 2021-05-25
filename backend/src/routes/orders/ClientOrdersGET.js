const Route = require('../../models/Route');

module.exports = class ClientOrdersGET extends Route {
	constructor() {
		super('/client/orders', 'post', { isPublic: false });
	}

	async run(req, res, user) {
		try {
			let { perPage = 20, page = 1, filters, orderBy } = req.body;

			if (typeof filters !== 'object')
				filters = {};

			filters.clientsId = [user.id];

			const { orders, pagination } = await this.utils.orders.getOrders({ perPage, page, filters, orderBy });

			return res.json({ message: 'Orders succesffully retrieved', orders, pagination });
		} catch (error) {
			return super.error(res, error)
		}
	}
}