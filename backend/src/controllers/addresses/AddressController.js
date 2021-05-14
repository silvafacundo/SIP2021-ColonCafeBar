const UserController = require('../users/UserController');

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

	async createAddress({ userId, street, number, floor, postalCode }) {
		// Check if parameters are valid
		if (!userId) throw Error('userId is required!');
		if (!street || typeof street !== 'string') throw Error('street is required and must be a string!');
		if (!number) throw Error('number is required!');
		if (!postalCode) throw Error('postalCode is required!');

		if (floor && typeof floor !== 'string') throw Error('floor must be a string!');

		const user = await this.users.getUser({ userId });
		// Check if user is valid
		if (!user) throw Error('user does not exists!');

		// Insert address on database
		const address = this.db('addresses').insert({
			userId,
			street,
			number,
			floor,
			postalCode,
		});

		return address;
	}

	async getAddress(id) {
		const address = await this.db('addresses').where({ id }).first();
		return address;
	}

	async getUserAddresses(userId) {
		const addresses = await this.db('addresses').where({ userId });
		return addresses;
	}
}