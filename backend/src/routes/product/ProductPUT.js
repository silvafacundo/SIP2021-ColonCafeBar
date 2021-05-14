const Route = require('../../models/Route');

module.exports = class ProductPUT extends Route {
	constructor() {
		super('/product/update', 'put');
	}

	async run(req, res) {
		const { id, idCategory, name, description, price } = req.body;
		// Check if body parameters are valid
		if (!id) return res.status(400).json({ message: 'id is required!' });
		if (!idCategory && typeof idCategory !== 'bigint') return res.status(400).json({ message: 'idCategory is required!' });
		if (!name && typeof name !=='string') return res.status(400).json({ message: 'name is required!' });
		if (!description && typeof description !=='string') return res.status(400).json({ message: 'description is required!' });
		if (!price && typeof price !=='number') return res.status(400).json({ message: 'price is required!' });
		try {
			var product = await this.utils.products.getProduct(id);
			//if product doesn't exists, display a error message
			if (!product){
				return res.json('There are no product with that id!');
			} else {
				//update product
				product = await this.utils.products.updateProduct({ id, idCategory, name, description, price });
				return res.json(product);
			}
		} catch (error) {
			return super.error(res, error);
		}
	}
}