const BaseModel = require('../BaseModel');
const Category = require('./Category');

module.exports = class Product extends BaseModel {
	constructor(server, product, category, price){
		super(server);
		if (category && !(category instanceof Category)) throw new Error('Invalid category');
		if (typeof price !== 'number' || price < 0) throw new Error('Price expected a positive number');
		this._product = product;
		this._category = category;
		this._price = price;
	}
	get id(){
		return this._product.id;
	}
	get category(){
		return this._category;
	}
	get name(){
		return this._product.name;
	}
	get description(){
		return this._product.description;
	}
	get price(){
		return this._price || 0;
	}
	get isActive(){
		return this._product.isActive;
	}
	get imageUrl() {
		return this._product.imageUrl;
	}
	get variants() {
		return this._product.variants;
	}
}
