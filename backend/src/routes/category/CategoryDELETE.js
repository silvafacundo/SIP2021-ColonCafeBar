const Route = require('../../models/Route');

module.exports = class CategoryDELETE extends Route {
	constructor() {
		super('/admin/category', 'delete', { isPublic: false });
	}

	async run(req, res, user) {
		const { id } = req.query;
		// Check if body parameters are valid
		if (!id) return res.status(400).json({ message: 'id is required to delete a category!' });
		try {
			// Delete into database
			const isEmpty = await this.utils.categories.isEmpty(id);
			if (isEmpty){
				return res.status(400).json({ message: 'You cannot delete this category it has products associated!' });
			} else {
				await this.utils.categories.deleteCategory(id);
				return res.json({ message: 'Category successfully deleted!' });
			}
		} catch (error) {
			return super.error(res, error);
		}
	}
}