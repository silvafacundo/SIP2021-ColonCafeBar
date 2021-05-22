const Route = require('../../models/Route');

module.exports = class mercadopagoPOST extends Route {
	constructor() {
		super('/webhook/mercadopago', 'post', { isPublic: true });
	}

	async run(req, res, user) {
		// TODO: Agregar algun tipo de token de seguridad
		if (req.body.type === 'payment') {
			const data = await this.utils.mercadopago.getPayment(req.body.data.id);
			const orderId = data.external_reference;
			await this.utils.mercadopago.endMpOrder(orderId);
			console.log(`order#${orderId} status:`, data.status);
			if (data.status === 'approved') {
				await this.utils.orders.updateOrder({ orderId, isPaid: true });
			}
		}
		return res.status(200).send();
	}
}