const Route = require('../../models/Route');

module.exports = class ClientResetPasswordPOST extends Route {
	constructor() {
		super('/reset', 'post');
	}

	async run(req, res, client) {
		try {
			const { password, token } = req.body;
			if (typeof password !== 'string') return res.status(400).json({ message: 'password is required' });
			if (typeof token !== 'string') return res.status(400).json({ message: 'token is required' });

			await this.utils.auth.resetPassword(password, token);
			return res.json({
				message: 'Password successfully reseted',
			});
		} catch (error) {
			return res.status(400).json({ message: error.message });
		}
	}
}
