const Route = require('../../models/Route');

module.exports = class ProductAllGET extends Route {
	constructor() {
		super('/products', 'get', { isPublic: true });
	}

	async run(req, res) {
		try {
			//get all products
			// TODO: Que se puedan usar los filtros

			const products = await this.utils.products.getAllProducts({ filters: { isActive: true } });

			return res.json({
				message: 'Products successfully retrieved!',
				products
			});
		} catch (error) {
			return super.error(res, error);
		}
	}
}