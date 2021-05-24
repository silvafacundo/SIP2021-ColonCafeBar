const Route = require('../../models/Route');

module.exports = class OrderGET extends Route {
	constructor() {
		super('/order', 'get', { isPublic: false });
	}

	async run(req, res, user) {
		try {
			const { orderId } = req.query;

			const order = await this.utils.orders.getOrder(orderId);
			if (!order) return res.status(400).json({ message: 'Order doesn\'t exists' });
			if (order.client.id !== user.id) return res.status(403).json({ message: 'Can\'t access to this resource' });

			return res.json({ message: 'order successfully created', order });
		} catch (error) {
			return super.error(res, error)
		}
	}
}