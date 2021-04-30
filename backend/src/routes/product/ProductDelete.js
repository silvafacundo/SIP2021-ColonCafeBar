const Route = require('../../models/Route');

module.exports = class ProductDELETE extends Route {
	constructor() {
		super('/product/delete', 'delete');
	}

	async run(req, res) {
		const { id } = req.query;
		// Check if body parameters are valid
		if (!id) return res.status(400).json({ message: 'id is required to delete a product!' });

		try {
			// Delete into database
			await this.utils.products.deleteProduct(id);
			return res.json({ message: 'Product successfully deleted!' });
		} catch (error) {
			return super.error(res, error);
		}
	}
}