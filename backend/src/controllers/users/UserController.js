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
		if (exists && exists.isActive) throw Error('username already registered');

		const hash = await this.utils.auth.encryptPassword(password);

		const newData = {
			username,
			password: hash,
			isAdmin
		}

		if (!exists) {
			const newUser = await this.db('users')
				.insert(newData)
				.returning('*');

			return newUser[0];
		}

		const updateUser = await this.db('users')
			.where({ id: exists.id })
			.update({
				...newData,
				isActive: true
			})

		return updateUser;

	}

	async updateUser({ userId, username, password, isActive }) {
		if (!userId) throw Error('userId is required!');

		const user = await this.getUser({ userId });
		if (!user) throw Error('user not found!');

		const toUpdate = {};
		if (username) toUpdate.username = username;
		if (password) toUpdate.password = await this.utils.auth.encryptPassword(password);
		if (typeof isActive === 'boolean') toUpdate.isActive = isActive;
		if (Object.keys(toUpdate).length < 1) throw Error('At least one param is required!');

		await this.db('users').where({ id: userId }).update(toUpdate);
	}

	async deleteUser(userId) {
		if (!userId) throw Error('userId is required!');

		await this.db('usersRoles').where({ userId }).del();
		await this.db('users').where({ id: userId }).update({ isActive: false });
	}

	async getUser({ userId, username, onlyPublic = false }) {
		if (!userId && !username) throw Error('userId or username is required!');

		const userSelect = [];

		if (onlyPublic) userSelect.push('users.id', 'users.username', 'users.isAdmin');
		else userSelect.push('users.*');

		const user = await this.db('users')
			.select(userSelect)
			.where(builder => {
				builder.where({ isActive: true });

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

		if (onlyPublic) selectValues.push('users.id', 'users.username', 'users.isAdmin');
		else selectValues.push('users.*');

		const users = await this.db('users').select(selectValues);

		if (withRoles) {
			for (const user of users) {
				user.roles = await this.utils.roles.getUserRoles(user.id);
			}
		}

		return users;
	}
};