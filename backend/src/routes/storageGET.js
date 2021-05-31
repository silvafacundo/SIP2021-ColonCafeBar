const Route = require('../models/Route');

module.exports = class StorageGET extends Route {
	constructor() {
		super('/signedurl', 'get', { isPublic: true });
	}
	async run(req, res, user) {
		const [ signedUrl ] = await this.utils.storage.getSignedUrl();
		return res.json({ signedUrl });
	}
}