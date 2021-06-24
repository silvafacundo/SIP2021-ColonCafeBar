const Route = require('../../models/Route');

module.exports = class StoreDataPUT extends Route {
	constructor() {
		super('/admin/store', 'put', { permissions: 'store' });
	}

	async run(req, res, user) {
		const { minDeliveryPrice, maxDeliveryPrice, deliverPricePerKm, maxDeliveryKm, street, city, neighborhood, number, postalCode, coordinates } = req.body;

		try {
			await this.utils.store.updateStoreData({ minDeliveryPrice, maxDeliveryPrice, deliverPricePerKm, maxDeliveryKm, street, city, neighborhood, number, postalCode, coordinates });

			return res.json({ message: 'Store data successfully updated' })
		} catch (err) {
			return super.error(res, err);
		}
	}
}