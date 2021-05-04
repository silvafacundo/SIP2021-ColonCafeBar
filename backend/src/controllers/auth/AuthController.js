const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

module.exports = class AuthController {
	constructor(server) {
		this.server = server;
	}

	get db() {
		return this.server.db;
	}

	get utils() {
		return this.server.utils;
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
};