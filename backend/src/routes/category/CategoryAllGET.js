const Route = require('../../models/Route');

module.exports = class CategoryAllGET extends Route {
	constructor() {
		super('/category/getAll', 'get');
	}

	async run(req, res) {
		try {
			//get a category 
			const categories = await this.utils.categories.getAllCategories();
			return res.json(categories);
		} catch (error) {
			return super.error(res, error);
		}
	}
}