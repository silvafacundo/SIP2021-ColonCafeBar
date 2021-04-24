const Route = require('../../models/Route');

module.exports = class ProductUpdatePOST extends Route {
	constructor() {
		super('/product/update', 'post');
	}

	async run(req, res) {
		const { id , idCategory, name, description, price } = req.body;
		// Check if body parameters are valid
		if (!id) return res.status(400).json({ message: 'id is required!' });
        if (!idCategory && typeof idCategory !== 'bigint') return res.status(400).json({ message: 'idCategory is required!' });
        if (!name && typeof name !=='string') return res.status(400).json({ message: 'name is required!' });
        if (!description && typeof description !=='string') return res.status(400).json({ message: 'description is required!' });
        if (!price && typeof price !=='float') return res.status(400).json({ message: 'price is required!' });
		try {
			//update product 
			const product = await this.utils.products.updateProduct({ id , idCategory, name, description, price });
			return res.json(product);
		} catch (error) {
			return super.error(res, error);
		}
	}
}