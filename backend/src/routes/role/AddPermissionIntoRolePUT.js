const Route = require('../../models/Route');

module.exports = class AddPermissionIntoRolePUT extends Route {
	constructor() {
		super('/admin/permission/role', 'put', { permissions: 'roles permissions' });
	}

	async run (req, res, user) {
		const { permissionId, roleId } = req.body;
		if (!permissionId) return res.status(400).json({ message: 'permissionId is required!' });
		if (!roleId) return res.status(400).json({ message: 'roleId is required!' });

		try {
			const role = await this.utils.roles.getRole(roleId);
			if (!role) return res.status(400).json({ message: 'Role not found!' });

			const permission = await this.utils.roles.getPermission({ permissionId });
			if (!permission) return res.status(400).json({ message: 'Permission not found!' });

			await this.utils.roles.addPermissionIntoRole(roleId, permissionId);

			return res.json({ message: 'Permission successfully added into role!' });
		} catch (error) {
			return super.error(res, error);
		}
	}
}
