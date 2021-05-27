const Route = require('../../models/Route');

module.exports = class ProductAllGET extends Route {
	constructor() {
		super('/admin/products', 'post');
	}

	async run(req, res) {
		try {
			//get all products
			let { page = 1, perPage = 20, filters, orderBy } = req.body;

			const products = await this.utils.products.getAllProducts({ page, perPage, filters: { ...filters }, orderBy });

			return res.json({
				message: 'Products successfully retrieved!',
				payload: products
			});
		} catch (error) {
			return super.error(res, error);
		}
	}
}