const Route = require('../../models/Route');

module.exports = class PriceHistoryGET extends Route {
	constructor() {
		super('/admin/product/history', 'get', { permissions: 'menu', isPublic: false });
	}

	async run(req, res, user) {
		const { productId } = req.query;
		// Check if body parameters are valid
		if (!productId) return res.status(400).json({ message: 'productId is required!' });

		try {
			//get a product
			const product = await this.utils.report.productPriceHistory(productId);

			if (!product) return res.json('There are no products with that id!');

			return res.json({
				message: 'Product successfully retrieved!',
				product
			});
		} catch (error) {
			return super.error(res, error);
		}
	}
}