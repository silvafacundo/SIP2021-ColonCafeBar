const BaseModel = require('../BaseModel');

module.exports = class User extends BaseModel {
	constructor(server, user) {
		super(server);
		this._data = user;
	}

	get id() {
		return this._data.id;
	}

	get username() {
		return this._data.username;
	}

	get name() {
		return this._data.name;
	}

	get isRoot() {
		return this._data.isRoot;
	}

	get isActive() {
		return this._data.isActive
	}

	get createdAt() {
		return this._data.createdAt;
	}
}