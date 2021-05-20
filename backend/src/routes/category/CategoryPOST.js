const Route = require('../../models/Route');

module.exports = class CategoryPOST extends Route {
	constructor() {
		super('/admin/category', 'post');
	}

	async run(req, res, user) {
		const { name } = req.body;
		// Check if body parameters are valid
		if (!name) return res.status(400).json({ message: 'name is required!' });

		try {
			// Insert into database
			await this.utils.categories.createCategory({ name });
			return res.json({ message: 'Category successfully created!' });
		} catch (error) {
			return super.error(res, error);
		}
	}
}