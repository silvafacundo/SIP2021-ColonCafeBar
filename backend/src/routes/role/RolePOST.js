const Route = require('../../models/Route');

module.exports = class RolePOST extends Route {
	constructor() {
		super('/role', 'POST');
	}

	async run (req, res) {
		const { key, description } = req.body;
		if (!key) return res.status(400).json({ message: 'key is required!' });
		if (!description) return res.status(400).json({ message: 'description is required!' });

		try {
			await this.utils.roles.createRole({ key, description });

			return res.json({ message: 'Successfully created role' });
		} catch (error) {
			return super.error(res, error);
		}
	}
}