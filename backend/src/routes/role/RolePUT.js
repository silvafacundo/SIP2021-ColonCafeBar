const Route = require('../../models/Route');

module.exports = class RolePUT extends Route {
	constructor() {
		super('/admin/role', 'put', { permissions: 'roles' });
	}

	async run (req, res, user) {
		const { roleId, name, description } = req.body;
		if (!roleId) return res.status(400).json({ message: 'roleId is required!' });

		try {
			await this.utils.roles.updateRole({ roleId, name, description });

			return res.json({ message: 'Role successfully updated!' });
		} catch (error) {
			return super.error(res, error);
		}
	}
}
