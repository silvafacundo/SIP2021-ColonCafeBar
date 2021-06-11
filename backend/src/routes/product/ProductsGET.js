const Route = require('../../models/Route');

module.exports = class ProductAllGET extends Route {
	constructor() {
		super('/products', 'post', { isPublic: true });
	}

	async run(req, res) {
		try {
			//get all products
			let { page = 1, perPage = 20, filters, orderBy } = req.body;

			const result = await this.utils.products.getAllProducts({ page, perPage, filters: { ...filters, isActive: true }, orderBy });

			return res.json({
				message: 'Products successfully retrieved!',
				...result
			});
		} catch (error) {
			return super.error(res, error);
		}
	}
}