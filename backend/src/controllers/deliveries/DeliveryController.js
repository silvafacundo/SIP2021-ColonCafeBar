const PublicError = require('../../errors/PublicError');
const Delivery = require('../../models/deliveries/delivery');

module.exports = class DeliveryController {
	constructor(server) {
		this.server = server;
	}

	get db() {
		return this.server.db;
	}

	get models() {
		return this.server.models;
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

		const delivery = await this.models.Delivery.create({ name, lastName, phoneNumber });
		return delivery;
	}

	//Get specific delivery
	async getDelivery(id, fetchDeleted = false) {
		const whereQuery = { id };
		if (!fetchDeleted) whereQuery.isDeleted = false;

		const delivery = await this.models.Delivery.findByPk(id);
		return delivery;
	}

	//Get all deliveries loaded
	async getAllDeliveries(fetchDeleted = false) {
		const where = {}
		if (!fetchDeleted) where.isDeleted = false;
		const deliveries = await this.models.Delivery.findAll({
			where
		});
		return deliveries;
	}

	//Delete specific Delivery
	async deleteDelivery(id) {
		const delivery = await this.models.Delivery.findByPk(id);
		delivery.isDeleted = true;
		await delivery.save();
		return (true);
	}

	//Update specific Delivery
	async updateDelivery({ id, name, lastName, phoneNumber }) {
		if (name && typeof name !== 'string') throw new PublicError('name must be a string');
		if (lastName && typeof lastName !== 'string') throw new PublicError('lastName must be a string');
		if (phoneNumber && typeof phoneNumber !== 'string') throw new PublicError('phoneNumber must be a string');
		if (phoneNumber && !this.isPhoneNumberValid(phoneNumber)) throw new PublicError('phone number not valid');

		const delivery = await this.getDelivery(id);
		if (name) delivery.name = name;
		if (lastName) delivery.lastName = lastName;
		if (phoneNumber) delivery.phoneNumber = phoneNumber;
		await delivery.save();
		return true;
	}
}