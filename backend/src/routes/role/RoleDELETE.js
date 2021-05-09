const Route = require('../../models/Route');

module.exports = class RoleDELETE extends Route {
	constructor() {
		super('/admin/role', 'delete');
	}

	async run (req, res, user) {
		const { roleId } = req.query;
		if (!roleId) return res.status(400).json({ message: 'roleId is required!' });

		// TODO: check permission

		try {
			await this.utils.roles.deleteRole({ roleId });

			return res.json({ message: 'Role successfully deleted!' });
		} catch (error) {
			return super.error(res, error);
		}
	}
}
