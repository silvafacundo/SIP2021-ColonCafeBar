const Client = require('../../models/clients/Client');

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
		if (!email) throw Error('email is required!');
		if (!password) throw Error('password is required!');
		if (!firstName) throw Error('email is required!');

		const { status, message } = this.utils.auth.isSafePassword(password);
		if (!status) throw new Error(message);

		if (lastName && typeof lastName !== 'string') throw Error('lastName must be a string!');
		if (phoneNumber && typeof phoneNumber !== 'string') throw Error('phoneNumber must be a string!');

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

		return new Client(this.server, user);
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