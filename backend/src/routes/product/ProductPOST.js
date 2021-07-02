const Route = require('../../models/Route');

module.exports = class ProductPOST extends Route {
	constructor() {
		super('/admin/product', 'post', { permissions: 'menu', isPublic: false });
	}

	async run(req, res, user) {
		const { idCategory, name, description, imageUrl, price, variants, pointsPrice, grantablePoints } = req.body;
		// Check if body parameters are valid
		try {
			// Insert into database
			await this.utils.products.createProduct({ idCategory, name, imageUrl, description, price, variants, pointsPrice, grantablePoints });
			return res.json({ message: 'Product successfully created!' });
		} catch (error) {
			return super.error(res, error);
		}
	}
}