const Route = require('../../models/Route');

module.exports = class CategoryAllGET extends Route {
	constructor() {
		super('/categories', 'get', { isPublic: false });
	}

	async run(req, res, user) {
		try {
			//get a category
			const categories = await this.utils.categories.getAllCategories();
			return res.json(categories);
		} catch (error) {
			return super.error(res, error);
		}
	}
}