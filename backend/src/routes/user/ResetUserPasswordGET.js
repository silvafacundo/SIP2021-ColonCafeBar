const Route = require('../../models/Route');
module.exports = class ResetUserPasswordGET extends Route {
	constructor() {
		super('/admin/user/reset', 'get', { permissions: 'users', isPublic: false });
	}

	async run(req, res, user) {
		try {
			const { userId } = req.query;
			if (typeof userId === 'undefined' || userId === null) return res.status(400).json({ message: 'userId is requried' });
			const { token } = await this.utils.auth.generateResetPasswordToken(userId, true);
			return res.json({
				message: 'Token successfully generated',
				token
			});
		} catch (error) {
			return super.error(res, error);
		}

	}
}