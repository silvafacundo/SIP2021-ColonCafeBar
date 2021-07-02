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

	async getTimeZone() {
		const { timeZone } = await this.getStoreConfig();
		return timeZone;
	}

	async updateStoreConfig({ minDeliveryPrice, maxDeliveryPrice, deliveryPricePerKm, maxDeliveryKm, coordinates, orderTimeoutMinutes }) {
		if (typeof minDeliveryPrice !== 'undefined') {
			minDeliveryPrice = Number(minDeliveryPrice);
			if (isNaN(minDeliveryPrice) || minDeliveryPrice < 0) throw new PublicError('minDeliveryPrice is not valid');
		}

		if (typeof maxDeliveryPrice !== 'undefined') {
			maxDeliveryPrice = Number(maxDeliveryPrice);
			if (isNaN(maxDeliveryPrice) || maxDeliveryPrice < 0) throw new PublicError('maxDeliveryPrice is not valid');
		}

		if (typeof deliveryPricePerKm !== 'undefined') {
			deliveryPricePerKm = Number(deliveryPricePerKm);
			if (isNaN(deliveryPricePerKm) || deliveryPricePerKm < 0) throw new PublicError('deliveryPricePerKm is not valid');
		}

		if (typeof maxDeliveryKm !== 'undefined') {
			maxDeliveryKm = Number(maxDeliveryKm);
			if (isNaN(maxDeliveryKm) || maxDeliveryKm < 0) throw new PublicError('maxDeliveryKm is not valid');
		}

		if (typeof orderTimeoutMinutes !== 'undefined') {
			orderTimeoutMinutes = Number(orderTimeoutMinutes);
			if (isNaN(orderTimeoutMinutes) || orderTimeoutMinutes <= 0) throw new PublicError('orderTimeoutMinutes is not valid');
		}

		const storeConfig = await this.getStoreConfig();
		const toUpdate = {};

		if (minDeliveryPrice) toUpdate.minDeliveryPrice = minDeliveryPrice;
		if (maxDeliveryPrice) toUpdate.maxDeliveryPrice = maxDeliveryPrice;
		if (deliveryPricePerKm) toUpdate.deliveryPricePerKm = deliveryPricePerKm;
		if (maxDeliveryKm) toUpdate.maxDeliveryKm = maxDeliveryKm;
		if (orderTimeoutMinutes) toUpdate.orderTimeoutMinutes = orderTimeoutMinutes;

		if (coordinates) toUpdate.coordinates = coordinates;

		if (Object.keys(toUpdate).length < 1) throw new PublicError('At least one param is required!');

		await this.db('storeConfig').where({ id: storeConfig.id }).update(toUpdate);
	}
}