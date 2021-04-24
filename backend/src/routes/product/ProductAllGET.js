const Route = require('../../models/Route');

module.exports = class ProductAllGET extends Route {
	constructor() {
		super('/product/getAll', 'get');
	}

	async run(req, res) {
		try {
			//get all products
			const products = await this.utils.products.getAllProducts();
			return res.json(products);
		} catch (error) {
			return super.error(res, error);
		}
	}
}