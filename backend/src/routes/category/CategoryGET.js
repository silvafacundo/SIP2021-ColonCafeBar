const Route = require('../../models/Route');

module.exports = class CategoryGET extends Route {
	constructor() {
		super('/category', 'get', { isPublic: true });
	}

	async run(req, res, user) {
		const { id } = req.query;
		// Check if body parameters are valid
		if (!id) return res.status(400).json({ message: 'id is required!' });

		try {
			//get a category
			const category = await this.utils.categories.getCategory( id );
			if (!category){
				return res.json('There are no category whit that id!');
			} else {
				return res.json(category);
			}
		} catch (error) {
			return super.error(res, error);
		}
	}
}