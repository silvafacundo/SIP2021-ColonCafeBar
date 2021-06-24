const PublicError = require('../../errors/PublicError');

module.exports = class StoreDataController {
	constructor(server) {
		this.server = server;
	}

	get db() {
		return this.server.db;
	}

	get utils() {
		return this.server.utils;
	}

	async getStoreData() {
		const storeData = await this.db('storeData').first();
		return storeData;
	}

	async updateStoreData({ minDeliveryPrice, maxDeliveryPrice, deliverPricePerKm, maxDeliveryKm, street, city, neighborhood, number, postalCode, coordinates }) {
		const storeData = await this.getStoreData();
		const toUpdate = {};
		if (minDeliveryPrice && typeof minDeliveryPrice !== 'number') throw new PublicError('minDeliveryPrice must be a number');
		if (maxDeliveryPrice && typeof maxDeliveryPrice !== 'number') throw new PublicError('maxDeliveryPrice must be a number');
		if (deliverPricePerKm && typeof deliverPricePerKm !== 'number') throw new PublicError('deliverPricePerKm must be a number');
		if (maxDeliveryKm && typeof maxDeliveryKm !== 'number') throw new PublicError('maxDeliveryKm must be a number');

		if (minDeliveryPrice) toUpdate.minDeliveryPrice = minDeliveryPrice;
		if (maxDeliveryPrice) toUpdate.maxDeliveryPrice = maxDeliveryPrice;
		if (deliverPricePerKm) toUpdate.deliverPricePerKm = deliverPricePerKm;
		if (maxDeliveryKm) toUpdate.maxDeliveryKm = maxDeliveryKm;
		if (street) toUpdate.street = street;
		if (city) toUpdate.city = city;
		if (neighborhood) toUpdate.neighborhood = neighborhood;
		if (number) toUpdate.number = number;
		if (postalCode) toUpdate.number = postalCode;
		if (coordinates) toUpdate.coordinates = coordinates;

		if (Object.keys(toUpdate).length < 1) throw new PublicError('At least one param is required!');

		await this.db('storeData').where({ id: storeData.id }).update(toUpdate);
	}
}