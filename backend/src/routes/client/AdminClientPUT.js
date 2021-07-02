const Route = require('../../models/Route');


module.exports = class AdminClientPUT extends Route {
	constructor() {
		super('/admin/client/:clientId', 'put', { permissions: 'clients', isPublic: false });
	}

	async run(req, res, user) {
		const { clientId } = req.params;
		const { phoneNumber, firstName, lastName, isActive } = req.body;
		await this.utils.clients.updateClient({ clientId, phoneNumber, firstName, lastName, isActive });
		return res.json({ message: 'Client successfully updated' });
	}
}