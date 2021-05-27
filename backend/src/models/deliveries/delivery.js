const BaseModel = require('../BaseModel');

module.exports = class Delivery extends BaseModel {
	constructor(server, delivery) {
		super(server);
		this._delivery = delivery;
	}

	get id() {
		return this._delivery.id;
	}

	get name() {
		return this._delivery.name;
	}

	get lastName() {
		return this._delivery.lastName;
	}

	get phoneNumber() {
		return this._delivery.phoneNumber;
	}
}