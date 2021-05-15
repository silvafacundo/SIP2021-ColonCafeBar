const Route = require('../../models/Route');

module.exports = class RemovePermissionFromRoleDELETE extends Route {
	constructor() {
		super('/admin/permission/role', 'delete', { permissions: 'roles permissions' });
	}

	async run (req, res, user) {
		const { permissionId, roleId } = req.query;
		if (!permissionId) return res.status(400).json({ message: 'permissionId is required!' });
		if (!roleId) return res.status(400).json({ message: 'roleId is required!' });

		try {
			const role = await this.utils.roles.getRole(roleId);
			if (!role) return res.status(400).json({ message: 'Role not found!' });

			const permission = await this.utils.roles.getPermission({ permissionId });
			if (!permission) return res.status(400).json({ message: 'Permission not found!' });

			await this.utils.roles.removePermissionFromRole(roleId, permissionId);

			return res.json({ message: 'Permission successfully removed from role!' });
		} catch (error) {
			return super.error(res, error);
		}
	}
}
