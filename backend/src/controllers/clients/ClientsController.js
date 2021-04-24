const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

module.exports = class ClientController {
	constructor(db) {
		this.db = db;
	}

	async encryptPassword(password) {
		const hashPassword = await bcrypt.hash(password, 10);
		return hashPassword;
	}

	async compareHash(text, hashedText) {
		const result = await bcrypt.compare(text, hashedText);
		return result;
	}

	async generateJWT(client) {
		const jwt = JWT.sign({
			sub: client.id,
			iat: Date.now()
		}, process.env.JWT_SECRET, { expiresIn: '30d' });

		return jwt;
	}

	async createClient({ email, password, firstName, lastName, phoneNumber }) {
		if (!email) throw Error('email is required!');
		if (!password) throw Error('password is required!');
		if (!firstName) throw Error('email is required!');

		if (lastName && typeof lastName !== 'string') throw Error('lastName must be a string!');
		if (phoneNumber && typeof phoneNumber !== 'string') throw Error('phoneNumber must be a string!');

		const hash = await this.encryptPassword(password);

		await this.db('users').insert({
			email,
			password: hash,
			firstName,
			lastName,
			phoneNumber
		});
	}

	async getClient({ userId, email, onlyPublic = false }) {
		const userSelect = [];
		if (onlyPublic) {
			userSelect.push('users.email', 'users.firstName', 'users.lastName', 'users.phoneNumber');
		} else userSelect.push('users.*');

		const user = await this.db('users')
			.select(userSelect)
			.where(builder => {
				if (userId) builder.where({ id: userId });
				if (email) builder.where({ email });
			})
			.first();
		return user;
	}


	async getClientLogin({ email, password }) {
		const user = await this.db('users').where({ email, password }).first();
		return user;
	}
};