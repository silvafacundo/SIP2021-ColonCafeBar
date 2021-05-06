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

		const permissions = await this.getRolePermissions(role.id);

		return { ...role, permissions };
	}

	async getRolePermissions(roleId) {
		if (!roleId) throw Error('RoleId is required!');

		const permissions = await this.db('permissionsRoles')
			.select('permissions.*')
			.innerJoin('permissions', 'permissionsRoles.permissionId', 'permissions.id')
			.where('permissionsRole.roleId', roleId);

		return permissions;
	}

	async getPermission({ permissionId, permissionKey }) {
		if (!permissionId && !permissionKey) throw Error('permissionId or permissionKey is required!');

		try {
			const permission = await this.db('permissions')
				.where(builder => {
					if (permissionId) builder.where({ id: permissionId });
					if (permissionKey) builder.where({ key: permissionKey });
				})
				.first();

			return permission;
		} catch (error) {
			console.error(error);
			return null;
		}
	}

	async getPermissions() {
		const permissions = await this.db('permissions');
		return permissions;
	}

	async createPermission(name, key) {
		if (!name) throw Error('name is required!');
		if (!key) throw Error('key is required!');

		// check for alredy existing permission
		const exists = await this.getPermission({ permissionKey: key });
		if (exists) throw Error('Permission already exists');

		await this.db('permissions').insert({ name, key });
	}

	async assignPermissionIntoRole(roleId, permissionId) {
		if (!roleId) throw Error('RoleId is required!');
		if (!permissionId) throw Error('permissionId is required!');

		await this.db('permissionsRoles').insert({ roleId, permissionId });
	}

	async removePermissionFromRole(roleId, permissionId) {
		if (!roleId) throw Error('RoleId is required!');
		if (!permissionId) throw Error('permissionId is required!');

		await this.db('permissionsRoles').where({ roleId, permissionId }).del();
	}

	async assignRoleIntoUser(userId, roleId) {
		if (!userId) throw Error('userId is required!');
		if (!roleId) throw Error('roleId is required!');

		await this.db('userRoles').insert({ userId, roleId });
	}

	async removeRoleFromUser(userId, roleId) {
		if (!userId) throw Error('userId is required!');
		if (!roleId) throw Error('roleId is required!');

		await this.db('userRoles').where({ userId, roleId }).del();
	}
}