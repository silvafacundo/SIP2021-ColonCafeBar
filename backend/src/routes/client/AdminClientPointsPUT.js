const Route = require('../../models/Route');


module.exports = class AdminClientPUT extends Route {
	constructor() {
		super('/admin/client/:clientId/points', 'put');
	}

	async run(req, res, user) {
		const { clientId } = req.params;
		const { points } = req.body;
		await this.utils.clients.setPoints(clientId, points);
		return res.json({ message: 'Client points successfully updated' });
	}
}