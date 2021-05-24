const UserController = require('../users/UserController');
const Address = require('../../models/clients/Address');
const PublicError = require('../../errors/PublicError');

module.exports = class AddressController {
	constructor(server) {
		this.server = server;
	}

	get db() {
		return this.server.db;
	}

	get utils() {
		return this.server.utils;
	}

	async createAddress({ clientId, alias, city, neighborhood, corner, coordinates, street, number, floor, postalCode }) {
		// Check if parameters are valid
		if (!isValid(clientId)) throw Error('clientId is required!');
		if (!isValid(city)) throw new PublicError('City is required');
		if (!isValid(neighborhood)) throw new PublicError('Neighborhood is required');
		if (typeof street !== 'string') throw new PublicError('street is required and must be a string!');
		if (!isValid(number)) throw new PublicError('number is required!');
		if (!isValid(postalCode)) throw new PublicError('postalCode is required!');
		if (!isValid(corner)) throw new PublicError('corner is required');

		if (floor && typeof floor !== 'string') throw new PublicError('floor must be a string!');

		const client = await this.utils.clients.getClient({ userId: clientId });
		// Check if user is valid
		if (!client) throw Error('user does not exists!');

		// Insert address on database
		const address = await this.db('addresses').insert({
			clientId,
			alias,
			city,
			neighborhood,
			corner,
			coordinates,
			street,
			number,
			floor,
			postalCode,
		}).returning('*');

		return new Address(this.server, address[0]);
	}

	async getAddress(id) {
		const address = await this.db('addresses').where({ id }).first();
		if (!address) return null;
		return new Address(this.server, address);
	}

	async deleteAddress(addressId) {
		// TODO: Hacer soft delete
		await this.db('addresses').where({ id: addressId }).del();
	}

	async getUserAddresses(clientId) {
		const addresses = await this.db('addresses').where({ clientId });
		return addresses.map(address => new Address(this.server, address));
	}

	async isAddressFromClient(addressId, clientId) {
		const exists = await this.db('addresses').where({ addressId, clientId }).first();
		return !!exists;
	}
}


function isValid(value) {
	return typeof value !== 'undefined' && value !== null;
}