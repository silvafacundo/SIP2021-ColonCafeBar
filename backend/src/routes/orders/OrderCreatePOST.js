const Route = require('../../models/Route');

module.exports = class orderCreatePOST extends Route {
	constructor() {
		super('/order', 'post', { isPublic: false });
	}

	async run(req, res, user) {
		try {
			const { withDelivery, paymentMethod, addressId, products } = req.body;

			const isOpen = await this.utils.schedules.isOpen();
			if (!isOpen) return res.status(400).json({ message: 'El negocio actualmente se encuentra cerrado' });

			const clientId = user.id;
			const order = await this.utils.orders.createOrder({
				clientId,
				withDelivery,
				paymentMethod,
				addressId,
				products
			});

			return res.json({ message: 'Order successfully created', order });
		} catch (error) {
			return super.error(res, error);
		}
	}
}