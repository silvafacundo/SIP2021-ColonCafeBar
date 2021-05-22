const Server = require('../../Server');
const moment = require('moment');
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

	parseDate(date) {
		return moment(date).utcOffset(-3).format('YYYY-MM-DD[T]HH:mm:ss.SSSZ');
	}

	async createOrderPayment(orderId) {
		const order = await this.utils.orders.getOrder(orderId);
		const expirationDate = this.parseDate(Date.now() + 2 * 60 * 60 * 1000);

		const payer = {
			email: order.client.email
		}

		const items = [
			{
				id: orderId,
				title: `CafeBar - Orden nro #${orderId}`,
				quantity: 1,
				unit_price: order.total
			}
		];
		console.log('MP DATE: ', expirationDate);
		const { body: preferences }= await this.mercadopago.preferences.create({
			expires: true,
			expiration_date_to: expirationDate,
			payment_methods: {
				installments: 1,
				excluded_payment_types: [
					{ id: 'ticket' },
					{ id: 'atm' }
				]
			},
			// notification_url: 'https://af71bf84e70e.ngrok.io/api/webhook/mercadopago',
			external_reference: order.id,
			items,
			payer,
			statement_descriptor: 'CafeBar'
		});

		await this.db('orderMercadopago').insert({ orderId: order.id, mpId: preferences.id })


		return preferences;
	}

	async endMpOrder(orderId) {
		const expirationDate = this.parseDate(Date.now() - 1 * 60 * 60 * 1000);
		const { mpId } = await this.db('orderMercadopago').where({ orderId }).first();
		await this.mercadopago.preferences.update({
			id: mpId,
			expiration_date_to: expirationDate,
		});
	}

	async getPaymentLink(orderId) {
		const { mpId } = await this.db('orderMercadopago').where({ orderId }).first() || {};
		if (!mpId) return null;
		const { body: preference } = await this.mercadopago.preferences.findById(mpId);
		return preference.init_point;
	}

	async getPayment(id) {
		const data = await this.mercadopago.payment.get(id);
		return data.body;
	}



}