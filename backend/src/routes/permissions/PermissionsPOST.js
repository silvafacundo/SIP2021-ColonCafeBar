const Route = require('../../models/Route');

module.exports = class PermissionsGet extends Route {
	constructor() {
		super('/admin/permissions', 'post', { permissions: 'permissions' });
	}

	async run (req, res, user) {
		const { name, key, description } = req.body;
		if (typeof name !== 'string') return res.status(400).json({ message: 'name should be a string' });
		if (typeof key !== 'string') return res.status(400).json({ message: 'key should be a string' });

		try {
			const permission = await this.utils.roles.createPermission(name, key);
			return res.json({
				message: 'Permissions successuflly created',
				permission
			});
		} catch (err) {
			return super.error(res, err)
		}
	}
}
