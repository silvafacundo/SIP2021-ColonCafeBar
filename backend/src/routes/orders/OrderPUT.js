const Route = require('../../models/Route');

module.exports = class OrderPUT extends Route {
	constructor() {
		super('/admin/order', 'put');
	}

	async run(req, res) {
		const { orderId, status, isPaid, deliveryId } = req.body;
		if (!orderId) return res.status(400).json({ message: 'id is required!' });
		if (typeof isPaid !== 'boolean' && !deliveryId && (!status && typeof status !== 'string')) return res.status(400).json({ message: 'isPaid or status is required' });

		try {
			const order = await this.utils.orders.getOrder(orderId);
			//if order doesn't exists, display a error message
			if (!order){
				res.json('There are no order with that id!');
			} else {
				await this.utils.orders.updateOrder({ orderId, status, isPaid, deliveryId });
				return res.json({ message: 'Order successfully updated!' });
			}
		} catch (error) {
			return super.error(res, error);
		}
	}
}