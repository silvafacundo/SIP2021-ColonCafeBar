const Route = require('../../models/Route');

module.exports = class ProductPOST extends Route {
	constructor() {
		super('/admin/product', 'post', { permissions: 'menu' });
	}

	async run(req, res, user) {
		const { idCategory, name, description, price, variants } = req.body;
		// Check if body parameters are valid
		if (!idCategory) return res.status(400).json({ message: 'idCategory is required!' });
		if (!name && typeof name !=='string') return res.status(400).json({ message: 'name is required!' });
		if (!description && typeof description !=='string') return res.status(400).json({ message: 'description is required!' });
		if (!price && typeof price !=='number') return res.status(400).json({ message: 'price is required!' });

		try {
			// Insert into database
			await this.utils.products.createProduct({ idCategory, name, description, price, variants });
			return res.json({ message: 'Product successfully created!' });
		} catch (error) {
			return super.error(res, error);
		}
	}
}