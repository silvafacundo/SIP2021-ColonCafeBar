const BaseModel = require('../BaseModel');


module.exports = class Address extends BaseModel {
	constructor(server, address) {
		super(server);
		if (typeof address !== 'object') throw new Error('Address should be an object');
		this._address = address;
	}

	get id() {
		return this._address.id;
	}
	get clientId() {
		return this._address.clientId;
	}
	get alias() {
		return this._address.alias;
	}
	get corner() {
		return this._address.corner;
	}
	get street() {
		return this._address.street;
	}
	get number() {
		return this._address.number;
	}
	get floor() {
		return this._address.floor;
	}
	get postalCode() {
		return this._address.postalCode;
	}
}