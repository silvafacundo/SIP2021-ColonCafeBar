
const Route = require('../../models/Route');

module.exports = class UsersGET extends Route {
	constructor() {
		super('/admin/user/:id', 'post', { permissions: 'users', isPublic: false });
	}

	async run (req, res, user) {
		try {
			const { id } = req.params;
			let { isActive, name } = req.body;
			if (!isValid(isActive) && !isValid(name)) return res.status(400).json({ message: 'At least one option is required' })

			if (isValid(isActive)) {
				if (typeof isActive === 'string') isActive = isActive === 'true';
				else if (typeof isActive !== 'boolean') isActive = new Boolean(isActive);
			}

			await this.utils.users.updateUser({ userId: id, isActive, name });
			return res.json({ message: 'User successfully updated' });

		} catch (error) {
			return super.error(res, error);
		}
	}
}

function isValid(val) {
	return typeof val !== 'undefined' && val !== null;
}