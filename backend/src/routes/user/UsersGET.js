const Route = require('../../models/Route');

module.exports = class UsersGET extends Route {
	constructor() {
		super('/admin/users', 'get', { permissions: 'users', isPublic: false });
	}

	async run (req, res, user) {
		try {
			const users = await this.utils.users.getAllUsers({ onlyPublic: true });

			return res.json({
				message: 'Successfully retrieved user public info',
				users
			});
		} catch (error) {
			return super.error(res, error);
		}
	}
}