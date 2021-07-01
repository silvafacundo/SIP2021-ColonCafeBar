const Route = require('../../models/Route');

module.exports = class StoreConfigPUT extends Route {
	constructor() {
		super('/admin/store', 'put', { permissions: 'store' });
	}

	async run(req, res, user) {
		const { minDeliveryPrice, maxDeliveryPrice, deliveryPricePerKm, maxDeliveryKm, coordinates, orderTimeoutMinutes } = req.body;

		try {
			await this.utils.store.updateStoreConfig({ minDeliveryPrice, maxDeliveryPrice, deliveryPricePerKm, maxDeliveryKm, coordinates, orderTimeoutMinutes });

			return res.json({ message: 'Store data successfully updated' })
		} catch (err) {
			return super.error(res, err);
		}
	}
}