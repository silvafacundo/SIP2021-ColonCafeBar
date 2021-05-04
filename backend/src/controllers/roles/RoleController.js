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

	async createRole({ key, description, isActive = true }) {
		if (!key) throw Error('key is required!');
		if (!description) throw Error('description is required!');

		await this.db('roles').insert({
			key,
			description,
			isActive
		});
	}

	async getRole(roleId) {
		const role = await this.db('roles').where('id', roleId).first();

		return role;
	}
}