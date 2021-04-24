const Route = require('../../models/Route');

module.exports = class clientGET extends Route {
	constructor() {
		super('/client', 'get', { publicRoute: false });
	}

	async run (req, res, client) {
		const userPublicInfo = await  this.utils.client.getUser({ userId: client.id, onlyPublic: true });

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