const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

module.exports = class UserController {
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

	async generateJWT(user) {
		const jwt = JWT.sign({
			sub: user.id,
			iat: Date.now()
		}, process.env.JWT_SECRET, { expiresIn: '30d' });

		return jwt;
	}

	async createUser({ email, password, firstName, lastName, phoneNumber }) {
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

	async getUser({ userId, email, onlyPublic = false }) {
		const select = onlyPublic? 'email, firstName, lastName, phoneNumber' : '*'
		const user = await this.db('users')
			.select([select])
			.where(builder => {
				if (userId) builder.where({ id: userId });
				if (email) builder.where({ email });
			})
			.first();
		return user;
	}


	async getUserLogin({ email, password }) {
		const user = await this.db('users').where({ email, password }).first();
		return user;
	}
};