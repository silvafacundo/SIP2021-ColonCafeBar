const Route = require('../../models/Route');

module.exports = class CategoryUpdatePOST extends Route {
	constructor() {
		super('/category/update', 'post');
	}

	async run(req, res) {
		const { id, name } = req.body;
		// Check if body parameters are valid
		if (!id) return res.status(400).json({ message: 'id is required!' });
        if (!name && typeof name !== 'string') return res.status(400).json({ message: 'name is required!' });

		try {
            
            //controlar si id es vacio para que no crashee???
            await this.utils.categories.updateCategory({ id, name });
            return res.json({ message: 'Category successfully updated!' });
		} catch (error) {
			return super.error(res, error);
		}
	}
}