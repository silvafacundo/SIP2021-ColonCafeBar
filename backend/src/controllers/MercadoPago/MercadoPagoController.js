const Server = require('../../Server');
module.exports = class MercadoPagoController {
	/**
	 * Creates an instance of MercadoPagoController.
	 * @param {Server} server
	 */
	constructor(server) {
		this.server = server;
		this.mercadopago = require('mercadopago');
		this.mercadopago.configurations.setAccessToken(process.env.MP_TOKEN);
	}
	get utils() {
		return this.server.utils;
	}
	get db() {
		return this.server.db;
	}


	async createOrderPayment(orderId) {
		const order = await this.utils.orders.getOrder(orderId);
		const expirationDate = new Date(Date.now() + 1 * 60 * 60 * 1000);

		const result = await this.mercadopago.preferences.create({
			expires: true,
			// expiration_date_to: expirationDate.toString(),
			// date_of_expiration: expirationDate.toString(),
			items: [
				{
					id: orderId,
					title: `CafeBar - Orden nro #${orderId}`,
					quantity: 1,
					unit_price: order.price || 100, // TODO: Cambiar esto
				}
			],
			payer: {
				email: order.client.email
			},
			statement_descriptor: 'CafeBar'
		});
		return result;
	}



}