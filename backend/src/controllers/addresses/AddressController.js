const UserController = require('../users/UserController');
const Address = require('../../models/clients/Address');

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

	async createAddress({ clientId, street, number, floor, postalCode }) {
		// Check if parameters are valid
		if (!clientId) throw Error('clientId is required!');
		if (!street || typeof street !== 'string') throw Error('street is required and must be a string!');
		if (!number) throw Error('number is required!');
		if (!postalCode) throw Error('postalCode is required!');

		if (floor && typeof floor !== 'string') throw Error('floor must be a string!');

		const client = await this.utils.clients.getClient({ userId: clientId });
		// Check if user is valid
		if (!client) throw Error('user does not exists!');

		// Insert address on database
		const address = await this.db('addresses').insert({
			clientId,
			street,
			number,
			floor,
			postalCode,
		}).returning('*');

		return new Address(this.server, address[0]);
	}

	async getAddress(id) {
		const address = await this.db('addresses').where({ id }).first();
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