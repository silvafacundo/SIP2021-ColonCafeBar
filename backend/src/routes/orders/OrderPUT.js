const Route = require('../../models/Route');

module.exports = class OrderPUT extends Route {
	constructor() {
		super('/admin/order', 'put');
	}

	async run(req, res) {
		const { orderId, statusId, isPaid, deliveryId } = req.body;
		if (!orderId) return res.status(400).json({ message: 'id is required!' });
		if (typeof isPaid !== 'boolean' && !deliveryId && (!statusId && typeof statusId !== 'string')) return res.status(400).json({ message: 'isPaid or statusId is required' });

		try {
			const order = await this.utils.orders.getOrder(orderId);
			if (!order)	return res.json('There are no order with that id!');

			await this.utils.orders.updateOrder({ orderId, statusId, isPaid, deliveryId });
			return res.json({ message: 'Order successfully updated!' });
		} catch (error) {
			return super.error(res, error);
		}
	}
}