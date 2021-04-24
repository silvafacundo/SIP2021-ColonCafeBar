const Route = require('../../models/Route');

module.exports = class meGET extends Route {
	constructor() {
		super('/me', 'get', { isPublic: false });
	}

	async run (req, res, user) {
		const userId = user.id;
		const userPublicInfo = await this.utils.users.getUser({ userId, onlyPublic: true });

		return res.json({
			message: 'Successfully retrieved user public info',
			user: {
				email: userPublicInfo.email,
				firstName: userPublicInfo.firstName,
				lastName: userPublicInfo.lastName,
				phoneNumber: userPublicInfo.phoneNumber,
			}
		});
	}
}