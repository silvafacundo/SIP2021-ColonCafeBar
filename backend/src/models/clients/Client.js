const BaseModel = require('../BaseModel');

module.exports = class Client extends BaseModel{
	constructor(server, user) {
		super(server);
		this._data = user;
	}
	get id() {
		return this._data.id;
	}

	get email() {
		return this._data.email;
	}

	get firstName() {
		return this._data.firstName;
	}

	get lastName() {
		return this._data.lastName;
	}

	get phoneNumber() {
		return this._data.phoneNumber;
	}

	get isActive() {
		return this._data.isActive
	}

	get createdAt() {
		return this._data.createdAt;
	}
}