const Route = require('../../models/Route');

module.exports = class meGET extends Route {
	constructor() {
		super('/me', 'get', { publicRoute: false });
	}

	async run (req, res, user) {
		const userPublicInfo = await  this.utils.users.getUser({ userId: user.id, onlyPublic: true });

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