const Route = require('../../models/Route');

module.exports = class ProductDELETE extends Route {
	constructor() {
		super('/admin/product', 'delete', { permissions: 'menu' });
	}

	async run(req, res, user) {
		const { productId } = req.query;
		// Check if body parameters are valid
		if (!productId) return res.status(400).json({ message: 'productId is required to delete a product!' });

		try {
			// Delete into database
			await this.utils.products.deleteProduct(productId);
			return res.json({ message: 'Product successfully deleted!' });
		} catch (error) {
			return super.error(res, error);
		}
	}
}