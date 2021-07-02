const Route = require('../../models/Route');


module.exports = class ClientsPOST extends Route {
	constructor() {
		super('/admin/clients', 'post', { permissions: 'clients', isPublic: false });
	}

	async run(req, res, user) {
		const { page, perPage, filters, orderBy } = req.body;
		const { clients, pagination } = await this.utils.clients.getClients({ page, perPage, filters, orderBy });
		return res.json({ message: 'Clients successfully retrieved', clients, pagination });
	}
}