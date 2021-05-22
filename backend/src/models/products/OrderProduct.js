const BaseModel = require('../BaseModel');
const Product = require('./Product');

module.exports = class OrderProduct extends BaseModel {
	constructor(server, product, price, amount){
		super(server);
		if (!(product instanceof Product)) throw new Error('Product should be a product');
		if (typeof amount !== 'number' || amount <= 0) throw new Error('Invalid amount, expected positive number');
		if (typeof price !== 'number' || price < 0) throw new Error('Invalid price, expected positive number');

		this._product = product;
		this._price = price;
		this._amount = amount;
	}
	get product() {
		return this._product;
	}
	get price() {
		return this._price;
	}
	get amount() {
		return this._amount;
	}
}
