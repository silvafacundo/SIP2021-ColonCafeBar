const Route = require('../../models/Route');

module.exports = class PermissionsGet extends Route {
	constructor() {
		super('/admin/permissions', 'get', { permissions: 'permissions' });
	}

	async run (req, res, user) {
		try {
			const permissions = await this.utils.roles.getPermissions();
			return res.json({
				message: 'Permissions successuflly retrieved',
				permissions
			});
		} catch (err) {
			console.error('Failed to get permissions: ', err);
			return res.status(400).json({ message: 'Failed to retrieve permissions' });
		}
	}
}
