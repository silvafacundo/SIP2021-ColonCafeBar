const Route = require('../../models/Route');

module.exports = class CategoryDeletePOST extends Route {
	constructor() {
		super('/category/delete', 'post');
	}

	async run(req, res) {
		const { id } = req.body;
		// Check if body parameters are valid
		if (!id) return res.status(400).json({ message: 'id is required to delete a category!' });
		try {
			// Delete into database
			const isEmpty = await this.utils.categories.isEmpty(id);

			if (!isEmpty){
				return res.json({ message: 'You cannot delete this category it has products associated!' });
			} else {
				await this.utils.categories.deleteCategory(id);
				return res.json({ message: 'Category successfully deleted!' });
			}
		} catch (error) {
			return super.error(res, error);
		}
	}
}