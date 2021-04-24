const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

// Controllers
const RoleController = require('../roles/RoleController');

module.exports = class UserController {
	constructor(db) {
		this.db = db;
		this.roles = new RoleController(db);
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


	async getUserLogin({ email, password }) {
		const user = await this.db('users').where({ email, password }).first();
		return user;
	}

	async assignUserRole({ userId, roleId }) {
		const user = await this.getUser({ userId });
		if (!user) throw Error('user does not exists!');
		const role = await this.roles.getRole(roleId);
		if (!role) throw Error('role does not exists!');

		const userRole = await this.db('usersRoles')
			.where('userId', userId)
			.where('roleId', roleId).first();

		if (userRole) throw Error('this user already has this role!');

		await this.db('usersRoles').insert({
			userId,
			roleId,
		});
	}
};