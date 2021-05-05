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

	async createUser({ username, password, isAdmin = false }) {
		if (!username) throw Error('username is required!');
		if (!password) throw Error('password is required!');

		if (username && typeof username !== 'string') throw Error('username must be a string!');
		if (password && typeof password !== 'string') throw Error('password must be a string!');

		const exists = await this.db('users').where({ username }).first();
		if (exists) throw Error('username already registered');

		const hash = await this.utils.auth.encryptPassword(password);

		await this.db('users').insert({
			username,
			password: hash,
			isAdmin
		});
	}

	async getUser({ userId, username, onlyPublic = false }) {
		if (!userId && !username) throw Error('userId or username is required!');

		const userSelect = [];

		if (onlyPublic) userSelect.push('users.username', 'users.isAdmin', 'users.isAdmin');
		else userSelect.push('users.*');

		const user = await this.db('users')
			.select(userSelect)
			.where(builder => {
				if (userId) builder.where({ id: userId });
				if (username) builder.where({ username });
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

	async getAllUsers({ onlyPublic = false, withRoles = true }) {
		const selectValues = [];

		if (onlyPublic) selectValues.push('users.username', 'users.isAdmin', 'users.isAdmin');
		else selectValues.push('users.*');

		const users = await this.db('users').select(selectValues);

		if (withRoles) {
			// TODO: Agregar roles y permisos
		}

		return users;
	}
};