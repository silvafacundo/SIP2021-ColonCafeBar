const Route = require('../../models/Route');

module.exports = class ClientCancelOrderPOST extends Route {
	constructor() {
		super('/order/cancel', 'post', { isPublic: false });
	}

	async run(req, res, client) {
		const { orderId } = req.body;

		try {
			const order = await this.utils.orders.getOrder(orderId);
			if (!order) return res.status(400).json({ message: 'Order not found!' });

			if (order.client.id !== client.id) return res.status(400).json({ message: 'You do not have access to this order!' });
			if (order.orderStatus.key !== 'pending') return res.status(400).json({ message: 'The order was accepted by the restaurant. You can not cancel it' });

			const cancelledStatus = await this.utils.orders.getOrderStatus({ key: 'cancelled' });

			await this.utils.orders.updateOrder({ orderId, statusId: cancelledStatus.id });

			return res.json({ message: 'Your order was successfully cancelled!' });
		} catch (error) {
			return super.error(res, error)
		}
	}
}