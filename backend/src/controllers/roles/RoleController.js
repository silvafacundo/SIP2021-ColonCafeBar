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

	async createRole({ name, description, isActive = true }) {
		if (!name) throw Error('name is required!');
		if (!description) throw Error('description is required!');

		await this.db('roles').insert({
			name,
			description,
			isActive
		});
	}

	async updateRole({ roleId, name, description }) {
		if (!roleId) throw Error('roleId');

		const toUpdate = {};
		if (typeof name === 'string') toUpdate.name = name;
		if (typeof description === 'string') toUpdate.description = description;
		if (Object.keys(toUpdate).length < 1) throw Error('at least one param is required!');

		await this.db('roles').where({ id: roleId }).update(toUpdate);
	}

	async deleteRole({ roleId }) {
		if (!roleId) throw Error('roleId is required!');
		await this.db('roles').where({ id: roleId }).update({ isActive: false });
	}

	async getRole(roleId) {
		if (!roleId) throw Error('roleId is required!');

		const role = await this.db('roles').where({ id: roleId, isActive: true }).first();
		const permissions = await this.getRolePermissions(role.id);

		return { ...role, permissions };
	}

	async getRoles() {
		const roles = await this.db('roles').where({ isActive: true });
		const rolePermissions = await this.db('permissionsRoles')
			.select(['permissionsRoles.roleId', 'permissions.*'])
			.innerJoin('permissions', 'permissionsRoles.permissionId', 'permissions.id');

		roles.forEach(role => {
			const permissions = rolePermissions.filter(rp => rp.roleId === role.id);
			role.permissions = permissions.map(permission => ({
				...permission,
				roleId: undefined,
				permissionId: undefined
			}))
		})

		return roles;
	}

	async getRolePermissions(roleId) {
		if (!roleId) throw Error('RoleId is required!');

		const permissions = await this.db('permissionsRoles')
			.select('permissions.*')
			.innerJoin('permissions', 'permissionsRoles.permissionId', 'permissions.id')
			.where('permissionsRoles.roleId', roleId)
			.where('permissions.isActive', true)

		return permissions;
	}

	async addPermissionIntoRole(roleId, permissionId) {
		if (!roleId) throw Error('roleId is required!');
		if (!permissionId) throw Error('permissionId is required!');

		await this.db('permissionsRoles').insert({ roleId, permissionId });
	}

	async removePermissionFromRole(roleId, permissionId) {
		if (!roleId) throw Error('roleId is required!');
		if (!permissionId) throw Error('permissionId is required!');

		await this.db('permissionsRoles').where({ roleId, permissionId }).del();
	}

	async getPermission({ permissionId, permissionKey }) {
		if (!permissionId && !permissionKey) throw Error('permissionId or permissionKey is required!');

		try {
			const permission = await this.db('permissions')
				.where(builder => {
					builder.where({ isActive: true });
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
		const permissions = await this.db('permissions').where({ isActive: true });
		return permissions;
	}

	async createPermission(name, key) {
		if (!name) throw Error('name is required!');
		if (!key) throw Error('key is required!');

		// check for alredy existing permission
		const exists = await this.db('permissions').where({ key }).first();
		if (exists && exists.isActive) throw Error('Permission already exists');

		const newData = { name, key, isActive: true };

		if (!exists) {
			const newPermission = await this.db('permissions')
				.insert(newData)
				.returning('*');

			return newPermission[0];
		}

		const updatePermission = await this.db('permissions')
			.where({ id: exists.id })
			.update({
				...newData,
				isActive: true
			})
			.returning('*');

		return updatePermission[0];
	}

	async deletePermission(permissionId) {
		if (typeof permissionId === 'undefined' || permissionId == null) throw new Error('permission doesn\'t exists');
		await this.db('permissions')
			.where('id', permissionId)
			.update({ isActive: false });
	}

	async assignRoleIntoUser(userId, roleId) {
		if (!userId) throw Error('userId is required!');
		if (!roleId) throw Error('roleId is required!');

		await this.db('usersRoles').insert({ userId, roleId });
	}

	async removeRoleFromUser(userId, roleId) {
		if (!userId) throw Error('userId is required!');
		if (!roleId) throw Error('roleId is required!');

		await this.db('usersRoles').where({ userId, roleId }).del();
	}

	async getUserRoles(userId, withPermissions = true) {
		if (!userId) throw Error('userId is required!');

		const user = await this.utils.users.getUser({ userId, ignoreInactive: true });
		if (!user) throw Error('user not found!');

		const roles = await this.db('usersRoles')
			.select(['roles.*'])
			.innerJoin('roles', 'usersRoles.roleId', 'roles.id')
			.where('usersRoles.userId', userId);

		if (withPermissions) {
			for (const role of roles) {
				role.permissions = await this.getRolePermissions(role.id);
			}
		}

		return roles;
	}
}
