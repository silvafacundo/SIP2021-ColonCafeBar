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
		if (!name && typeof name !=='string') throw Error('name is required');
		const category = await this.db('categories').insert({ name });
		return category;
	}

	//Get specific categories
	async getCategory(id){
		const category = await this.db('categories')
			.where({ id })
			.first();
		return category;
	}

	//Get all categories loaded
	async getAllCategories(){
		const categories = await this.db('categories')
			.select();
		return categories;
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
		await this.db('categories')
			.where({ id })
			.update({
				name
			});
		return (true);
	}

	async isEmpty(id){
		const flag = await this.db('categories')
			.leftJoin('products', 'categories.id', 'products.idCategory')
			.where('categories.id', id)
			.count();
		return flag[0].count>0;
	}
}