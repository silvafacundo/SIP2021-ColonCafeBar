const Route = require('../../models/Route');

module.exports = class DeliveryPriceGET extends Route {
	constructor() {
		super('/delivery/price', 'get', { isPublic: true });
	}

	async run(req, res, user) {
		const { addressId } = req.query;

		if (!addressId) return res.json('addressId is required');
		try {
			const deliveryPrice = await this.utils.orders.getDeliveryPrice(addressId);

			return res.json({
				message: 'Store data successfully retrieved',
				deliveryPrice
			})
		} catch (err) {
			return super.error(res, err);
		}
	}
}