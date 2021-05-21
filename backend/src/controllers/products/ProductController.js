
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

		const trx = await this.db.transaction();
		try {
			const product = await this.db('products')
				.insert({
					idCategory,
					name,
					description
				})
				.returning('*')
				.transacting(trx);

			await this.updateProductPrice(product[0].id, price, trx);

			await trx.commit();
		} catch (error) {
			await trx.rollback();
			throw error;
		}

		this.utils.logger.info('Product '+name+' created');
	}

	_priceSubQuery() {
		return this.db('productPrices')
			.select(this.db.raw(`MAX("createdAt") as productPriceDate`), 'productPrices.productId')
			.groupBy('productId')
			.as('priceSubQuery');
	}

	_priceQuery(priceSubQuery) {
		return this.db('productPrices')
			.select('productPrices.*')
			.innerJoin(priceSubQuery, function(){
				this.on('priceSubQuery.productId', 'productPrices.productId')
					.on('priceSubQuery.productpricedate', 'productPrices.createdAt');
			})
			.as('productPrice');
	}

	async _productQuery(priceQuery){
		return await this.db('products')
			.select('products.*', 'productPrice.price')
			.innerJoin(priceQuery, 'products.id', 'productPrice.productId');
	}

	async _productPricesQuery(priceSubQuery) {
		const priceQuery = this._priceQuery(priceSubQuery);

		return await this._productQuery(priceQuery);
	}

	//Get specific product
	async getProduct(id) {
		const priceSubQuery = this._priceSubQuery().where('productId', id);

		const prices = this._priceQuery(priceSubQuery);

		const product = await this._productQuery(prices).first();

		return product;
	}

	// Get products by given an array of products id
	async getProducts(productsId) {
		if (!productsId || !Array.isArray(productsId) || productsId.length < 1) throw Error('products must be an array of products id');

		const priceSubQuery = this._priceSubQuery().whereIn('productId', productsId);
		const products = await this._productPricesQuery(priceSubQuery);

		return products;
	}

	//Get all products loaded
	async getAllProducts() {
		const priceSubQuery = this._priceSubQuery();
		const products = await this._productPricesQuery(priceSubQuery);

		return products;
	}

	//Delete specific product
	async deleteProduct(id) {
		await this.db('products')
			.where({ id })
			.update({ isActive: false });

		this.utils.logger.info('Product '+id+' deleted');
		return (true);
	}

	//Update specific product
	async updateProduct( { productId, idCategory, name, description, price }) {
		if (!productId) throw Error('productId is required!');

		const exists = await this.getProduct(productId);
		if (!exists) throw new Error('Product doesn\'t exists');

		const trx = await this.db.transaction();
		try {
			await this.db('products')
				.where({ id: productId })
				.update({
					idCategory,
					name: name,
					description: description,
				})
				.transacting(trx);

			if (typeof price !== 'undefined' && price !== null) {
				await this.updateProductPrice(productId, price, trx);
			}

			await trx.commit();
		} catch (error) {
			await trx.rollback();
			throw error;
		}

		this.utils.logger.info('Product '+name+' uploaded');

		return (true);
	}

	async updateProductPrice(productId, price, trx) {
		await this.db('productPrices')
			.insert({
				productId,
				price
			})
			.modify(builder => {
				if (trx) builder.transacting(trx);
			})
	}
}