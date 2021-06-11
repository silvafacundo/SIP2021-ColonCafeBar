const Category = require('../../models/products/Category');
const PublicError = require('../../errors/PublicError');
module.exports = class CategoriesController {
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

	async createCategory({ name }){
		//Check if parameters are valid
		if (!name && typeof name !== 'string') throw new PublicError('name is required');
		const category = await this.models.Category.create({ name });

		return category;
	}

	//Get specific categories
	async getCategory(id){
		const category = await this.models.Category.findByPk(id);
		return category;
	}

	//Get all categories loaded
	async getAllCategories(){
		const categories = await this.models.Category.findAll();
		return categories;
	}

	//Delete specific category
	async deleteCategory(id){
		// TODO: Rework
		await this.db('categories')
			.where({ id })
			.del();
		return (true);
	}

	//Update specific Category
	async updateCategory({ id, name }){
		if (typeof id === 'undefined' || id === null) throw new PublicError('id is required');
		if (typeof name !== 'string') throw new PublicError('Name is required');
		const category = await this.getCategory(id);
		if (!category) throw new PublicError('Category doesn\'t exists');
		category.name = name;
		await category.save();
		return category;
	}

	async isEmpty(id){
		const flag = await this.db('categories')
			.innerJoin('products', 'categories.id', 'products.idCategory')
			.where('categories.id', id)
			.count()
			.first();

		return flag.count>0;
	}
}