const PublicError = require('../../errors/PublicError');
const { Op } = require('sequelize');
/** @typedef {import('../../Server')} Server */
module.exports = class ProductController {
	/**
	 *Creates an instance of ProductController.
	 * @param {Server} server
	 */
	constructor(server) {
		this.server = server;
	}

	get db() {
		return this.server.db;
	}

	get utils() {
		return this.server.utils;
	}

	get models() {
		return this.server.models;
	}

	get sequelize() {
		return this.server.sequelize;
	}

	/**
	 *
	 * @deprecated
	 * @param {*} where
	 * @returns
	 */
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

	_validVariants(variants) {
		if (typeof variants !== 'object') return false;
		for (const variantKey in variants) {
			const variant = variants[variantKey];
			if (typeof variant !== 'object' || variant === null) return false;
			if (typeof variant.required !== 'boolean') return false;
			if (!Array.isArray(variant.values) || variant.values.length < 1) return false;
		}

		return true;
	}

	async createProduct({ idCategory, name, imageUrl, description, price, variants, pointsPrice, grantablePoints = 0 }) {
		if (typeof idCategory === 'undefined' || idCategory === null) throw new PublicError('La categoria es requerido');
		if (!name || typeof name !== 'string') throw new PublicError('El nombre es requerido');
		if (!description && typeof description !== 'string') throw new PublicError('La descripcion debe ser un string');
		if (typeof variants !== 'undefined' && variants !== null) {
			if (!this._validVariants(variants)) throw new PublicError('Formato erroneo de las variantes');
		}
		if (typeof price === 'undefined' || price === null) throw new PublicError('El precio es requerido');
		if (typeof pointsPrice === 'undefined' || pointsPrice === null) throw new PublicError('El precio en puntos es requerido');
		if (typeof grantablePoints === 'undefined' || grantablePoints === null) throw new PublicError('Los puntos otorgables es requerido');

		price = Number(price);
		if (isNaN(price) || price < 0) throw new PublicError('El precio no es valido');

		pointsPrice = Number(pointsPrice);
		if (isNaN(pointsPrice) || pointsPrice < 0) throw new PublicError('El precio en puntos no es valido');

		pointsPrice = Number(pointsPrice);
		if (isNaN(pointsPrice) || pointsPrice < 0) throw new PublicError('Los puntos otorgables no es valido');


		const category = await this.utils.categories.getCategory(idCategory);
		if (!category) throw new PublicError('Category doesn\'t exists');

		const trx = await this.sequelize.transaction();
		try {
			const product = await this.models.Product.create({
				idCategory,
				name,
				description,
				imageUrl,
				variants
			}, { transaction: trx });

			const productPrice = await this.models.ProductPrice.create({
				productId: product.id,
				price
			}, { transaction: trx });

			const productPoints = await this.models.ProductPoints.create({
				productId: product.id,
				price: pointsPrice,
				grant: grantablePoints,
			}, { transaction: trx })

			product.priceId = productPrice.id;
			product.pointsId = productPoints.id;
			await product.save({ transaction: trx });

			await trx.commit();
			return product;
		} catch (err) {
			await trx.rollback();
			throw err;
		}
	}

	//Get specific product
	async getProduct(id) {
		const product = await this.models.Product.findByPk(id);
		return product;
	}

	// Get products by given an array of products id
	async getProducts(productsId) {
		if (!productsId || !Array.isArray(productsId) || productsId.length < 1) throw Error('products must be an array of products id');

		const products = await this.models.Product.findAll({
			where: {
				id: {
					[Op.in]: productsId
				}
			}
		})
		return products;
	}

	//Get all products loaded
	async getAllProducts({ page = 1, perPage = 20, filters, orderBy = {} } = {}) {
		if (isNaN(page)) throw new PublicError('page should be a number');
		if (isNaN(perPage)) throw new PublicError('perPage should be a number');

		const whereAnd = [];
		let { categoriesId, isActive, fromDate, toDate, fromPrice, toPrice, query } = filters || {};

		if (Array.isArray(categoriesId) && categoriesId.length > 0)
			whereAnd.push({ idCategory: { [Op.in]: categoriesId } })

		if (fromDate)
			whereAnd.push({ createdAt: { [Op.gte]: fromDate } });
		if (toDate)
			whereAnd.push({ createdAt: { [Op.lte]: toDate } });

		if (fromPrice)
			whereAnd.push({ '$priceData.price$': { [Op.gte]: fromPrice } });
		if (toPrice)
			whereAnd.push({ '$priceData.price$': { [ Op.lte]: toPrice } });

		if (query) {
			query = `%${query.toLowerCase()}%`;
			whereAnd.push({
				[Op.or]: [
					{ '$Product.name$': { [Op.iLike]: query } },
					{ '$category.name$': { [Op.iLike]: query } },
					{ '$Product.description$': { [Op.iLike]: query } }
				]
			} );
		}
		if (typeof isActive === 'boolean')
			whereAnd.push({ isActive });

		const orders = [];
		orders.push(['createdAt', orderBy.createdAt === 'asc' ? 'ASC' : 'DESC']);
		if (orderBy.price)
			orders.push(['price', orderBy.price === 'asc' ? 'ASC' : 'DESC']);

		const { count: total, rows: products } = await this.models.Product.findAndCountAll({
			where: {
				[Op.and]: whereAnd
			},
			order: orders,
			offset: (page - 1) * perPage,
			limit: perPage
		});

		return { products, pagination: { page, perPage, total } };
	}

	//Delete specific product
	async deleteProduct(id) {
		const product = await this.getProduct(id);
		product.destroy();
		this.utils.logger.info('Product '+id+' deleted');
		return (true);
	}

	//Update specific product
	async updateProduct( { productId, idCategory, imageUrl, name, description, isActive, price, variants, pointsPrice, grantablePoints }) {
		if (!productId) throw new PublicError('El productId es requerido');

		let category = null;
		if (idCategory) category = await this.utils.categories.getCategory(idCategory);
		if (idCategory && !category) throw new PublicError('El categoria dada no existe');

		if (typeof name === 'string' && !name) throw new PublicError('El nombre tiene que se un string valido');
		if (description && typeof description !== 'string') throw new PublicError('La descripcion no es valida');

		if (typeof isActive !== 'undefined' && typeof isActive !== 'boolean') throw new PublicError('isActive tiene que se un booleano');

		if (typeof price !== 'undefined') {
			price = Number(price);
			if (isNaN(price) || price < 0) throw new PublicError('El precio no es valido');
		}

		if (typeof pointsPrice !== 'undefined') {
			pointsPrice = Number(pointsPrice);
			if (isNaN(pointsPrice) || pointsPrice < 0) throw new PublicError('El precio en puntos no es valido');
		}

		if (typeof grantablePoints !== 'undefined') {
			grantablePoints = Number(grantablePoints);
			if (isNaN(grantablePoints) || grantablePoints < 0) throw new PublicError('Los puntos otorgables no es valido');
		}

		const product = await this.getProduct(productId);
		if (!product) throw new PublicError('Product doesn\'t exists');

		if (!productId
			&& !imageUrl
			&& !idCategory
			&& !name
			&& !description
			&& typeof isActive !== 'boolean'
			&& !price
			&& !variants
			&& !pointsPrice
			&& !grantablePoints) throw PublicError('At least one parameter is required');

		if (typeof variants !== 'undefined' && variants !== null) {
			if (!this._validVariants(variants)) throw new PublicError('variants wrong format');
		}

		const trx = await this.sequelize.transaction();
		try {
			if (idCategory || name || description || typeof isActive === 'boolean') {
				const toUpdate = {
					idCategory,
					name,
					description,
					isActive,
					imageUrl,
					variants
				}

				for (const key in toUpdate) {
					product[key] = toUpdate[key];
				}
			}

			if (typeof price !== 'undefined' && price !== null && price !== product.price) {
				const productPrice = await this.models.ProductPrice.create({
					productId: product.id,
					price
				}, { transaction: trx });
				product.priceId = productPrice.id;
			}

			if ((typeof pointsPrice !== 'undefined' && pointsPrice !== null && pointsPrice !== product.pointsPrice)
				|| (typeof grantablePoints !== 'undefined' && grantablePoints !== null && grantablePoints !== product.grantablePoints)) {
				const toInsert = {
					price: product.pointsPrice,
					grant: product.grantablePoints
				}

				if (pointsPrice) toInsert.price = pointsPrice;
				if (grantablePoints) toInsert.grant = grantablePoints;

				const pointsPriceInsert = await this.models.ProductPoints.create({
					productId: product.id,
					...toInsert
				}, { transaction: trx });

				product.pointsId = pointsPriceInsert.id;
			}

			await product.save({ transaction: trx });
			await trx.commit();
			this.utils.logger.info('Product '+name+' uploaded');
			return product;
		} catch (error) {
			await trx.rollback();
			throw error;
		}
	}

	/**
	 *
	 * @deprecated
	 * @param {*} productId
	 * @param {*} price
	 * @param {*} trx
	 */
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
