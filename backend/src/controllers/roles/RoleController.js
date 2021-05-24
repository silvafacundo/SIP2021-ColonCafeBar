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
		if (!roleId) throw Error('roleId is required');

		const toUpdate = {};
		if (typeof name === 'string') toUpdate.name = name;
		if (typeof description === 'string') toUpdate.description = description;
		if (Object.keys(toUpdate).length < 1) throw new PublicError('At least one param is required!');

		await this.db('roles').where({ id: roleId }).update(toUpdate);
	}

	async deleteRole({ roleId, forced = false }) {
		if (!roleId) throw Error('roleId is required!');

		if (!forced) {
			const usersWithRole = await this.db('usersRoles').where( { roleId });
			if (usersWithRole.length > 0) throw new new PublicError('The role cannot be deleted due one or more user has this role')
		}

		const deleteTransaction = await this.db.transaction();

		try {
			await this.db('roles')
				.where({ id: roleId })
				.update({ isActive: false })
				.transacting(deleteTransaction);
			await this.db('usersRoles')
				.where({ roleId })
				.del()
				.transacting(deleteTransaction);

			await deleteTransaction.commit();
		} catch (error) {
			deleteTransaction.rollback();
			throw error;
		}
	}

	async getRole(roleId) {
		if (!roleId) throw Error('roleId is required!');

		const role = await this.db('roles').where({ id: roleId, isActive: true }).first();
		if (!role) return null;
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

	/**
	 * Checks if a user has a specific permission
	 *
	 * @param { number | string } userId - User ID
	 * @param { string[] } permissions - Permission's key
	 */
	async checkUserPermission(userId, permissions) {
		if (!userId) throw Error('userId is required!');
		if (!permissions) throw Error('permission is required!');
		if (typeof permissions === 'string') permissions = [permissions];

		const user = await this.utils.users.getUser({ userId });
		if (!user) throw Error('user not found!');
		if (user.isAdmin) return true;

		const rolesIdSubQuery = this.db('usersRoles')
			.select('roleId')
			.where({ userId, isActive: true });

		const hasPermission = await this.db('permissionsRoles')
			.innerJoin('permissions', 'permissionsRoles.permissionId', 'permissions.id')
			.where('permissionsRoles.roleId', 'in', rolesIdSubQuery)
			.where('permissions.isActive', true)
			.where('permissions.key', 'in', permissions);

		return hasPermission.length === permissions.length;
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

	async updatePermission({ permissionId, name }) {
		if (!permissionId) throw Error('id is required!');

		const toUpdate = {};
		if (typeof name === 'string') toUpdate.name = name;
		if (Object.keys(toUpdate).length < 1) throw Error('at least one param is required!');

		await this.db('permissions').where({ id: permissionId }).update(toUpdate);
	}

	async deletePermission(permissionId) {
		if (typeof permissionId === 'undefined' || permissionId == null) throw new Error('permission doesn\'t exists');

		const deleteTransaction = await this.db.transaction();

		try {
			await this.db('permissions')
				.where('id', permissionId)
				.update({ isActive: false })
				.transacting(deleteTransaction);
			await this.db('permissionsRoles')
				.where({ permissionId })
				.del()
				.transacting(deleteTransaction);

			await deleteTransaction.commit();
		} catch (error) {
			deleteTransaction.rollback();
			throw error;
		}
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
		if (!user) throw new PublicError('user not found!');

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
