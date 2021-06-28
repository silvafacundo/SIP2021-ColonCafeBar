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
	async createRole({ name, description, isActive = true }) {
		if (!name) throw Error('name is required!');
		if (!description) throw Error('description is required!');

		await this.models.Role.create({
			name,
			description
		})
	}

	async updateRole({ roleId, name, description }) {
		if (!roleId) throw Error('roleId is required');

		const toUpdate = {};
		if (typeof name === 'string') toUpdate.name = name;
		if (typeof description === 'string') toUpdate.description = description;
		if (Object.keys(toUpdate).length < 1) throw new PublicError('At least one param is required!');

		const role = await this.getRole(roleId);
		if (!role) throw new PublicError('The role doesn\'t exists');

		for (const key in toUpdate) {
			role[key] = toUpdate[key];
		}

		await role.save();
		return role;
	}

	async deleteRole({ roleId, forced = false }) {
		if (!roleId) throw Error('roleId is required!');

		if (!forced) {
			const usersWithRole = await this.db('usersRoles').where( { roleId });
			if (usersWithRole.length > 0) throw new new PublicError('The role cannot be deleted due one or more user has this role')
		}

		const role = await this.getRole(roleId);
		if (!role) return;

		await role.destroy()
	}

	async getRole(roleId) {
		if (!roleId) throw Error('roleId is required!');
		const role = await this.models.Role.findByPk(roleId);
		return role
	}

	async getRoles() {
		const roles = await this.models.Role.findAll();
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
		const role = await this.getRole(roleId);
		return role.permissions;
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
			const where = {};
			if (typeof permissionId !== 'undefined' && permissionId !== null) where.id = permissionId;
			if (permissionKey) where.key = permissionKey
			const permission = await this.models.Permission.findOne({
				where
			});
			return permission;
		} catch (error) {
			console.error(error);
			return null;
		}
	}

	async getPermissions() {
		const permissions = await this.models.Permission.findAll();
		return permissions;
	}

	async createPermission(name, key) {
		if (!name) throw Error('name is required!');
		if (!key) throw Error('key is required!');

		// check for alredy existing permission
		const exists = await this.models.Permission.findOne({
			where: { key },
			paranoid: false
		});
		if (exists && !exists.deletedAt) throw Error('Permission already exists');

		if (exists) {
			await exists.restore();
			exists.name = name;
			await exists.save();
			return exists;
		}

		const permission = await this.models.Permission.create({
			name,
			key
		});
		return permission;
	}

	async updatePermission({ permissionId, name }) {
		if (!permissionId) throw Error('id is required!');

		const toUpdate = {};
		if (typeof name === 'string') toUpdate.name = name;
		if (Object.keys(toUpdate).length < 1) throw Error('at least one param is required!');

		const permission = await this.models.Permission.findByPk(permissionId);
		if (!permission) throw new PublicError('Permission doesn\'t exists');

		for (const key in toUpdate){
			permission[key] = toUpdate[key];
		}

		await permission.save();

		return permission;
	}

	async deletePermission(permissionId) {
		if (typeof permissionId === 'undefined' || permissionId == null) throw new Error('permission doesn\'t exists');

		const permission = await this.models.Permission.findByPk(permissionId);
		if (!permission) return;
		await permission.destroy();
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
