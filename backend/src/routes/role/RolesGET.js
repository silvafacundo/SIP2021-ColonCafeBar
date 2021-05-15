const Route = require('../../models/Route');

module.exports = class RolesGET extends Route {
	constructor() {
		super('/admin/roles', 'get', { permissions: 'roles' });
	}

	async run (req, res, user) {
		try {
			const roles = await this.utils.roles.getRoles();

			return res.json({
				message: 'Roles successfully retrieved!',
				roles
			});
		} catch (error) {
			return super.error(res, error);
		}
	}
}
