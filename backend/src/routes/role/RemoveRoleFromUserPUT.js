const Route = require('../../models/Route');

module.exports = class RemoveRoleFromUserPUT extends Route {
	constructor() {
		super('/admin/role/user', 'delete', { permissions: 'users roles' });
	}

	async run (req, res, user) {
		const { roleId, userId } = req.query;
		if (!roleId) return res.status(400).json({ message: 'roleId is required!' });
		if (!userId) return res.status(400).json({ message: 'userId is required!' });

		try {
			const user = await this.utils.users.getUser({ userId });
			if (!user) return res.status(400).json({ message: 'User not found!' });

			const role = await this.utils.roles.getRole(roleId);
			if (!role) return res.status(400).json({ message: 'Role not found!' });

			await this.utils.roles.removeRoleFromUser(userId, roleId);

			return res.json({ message: 'Role successfully removed from user!' });
		} catch (error) {
			return super.error(res, error);
		}
	}
}
