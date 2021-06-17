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

	get models() {
		return this.server.models;
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

		const user = await this.models.Client.create({
			email,
			password: hash,
			firstName,
			lastName,
			phoneNumber
		})
		return user;
	}

	async getClient({ userId, email, onlyPublic = false }) {
		let clientsSelect = null;
		if (onlyPublic) {
			clientsSelect = ['clients.email', 'clients.firstName', 'clients.lastName', 'clients.phoneNumber'];
		}

		const where = {};
		if (typeof userId !== 'undefined' && userId !== null) where.id = userId;
		if (typeof email !== 'undefined' && email !== null) where.email = email;
		const user = await this.models.Client.findOne({
			where,
			attributes: clientsSelect
		});
		return user;
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

		for (const key in toUpdate) {
			client[key] = toUpdate[key];
		}
		await client.save();
		return client;
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