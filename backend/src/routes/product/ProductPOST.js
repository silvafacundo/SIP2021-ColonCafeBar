const Route = require('../../models/Route');

module.exports = class ProductPOST extends Route {
	constructor() {
		super('/product/new', 'post');
	}

	async run(req, res) {
		const { idCategory, name, description, price } = req.body;
		// Check if body parameters are valid
		if (!idCategory) return res.status(400).json({ message: 'idCategory is required!' });
		if (!name && typeof name !=='string') return res.status(400).json({ message: 'name is required!' });
		if (!description && typeof name !=='string') return res.status(400).json({ message: 'description is required!' });
		if (!price && typeof price !=='number') return res.status(400).json({ message: 'price is required!' });

		try {
			// Insert into database
			await this.utils.products.createProduct({ idCategory,name, description, price });
			return res.json({ message: 'Product successfully created!' });
		} catch (error) {
			return super.error(res, error);
		}
	}
}