const Product = require('../../models/products/Product');
const Category = require('../../models/products/Category');
const PublicError = require('../../errors/PublicError');
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

	_productQuery(where) {
		if (typeof where === 'undefined' || where === null) where = () => {};
		const priceSubQuery = this.db('productPrices')
			.select(this.db.raw(`MAX("createdAt") as productPriceDate`), 'productPrices.productId')
			.where(where)
			.groupBy('productId')
			.as('priceSubQuery');

		const priceQuery = this.db('productPrices')
			.select('productPrices.*')
			.innerJoin(priceSubQuery, function(){
				this.on('priceSubQuery.productId', 'productPrices.productId')
					.on('priceSubQuery.productpricedate', 'productPrices.createdAt');
			})
			.as('productPrice');

		return this.db('products')
			.select('products.*', 'categories.name as categoryName', 'productPrice.price')
			.innerJoin(priceQuery, 'products.id', 'productPrice.productId')
			.innerJoin('categories', 'products.idCategory', 'categories.id');
	}

	async createProduct({ idCategory, name, description, price }) {
		//Check if parameters are valid
		if (!idCategory && typeof idCategory !== 'bigint') throw new PublicError('idcategory is required');
		if (!name && typeof name !== 'string') throw new PublicError('name is required');
		if (!description && typeof description !== 'string') throw new PublicError('description is required');
		if (!price && typeof price !== 'number') throw new PublicError('price is required');

		const category = await this.utils.categories.getCategory(idCategory);
		if (!category) throw new PublicError('Category doesn\'t exists');

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
			this.utils.logger.info('Product '+name+' created');
			return await this.getProduct(product[0].id);
		} catch (error) {
			await trx.rollback();
			throw error;
		}
	}

	//Get specific product
	async getProduct(id) {
		const product = (await this._productQuery({ 'productId': id }))[0];

		if (!product) return null;
		return new Product(this.server, product, new Category(this.server, { id: product.idCategory, name: product.categoryName }), product.price);
	}

	// Get products by given an array of products id
	async getProducts(productsId) {
		if (!productsId || !Array.isArray(productsId) || productsId.length < 1) throw Error('products must be an array of products id');

		const products = await this._productQuery(query => query.whereIn('productId', productsId));

		return products.map(product => {
			return new Product(this.server, product, new Category(this.server, { id: product.idCategory, name: product.categoryName }), product.price);
		});
	}

	//Get all products loaded
	async getAllProducts({ page = 1, perPage = 20, filters, orderBy = {} } = {}) {
		if (isNaN(page)) throw new PublicError('page should be a number');
		if (isNaN(perPage)) throw new PublicError('perPage should be a number');

		const orders = [];
		if (orderBy.price) orders.push({ column: 'price', order: orderBy.price === 'asc' ? 'asc' : 'desc' });
		orders.push({ column: 'price', order: orderBy.createdAt === 'asc' ? 'asc' : 'desc' });

		const whereQuery = builder => {
			let { categoriesId, isActive, fromDate, toDate, fromPrice, toPrice, query } = filters || {};
			if (categoriesId && Array.isArray(categoriesId)) builder.whereIn('categoryId', categoriesId);
			if (fromDate) builder.where('createdAt', '>=', fromDate);
			if (toDate) builder.where('createdAt', '<=', toDate);
			if (fromPrice) builder.where('price', '>=', fromPrice)
			if (toPrice) builder.where('price', '<=', toPrice);
			if (query) {
				query = query.toLowerCase();
				builder.where(this.db.raw(`(lower(products.name) like '%' || ? || '%' or lower(categories.name) like '%'|| ? ||'%' or lower(description) like '%' || ? || '%')`, [query, query, query]), );
			}
			if (typeof isActive === 'boolean') builder.where('products.isActive', isActive);
		}

		const products = await this._productQuery()
			.where(whereQuery)
			.offset((page - 1) * perPage)
			.limit(perPage)
			.orderBy(orders);

		return products.map(product => {
			return new Product(this.server, product, new Category(this.server, { id: product.idCategory, name: product.categoryName }), product.price);
		});
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
	async updateProduct( { productId, idCategory, name, description, isActive, price }) {
		if (!productId) throw new PublicError('productId is required!');

		const exists = await this.getProduct(productId);
		if (!exists) throw new PublicError('Product doesn\'t exists');
		if (!productId && !idCategory && !name && !description && typeof isActive !== 'boolean' && !price) throw PublicError('At least one parameter is required');

		const trx = await this.db.transaction();
		try {
			if (idCategory || name || description || typeof isActive === 'boolean')
				await this.db('products')
					.where({ id: productId })
					.update({
						idCategory,
						name: name,
						description: description,
						isActive
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
