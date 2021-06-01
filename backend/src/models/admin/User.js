const BaseModel = require('../BaseModel');

module.exports = class User extends BaseModel {
	constructor(server, user, firebaseToken) {
		super(server);
		if (typeof user !== 'object') throw new Error('user is required, expected an object');
		this._data = user;
		this._firebaseToken = firebaseToken;
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
	get isAdmin() {
		return this._data.isAdmin;
	}

	get isActive() {
		return this._data.isActive
	}

	get createdAt() {
		return this._data.createdAt;
	}
	get firebaseToken() {
		return this._firebaseToken;
	}
}