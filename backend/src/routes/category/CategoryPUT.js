const Route = require('../../models/Route');

module.exports = class CategoryPUT extends Route {
	constructor() {
		super('/admin/category', 'put');
	}

	async run(req, res, user) {
		const { id, name } = req.body;
		// Check if body parameters are valid
		if (!id) return res.status(400).json({ message: 'id is required!' });
		if (!name && typeof name !== 'string') return res.status(400).json({ message: 'name is required!' });

		try {
			const category = await this.utils.categories.getCategory(id);
			//if category doesn't exists, display a error message
			if (!category){
				return res.json('There are no category with that id!');
			} else {
				await this.utils.categories.updateCategory({ id, name });
				return res.json({ message: 'Category successfully updated!' });
			}
		} catch (error) {
			return super.error(res, error);
		}
	}
}