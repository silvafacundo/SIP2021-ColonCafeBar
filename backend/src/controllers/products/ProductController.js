
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


    async createProduct({ idCategory, name, description, price }){
        //Check if parameters are valid
        if (!idCategory && typeof idCategory !== 'bigint') throw Error('idcategory is required');
        if (!name && typeof name !=='string') throw Error('name is required');
        if (!description && typeof description !=='string') throw Error('description is required');
        if (!price && typeof price !=='float') throw Error('price is required');

       const product = await this.db('products')
            .insert({
                idCategory,
                name,
                description,
                price
            });

        return product;
    }

    //Get specific product
    async getProduct(id){
        const product = await this.db('products')
			.where({ id })
			.first();
		return product;
    }

    //Get all products loaded
    async getAllProducts(){
        const products = await this.db('products')
            .select();
        return products;
    }

    //Delete specific product
    async deleteProduct(id){
        await this.db('products')
            .where({ id })
            .del();
        return(true);
    }

    //Update specific product
    async updateProduct( {id, idCategory, name, description, price }){
        await this.db('products')
            .where({ id })
            .update({
                idCategory : idCategory,
                name : name,
                description : description,
                price : price
            });
        return(true);
    }
}