const Route = require('../../models/Route');

module.exports = class ProductGET extends Route {
	constructor() {
		super('/admin/product', 'get', { permissions: 'menu' });
	}

	async run(req, res, user) {
		const { productId } = req.query;
		// Check if body parameters are valid
		if (!productId) return res.status(400).json({ message: 'productId is required!' });

		try {
			//get a product
			const product = await this.utils.products.getProduct(productId);

			if (!product) return res.json('There are no products with that id!');

			return res.json({
				message: 'Product successfully retrieved!',
				payload: product
			});
		} catch (error) {
			return super.error(res, error);
		}
	}
}