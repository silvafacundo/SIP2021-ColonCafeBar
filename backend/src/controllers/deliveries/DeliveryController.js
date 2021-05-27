const PublicError = require('../../errors/PublicError');
const Delivery = require('../../models/deliveries/delivery');

module.exports = class DeliveryController {
	constructor(server) {
		this.server = server;
	}

	get db() {
		return this.server.db;
	}

	get utils() {
		return this.server.utils;
	}

	isPhoneNumberValid(number) {
		return number.match(/^[0-9\-\+]{9,15}$/);
	}

	async createDelivery({ name, lastName, phoneNumber }){
		//Check if parameters are valid
		if (!name && typeof name !=='string') throw Error('name is required');
		if (!lastName && typeof lastName !=='string') throw Error('last name is required');
		if (!phoneNumber && typeof phoneNumber !=='string') throw Error('phone number is required');
		if (phoneNumber && !this.isPhoneNumberValid(phoneNumber)) throw new PublicError('phone number not valid');

		const delivery = await this.db('deliveries').insert({ name, lastName, phoneNumber }).returning('*');

		return new Delivery(this.server, delivery);
	}

	//Get specific delivery
	async getDelivery(id, fetchDeleted = false) {
		const whereQuery = { id };
		if (!fetchDeleted) whereQuery.isDeleted = false;

		const delivery = await this.db('deliveries')
			.where(whereQuery)
			.first();

		if (!delivery) return null;

		return new Delivery(this.server, delivery);
	}

	//Get all deliveries loaded
	async getAllDeliveries(fetchDeleted = false) {
		const deliveries = await this.db('deliveries')
			.where(query => {
				if (!fetchDeleted) query.where({ isDeleted: false })
			})

		return deliveries.map(delivery => new Delivery(this.server, delivery));
	}

	//Delete specific Delivery
	async deleteDelivery(id) {
		await this.db('deliveries')
			.where({ id })
			.update({ isDeleted: true });

		return (true);
	}

	//Update specific Delivery
	async updateDelivery({ id, name, lastName, phoneNumber }) {
		if (name && typeof name !== 'string') throw new PublicError('name must be a string');
		if (lastName && typeof lastName !== 'string') throw new PublicError('lastName must be a string');
		if (phoneNumber && typeof phoneNumber !== 'string') throw new PublicError('phoneNumber must be a string');
		if (phoneNumber && !this.isPhoneNumberValid(phoneNumber)) throw new PublicError('phone number not valid');

		await this.db('deliveries')
			.where({ id })
			.update({
				name,
				lastName,
				phoneNumber
			});

		return (true);
	}
}