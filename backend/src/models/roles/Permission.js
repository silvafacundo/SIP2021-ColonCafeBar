const BaseModel = require('../BaseModel');

module.exports = class Client extends BaseModel {
	constructor(server, permissionsData) {
		super(server);
		this._data = permissionsData;
	}

	get id() {
		return this._data.id;
	}

	get name() {
		return this._data.name;
	}

	get key() {
		return this._data.key;
	}

	get isActive() {
		return this._data.isActive
	}
}