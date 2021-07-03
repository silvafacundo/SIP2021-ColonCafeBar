const Route = require('../../models/Route');


module.exports = class ClientPUT extends Route {
	constructor() {
		super('/client', 'put');
	}

	async run(req, res, user) {
		const { email, phoneNumber, firstName, lastName } = req.body;
		await this.utils.clients.updateClient({
			clientId: user.id,
			email,
			phoneNumber,
			firstName,
			lastName
		});
		return res.json({ message: 'Client successfully updated' });
	}
}