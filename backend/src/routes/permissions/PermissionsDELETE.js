const Route = require('../../models/Route');

module.exports = class PermissionsGet extends Route {
	constructor() {
		super('/admin/permissions', 'delete', { permissions: 'permissions' });
	}

	async run (req, res, user) {
		const { permissionId } = req.query;
		if (typeof permissionId === 'undefined' || permissionId == null)
			return res.status(400).json({ message: 'permissionId is required' });

		try {
			await this.utils.roles.deletePermission(permissionId);
			return res.json({
				message: 'Permissions successuflly deleted',
			});
		} catch (err) {
			console.error('Failed to delete permissions: ', err);
			return res.status(400).json({ message: 'Failed to delete permission' });
		}
	}
}
