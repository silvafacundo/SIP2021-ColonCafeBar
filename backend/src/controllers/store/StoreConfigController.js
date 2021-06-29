const PublicError = require('../../errors/PublicError');

module.exports = class StoreConfigController {
	constructor(server) {
		this.server = server;
	}

	get db() {
		return this.server.db;
	}

	get utils() {
		return this.server.utils;
	}

	async getStoreConfig() {
		const storeConfig = await this.db('storeConfig').first();
		return storeConfig;
	}

	async updateStoreConfig({ minDeliveryPrice, maxDeliveryPrice, deliverPricePerKm, maxDeliveryKm, coordinates }) {
		const storeConfig = await this.getStoreConfig();
		const toUpdate = {};

		if (minDeliveryPrice) toUpdate.minDeliveryPrice = minDeliveryPrice;
		if (maxDeliveryPrice) toUpdate.maxDeliveryPrice = maxDeliveryPrice;
		if (deliverPricePerKm) toUpdate.deliverPricePerKm = deliverPricePerKm;
		if (maxDeliveryKm) toUpdate.maxDeliveryKm = maxDeliveryKm;

		if (coordinates) toUpdate.coordinates = coordinates;

		if (Object.keys(toUpdate).length < 1) throw new PublicError('At least one param is required!');

		await this.db('storeConfig').where({ id: storeConfig.id }).update(toUpdate);
	}
}