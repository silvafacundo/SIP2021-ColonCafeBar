const BaseModel = require('../BaseModel');

module.exports = class Delivery extends BaseModel {
	constructor(server, category) {
		super(server);
		this._category = category;
	}
	get id() {
		return this._category.id;
	}
	get name() {
		return this._category.name;
	}
}