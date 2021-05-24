const Client = require('../../models/clients/Client');
const PublicError = require('../../errors/PublicError');

module.exports = class ClientController {
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
		if (!status) throw new new PublicError(message);

		if (lastName && typeof lastName !== 'string') throw new PublicError('lastName must be a string!');
		if (phoneNumber && typeof phoneNumber !== 'string') throw new PublicError('phoneNumber must be a string!');

		const hash = await this.utils.auth.encryptPassword(password);

		await this.db('clients').insert({
			email,
			password: hash,
			firstName,
			lastName,
			phoneNumber
		});
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

	async getClientHashPassword(userId) {
		const client = await this.db('clients').where('id', userId).first();
		return client.password;
	}

	async getClientLogin({ email, password }) {
		const user = await this.db('clients').where({ email, password }).first();
		return user;
	}
};