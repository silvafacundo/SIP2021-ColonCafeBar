const Route = require('../../models/Route');

module.exports = class ProductPUT extends Route {
	constructor() {
		super('/admin/product', 'put', { permissions: 'menu' });
	}

	async run(req, res, user) {
		const { productId, idCategory, name, description, price } = req.body;
		// Check if body parameters are valid
		if (!productId) return res.status(400).json({ message: 'productId is required!' });
		if (!idCategory && typeof idCategory !== 'number') return res.status(400).json({ message: 'idCategory is required!' });
		if (!name && typeof name !=='string') return res.status(400).json({ message: 'name is required!' });
		if (!description && typeof description !=='string') return res.status(400).json({ message: 'description is required!' });
		if (!price && typeof price !=='number') return res.status(400).json({ message: 'price is required!' });
		try {
			// var product = await this.utils.products.getProduct(id);
			//if product doesn't exists, display a error message
			//update product
			await this.utils.products.updateProduct({ productId, idCategory, name, description, price });
			return res.json({ message: 'Product updated successfully' });
		} catch (error) {
			return super.error(res, error)
		}
	}
}