module.exports = class ProductController {
	constructor(server) {
		this.server = server;
	}

	get db() {
		return this.server.db;
	}

	get utils() {
		return this.server.utils;
	}


	async createProduct({ idCategory, name, description, price }) {
		//Check if parameters are valid
		if (!idCategory && typeof idCategory !== 'bigint') throw Error('idcategory is required');
		if (!name && typeof name !=='string') throw Error('name is required');
		if (!description && typeof description !=='string') throw Error('description is required');
		if (!price && typeof price !== 'number') throw Error('price is required');

		const product = await this.db('products')
			.insert({
				idCategory,
				name,
				description
			})
			.returning('*');

		await this.updateProductPrice(product[0].id, price);

		this.utils.logger.info('Product '+name+' created');
	}

	//Get specific product
	async getProduct(id) {
		const priceSubQuery = this.db('productPrices')
			.select(this.db.raw(`MAX("createdAt") as productPriceDate`), 'productPrices.productId')
			.where('productId', id)
			.groupBy('productId')
			.as('priceSubQuery');

		const prices = this.db('productPrices')
			.select('productPrices.*')
			.innerJoin(priceSubQuery, function(){
				this.on('priceSubQuery.productId', 'productPrices.productId')
					.on('priceSubQuery.productpricedate', 'productPrices.createdAt');
			})
			.as('productPrice');

		const product = await this.db('products')
			.select('products.*', 'productPrice.price')
			.innerJoin(prices, 'products.id', 'productPrice.productId')
			.first();

		return product;
	}

	// Get products by given an array of products id
	async getProducts(productsId) {
		if (!productsId || !Array.isArray(productsId) || productsId.length < 1) throw Error('products must be an array of products id');

		const priceSubQuery = this.db('productPrices')
			.select(this.db.raw(`MAX("createdAt") as productPriceDate`), 'productPrices.productId')
			.whereIn('productId', productsId)
			.groupBy('productId')
			.as('priceSubQuery');

		const prices = this.db('productPrices')
			.select('productPrices.*')
			.innerJoin(priceSubQuery, function(){
				this.on('priceSubQuery.productId', 'productPrices.productId')
					.on('priceSubQuery.productpricedate', 'productPrices.createdAt');
			})
			.as('productPrice');

		const products = await this.db('products')
			.select('products.*', 'productPrice.price')
			.innerJoin(prices, 'products.id', 'productPrice.productId');

		return products;
	}

	//Get all products loaded
	async getAllProducts() {
		// const prices = this.db('productPrices').select(this.db.raw(`MAX("createdAt")`), 'price', 'productId')
		// 	.groupBy('productId')
		// 	.as('prices');
		const products = await this.db('products');

		for (const product of products) {
			const productPrice = await this.db('productPrices').select(this.db.raw(`MAX("createdAt")`), 'price')
				.where('productId', product.id).groupBy('price').first();

			product.price = productPrice ? productPrice.price : 0;
		}

		return products;
	}

	//Delete specific product
	async deleteProduct(id) {
		await this.db('products')
			.where({ id })
			.del();
		this.utils.logger.info('Product '+id+' deleted');
		return (true);
	}

	//Update specific product
	async updateProduct( { id, idCategory, name, description, price }){
		const exists = await this.db('products').where({ id }).first();
		if (!exists) throw new Error('Product doesn\'t exists');

		await this.db('products')
			.where({ id })
			.update({
				idCategory: idCategory,
				name: name,
				description: description,
			});

		if (typeof price !== 'undefined' && price !== null) {
			console.log('Ojo que actualizo');
			await this.updateProductPrice(id, price);
		}
		this.utils.logger.info('Product '+name+' uploaded');
		return (true);
	}

	async updateProductPrice(productId, price) {
		await this.db('productPrices').insert({
			productId,
			price
		});
	}
}