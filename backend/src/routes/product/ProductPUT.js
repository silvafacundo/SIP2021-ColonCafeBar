const Route = require('../../models/Route');

module.exports = class ProductPUT extends Route {
	constructor() {
		super('/admin/product', 'put', { permissions: 'menu' });
	}

	async run(req, res, user) {
		const { productId, idCategory, name, description, price, isActive, variants } = req.body;
		// Check if body parameters are valid
		try {
			// var product = await this.utils.products.getProduct(id);
			//if product doesn't exists, display a error message
			//update product
			await this.utils.products.updateProduct({ productId, idCategory, name, description, price, isActive, variants });
			return res.json({ message: 'Product updated successfully' });
		} catch (error) {
			return super.error(res, error)
		}
	}
}