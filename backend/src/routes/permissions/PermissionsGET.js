const Route = require('../../models/Route');

module.exports = class PermissionsGet extends Route {
	constructor() {
		super('/admin/permissions', 'get', { permissions: 'permissions', isPublic: false });
	}

	async run (req, res, user) {
		try {
			const permissions = await this.utils.roles.getPermissions();
			return res.json({
				message: 'Permissions successfully retrieved',
				permissions
			});
		} catch (err) {
			return super.error(res, err)
		}
	}
}
