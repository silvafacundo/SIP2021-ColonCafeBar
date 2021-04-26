const Route = require('../../models/Route');

module.exports = class ProductGET extends Route {
	constructor() {
		super('/product/get', 'get');
	}

	async run(req, res) {
		const { id } = req.body;
		// Check if body parameters are valid
		if (!id) return res.status(400).json({ message: 'id is required!' });

		try {
			//get a product 
			const product = await this.utils.products.getProduct( id );
			if (!product){
				return res.json('There are no products with that id!');
			} else {
				return res.json(product);
			}
		} catch (error) {
			return super.error(res, error);
		}
	}
}