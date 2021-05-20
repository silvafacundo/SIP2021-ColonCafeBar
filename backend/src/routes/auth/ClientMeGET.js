const Route = require('../../models/Route');
module.exports = class ClientMeGET extends Route {
	constructor() {
		super('/auth/me', 'get');
	}

	async run(req, res, user) {
		try {
			return res.json({
				message: 'User auth',
				user
			});
		} catch (error) {
			return super.error(res, error);
		}

	}
}