const Route = require('../../models/Route');

module.exports = class RolePOST extends Route {
	constructor() {
		super('/role', 'post', { isPublic: false });
	}

	async run (req, res, user) {
		const { name, description } = req.body;
		if (!name) return res.status(400).json({ message: 'name is required!' });
		if (!description) return res.status(400).json({ message: 'description is required!' });

		// TODO: check permission

		try {
			await this.utils.roles.createRole({ name, description });

			return res.json({ message: 'Successfully created role' });
		} catch (error) {
			return super.error(res, error);
		}
	}
}