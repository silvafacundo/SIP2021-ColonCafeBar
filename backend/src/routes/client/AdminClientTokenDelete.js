const Route = require('../../models/Route');


module.exports = class AdminClientTokenDelete extends Route {
	constructor() {
		super('/admin/client/:clientId/token', 'delete');
	}

	async run(req, res, user) {
		const { clientId } = req.params;
		await this.utils.clients.invalidateTokens(clientId);
		return res.json({ message: 'Client tokens are now invalidated' });
	}
}