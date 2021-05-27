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

	async createCategory({ name }){
		//Check if parameters are valid
		if (!name && typeof name !== 'string') throw new PublicError('name is required');
		const category = await this.db('categories').insert({ name }).returning('*');

		return await this.getCategory(category[0].id);
	}

	//Get specific categories
	async getCategory(id){
		const category = await this.db('categories')
			.where({ id })
			.first();
		if (!category) return null;
		return new Category(this.server, { id: category.id, name: category.name });
	}

	//Get all categories loaded
	async getAllCategories(){
		const categories = await this.db('categories')
			.select();

		return categories.map(category => {
			return new Category(this.server, { id: category.id, name: category.name });
		});
	}

	//Delete specific category
	async deleteCategory(id){
		await this.db('categories')
			.where({ id })
			.del();
		return (true);
	}

	//Update specific Category
	async updateCategory({ id, name }){
		const category = await this.db('categories')
			.where({ id })
			.update({
				name
			}).returning('*');
		return new Category(this.server, { id: category.id, name: category.name });
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