const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
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

	async generateJWT(client, isAdmin = false) {
		const jwt = JWT.sign({
			sub: client.id,
			iat: Date.now(),
			isAdmin
		}, process.env.JWT_SECRET, { expiresIn: '30d' });

		return jwt;
	}
	async generateResetPasswordToken(userId, isAdmin = false ) {
		const tableName = isAdmin ? 'users' : 'clients';
		let user = this.db(tableName).where('id', userId).first();
		if (!user) throw new Error('Invalid user');
		const token = uuidv4();
		const result = await this.db('resetPassword').insert({
			accountId: userId,
			accountType: tableName,
			token
		}).returning('*');
		return result[0];
	}

	async resetPassword(password, token) {
		const tokenData = await this.db('resetPassword').where({ token }).first();
		if (!tokenData) throw new Error('Invalid token');

		if (tokenData.consumed) throw new Error('token already used');

		const tokenCreation = new Date(tokenData.createdAt).getTime();
		// Chequea si el token tiene mas de 24hs
		if ((Date.now() - tokenCreation) > (24 * 60 * 60 * 1000)) throw new Error('Invalid token')

		const { accountId: userId, accountType } = tokenData;
		if (accountType === 'users') {
			await this.utils.users.updateUser({ userId, password });
		} else if (accountType === 'clients') {
			// TODO: Implement this
			console.warn('TO IMPLEMENT...');
		}

		await this.db('resetPassword').where('id', tokenData.id).update({
			consumed: true
		});
	}
};
