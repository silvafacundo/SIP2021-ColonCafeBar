const PublicError = require('../../errors/PublicError');
module.exports = class UserController {
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

	async createUser({ username, password, name, isAdmin = false }) {
		if (!username) throw Error('username is required!');
		if (!password) throw Error('password is required!');
		const { status, message } = this.utils.auth.isSafePassword(password);
		if (!status) throw new Error(message);

		if (username && typeof username !== 'string') throw new PublicError('username must be a string!');
		if (password && typeof password !== 'string') throw new PublicError('password must be a string!');

		const exists = await this.getUser({ username });
		if (exists) throw new PublicError('An user with that username already exists');

		const hash = await this.utils.auth.encryptPassword(password);

		const user = await this.models.User.create({
			username,
			password: hash,
			name,
			isAdmin
		})

		await this.utils.firebase.auth().createUser({ uid: user.id });
		return user;
	}

	async getUserHashPassword(userId) {
		const users = await this.db('users').where('id', userId).first();
		return users.password;
	}

	async updateUser({ userId, username, name, password, isActive }) {
		if (!userId) throw Error('userId is required!');

		const user = await this.getUser({ userId, ignoreInactive: true });
		if (!user) throw Error('user not found!');

		if (password) {
			const { status, message } = this.utils.auth.isSafePassword(password);
			if (!status) throw new Error(message);
		}

		const toUpdate = {};
		if (name) toUpdate.name  = name;
		if (username) toUpdate.username = username;
		if (password) toUpdate.password = await this.utils.auth.encryptPassword(password);
		if (password) toUpdate.sessionValidDate = this.db.fn.now();
		if (typeof isActive === 'boolean') toUpdate.isActive = isActive;

		if (user.isAdmin && isActive) delete toUpdate.isActive;

		if (Object.keys(toUpdate).length < 1) throw Error('At least one param is required!');

		for (const key in toUpdate) {
			user[key] = toUpdate[key];
		}
		await user.save()
		return user;
	}

	async getUser({ userId, username, onlyPublic = false, ignoreInactive = false }) {
		if (!userId && !username) throw Error('userId or username is required!');

		const userSelect = [];

		const where = {};
		if (!ignoreInactive) where.isActive = true;
		if (userId) where.id = userId;
		if (username) where.username = username;

		const scopes = ['defaultScope'];
		if (!onlyPublic) scopes.push('sensitive');

		const user = await this.models.User.scope(scopes).findOne({ where });
		if (!user) return null;

		let firebaseToken = '';
		try {
			firebaseToken = await this.utils.firebase.auth().createCustomToken(`${userId}`);
		} catch (err) {
			console.error('Failed to obtain custom firebase token', err);
		}

		user.firebaseToken = firebaseToken;
		return user;
	}

	async getUserLogin({ email, password }) {
		const user = await this.db('users').where({ email, password }).first();
		return user;
	}

	async assignUserRole({ userId, roleId }) {
		const user = await this.getUser({ userId, ignoreInactive: true });
		if (!user) throw new PublicError('user does not exists!');
		const role = await this.roles.getRole(roleId);
		if (!role) throw new PublicError('role does not exists!');

		const userRole = await this.db('usersRoles')
			.where('userId', userId)
			.where('roleId', roleId).first();

		if (userRole) throw new PublicError('this user already has this role!');

		await this.db('usersRoles').insert({
			userId,
			roleId,
		});
	}

	async getAllUsers({ withRoles = true } = {}) {
		const users = await this.models.User.findAll();
		return users;
	}
};