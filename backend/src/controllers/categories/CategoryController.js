module.exports = class categoriesController {
	constructor(db) {
		this.db = db;
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
        return(true);
    }

    //Update specific Category
    async updateCategory(name){
        await this.db('categories')
            .where({ id })
            .update({
                name : name,
            });
        return(true);
    }
}