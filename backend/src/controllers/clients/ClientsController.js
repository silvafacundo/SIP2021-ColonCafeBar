const Client = require('../../models/clients/Client');
const PublicError = require('../../errors/PublicError');
const Server = require('../../Server');

module.exports = class ClientController {
	/**
	 *Creates an instance of ClientController.
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

	async createClient({ email, password, firstName, lastName, phoneNumber }) {
		if (!email) throw new PublicError('email is required!');
		if (!password) throw new PublicError('password is required!');
		if (!firstName) throw new PublicError('email is required!');

		const { status, message } = this.utils.auth.isSafePassword(password);
		if (!status) throw new PublicError(message);

		if (lastName && typeof lastName !== 'string') throw new PublicError('lastName must be a string!');
		if (phoneNumber && typeof phoneNumber !== 'string') throw new PublicError('phoneNumber must be a string!');

		const hash = await this.utils.auth.encryptPassword(password);

		const newUser = await this.db('clients').insert({
			email,
			password: hash,
			firstName,
			lastName,
			phoneNumber
		}).returning('*');
	}

	async getClient({ userId, email, onlyPublic = false }) {
		const clientsSelect = [];
		if (onlyPublic) {
			clientsSelect.push('clients.email', 'clients.firstName', 'clients.lastName', 'clients.phoneNumber');
		} else clientsSelect.push('clients.*');

		const user = await this.db('clients')
			.select(clientsSelect)
			.where(builder => {
				if (userId) builder.where({ id: userId });
				if (email) builder.where({ email });
			})
			.first();
		if (!user) return null;
		const addresses = await this.utils.addresses.getUserAddresses(user.id);
		return new Client(this.server, user, addresses);
	}

	async updateClient({ clientId, email, firstName, lastName, phoneNumber, password, isActive }) {
		if (!clientId) throw Error('clientId is required!');

		const client = await this.getClient({ userId: clientId });
		if (!client) throw Error('client not found!');

		if (password) {
			const { status, message } = this.utils.auth.isSafePassword(password);
			if (!status) throw new Error(message);
		}

		const toUpdate = {};
		if (email) toUpdate.email = email;
		if (firstName) toUpdate.firstName = firstName;
		if (lastName) toUpdate.lastName = lastName;
		if (phoneNumber) toUpdate.phoneNumber = phoneNumber;
		if (password) toUpdate.password = await this.utils.auth.encryptPassword(password);
		if (password) toUpdate.sessionValidDate = this.db.fn.now();
		if (typeof isActive === 'boolean') toUpdate.isActive = isActive;

		if (Object.keys(toUpdate).length < 1) throw PublicError('At least one param is required!');

		await this.db('clients').where({ id: clientId }).update(toUpdate);
	}

	async getClientHashPassword(userId) {
		const client = await this.db('clients').where('id', userId).first();
		return client.password;
	}

	async getClientLogin({ email, password }) {
		const user = await this.db('clients').where({ email, password }).first();
		return user;
	}
};