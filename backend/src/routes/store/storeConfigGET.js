const Route = require('../../models/Route');

module.exports = class storeConfigGET extends Route {
	constructor() {
		super('/admin/store', 'get', { permissions: 'store' });
	}

	async run(req, res, user) {
		try {
			const storeConfig = await this.utils.store.getStoreConfig();
			if (!storeConfig) return res.json('Could not find store data');
			delete storeConfig.id;

			return res.json({
				message: 'Store data successfully retrieved',
				store: storeConfig
			})
		} catch (err) {
			return super.error(res, err);
		}
	}
}