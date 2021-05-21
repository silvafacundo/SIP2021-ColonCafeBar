const Route = require('../../models/Route');

module.exports = class OrderPUT extends Route {
	constructor() {
		super('/order/update', 'put');
	}

	async run(req, res) {
		const { orderId, status } = req.body;
		if (!orderId) return res.status(400).json({ message: 'id is required!' });
		if (!status && typeof status !== 'string') return res.status(400).json({ message: 'status is required!' });

		try {
			const order = await this.utils.orders.getOrder(orderId);
			//if order doesn't exists, display a error message
			if (!order){
				res.json('There are no order with that id!');
			} else {
				await this.utils.orders.updateOrder({ orderId, status });
				return res.json({ message: 'Order successfully updated!' });
			}
		} catch (error) {
			return super.error(res, error);
		}
	}
}