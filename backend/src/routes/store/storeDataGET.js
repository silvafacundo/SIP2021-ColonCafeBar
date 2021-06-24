const Route = require('../../models/Route');

module.exports = class storeDataGET extends Route {
	constructor() {
		super('/admin/store', 'get', { permissions: 'store' });
	}

	async run(req, res, user) {
		try {
			const storeData = await this.utils.store.getStoreData();
			if (!storeData) return res.json('Could not find store data');
			delete storeData.id;

			return res.json({
				message: 'Store data successfully retrieved',
				store: storeData
			})
		} catch (err) {
			return super.error(res, err);
		}
	}
}