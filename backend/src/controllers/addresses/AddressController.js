const UserController = require('../users/UserController');
const Address = require('../../models/clients/Address');
const PublicError = require('../../errors/PublicError');
/** @typedef {import('../../Server')} Server */

module.exports = class AddressController {
	/**
	 *Creates an instance of AddressController.
	 * @param {Server} server
	 */
	constructor(server) {
		this.server = server;
	}

	get db() {
		return this.server.db;
	}

	get utils() {
		return this.server.utils;
	}

	get models() {
		return this.server.models;
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
		const address = await this.models.Address.create({
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
		});

		return address;
	}

	async updateAddress({ addressId, alias, city, neighborhood, corner, coordinates, street, number, floor, postalCode }) {
		if (!isValid(addressId)) throw new PublicError('addressId is required');
		if (!isValid(city) && !isValid(neighborhood)
			&& typeof street !== 'string'
			&& !isValid(number)
			&& !isValid(alias)
			&& !isValid(coordinates)
			&& !isValid(floor)
			&& !isValid(postalCode)
			&& !isValid(corner)) throw new PublicError('At least one parameter is required');

		const toUpdate = { alias, city, neighborhood, corner, coordinates, street, number, floor, postalCode };
		const address = await this.getAddress(addressId);

		for (const key in toUpdate) {
			address[key] = toUpdate[key];
		}

		await address.save();
		return address;
	}

	async getAddress(id, fetchDeleted = false) {
		const whereQuery = {};
		if (!fetchDeleted)  whereQuery.isDeleted = false;

		const address = await this.models.Address.findByPk(id, { where: whereQuery });
		return address;
	}

	async deleteAddress(addressId) {
		const address = await this.getAddress(addressId);
		if (!address) return true;
		address.isDeleted = true;
		await address.save();
		return true;
	}

	async getUserAddresses(clientId, fetchDeleted = false) {
		const whereQuery = { clientId };
		if (!fetchDeleted)  whereQuery.isDeleted = false;

		const addresses = await this.models.Address.findAll({
			where: whereQuery
		});
		return addresses;
	}

	async isAddressFromClient(addressId, clientId) {
		const exists = await this.models.Address.findOne({
			where: {
				id: addressId,
				clientId
			}
		});
		return !!exists;
	}
}


function isValid(value) {
	return typeof value !== 'undefined' && value !== null;
}