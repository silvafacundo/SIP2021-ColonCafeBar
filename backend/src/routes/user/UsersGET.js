const Route = require('../../models/Route');

module.exports = class UsersGET extends Route {
	constructor() {
		super('/admin/users', 'get', { isPublic: false });
	}

	async run (req, res, user) {
		try {
			const users = await this.utils.users.getAllUsers({ onlyPublic: true });

			const hasPermission = await this.utils.roles.checkUserPermission(user.id, 'users');
			if (!hasPermission) return res.status(403).json({ message: 'You dont hace access to this resource' });

			return res.json({
				message: 'Successfully retrieved user public info',
				users
			});
		} catch (error) {
			return super.error(res, error);
		}
	}
}