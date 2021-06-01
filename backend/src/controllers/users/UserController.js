const PublicError = require('../../errors/PublicError');
const User = require('../../models/admin/User');
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

	async createUser({ username, password, name, isAdmin = false }) {
		if (!username) throw Error('username is required!');
		if (!password) throw Error('password is required!');
		const { status, message } = this.utils.auth.isSafePassword(password);
		if (!status) throw new Error(message);

		if (username && typeof username !== 'string') throw new PublicError('username must be a string!');
		if (password && typeof password !== 'string') throw new PublicError('password must be a string!');

		const exists = await this.db('users').where({ username }).first();
		if (exists) throw new PublicError('An user with that username already exists');

		const hash = await this.utils.auth.encryptPassword(password);

		const newUser = await this.db('users')
			.insert({
				username,
				password: hash,
				name,
				isAdmin
			})
			.returning('*');

		// TODO: Ojo con esto que le saqué el await para que no crashee en caso de que no funcione
		await this.utils.firebase.auth().createUser({ uid: newUser.id });
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

		await this.db('users').where({ id: userId }).update(toUpdate);
	}

	async getUser({ userId, username, onlyPublic = false, ignoreInactive = false }) {
		if (!userId && !username) throw Error('userId or username is required!');

		const userSelect = [];

		if (onlyPublic) userSelect.push('users.id', 'users.username', 'users.name', 'users.isAdmin');
		else userSelect.push('users.*');

		const user = await this.db('users')
			.select(userSelect)
			.where(builder => {
				if (!ignoreInactive) builder.where({ isActive: true });

				if (userId) builder.where({ id: userId });
				if (username) builder.where({ username });
			})
			.first();

		let firebaseToken = '';
		try {
			firebaseToken = await this.utils.firebase.auth().createCustomToken(`${userId}`);
		} catch (err) {
			console.error('Failed to obtain custom firebase token', err);
		}
		if (!user) return null;
		return new User(this.server, user, firebaseToken);
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
		const users = await this.db('users').orderBy('users.id');

		if (withRoles) {
			for (const user of users) {
				user.roles = await this.utils.roles.getUserRoles(user.id);
			}
		}

		return users;
	}
};