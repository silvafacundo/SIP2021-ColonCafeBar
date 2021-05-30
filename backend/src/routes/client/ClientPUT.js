const Route = require('../../models/Route');


module.exports = class ClientPUT extends Route {
	constructor() {
		super('/client', 'put');
	}

	async run(req, res, user) {
		const { phoneNumber, firstName, lastName } = req.body;
		await this.utils.clients.updateClient({
			clientId: user.id,
			phoneNumber,
			firstName,
			lastName
		});
		return res.json({ message: 'Client successfully updated' });
	}
}