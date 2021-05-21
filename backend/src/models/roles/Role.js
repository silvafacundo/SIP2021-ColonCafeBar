const BaseModel = require('../BaseModel');
const Permission = require('./Permission');

module.exports = class Client extends BaseModel {
	constructor(server, roleData, permissions) {
		super(server);
		this._roleData = roleData;

		if (!Array.isArray(permissions)) throw Error('Permission[] is expected!');
		for (const permission of permissions) {
			if (!(permission instanceof Permission)) throw Error('Permission[] is expected!');
		}
		this._permissions = permissions;
	}

	get id() {
		return this._roleData.id;
	}

	get name() {
		return this._roleData.name;
	}

	get description() {
		return this._roleData.description;
	}

	get isActive() {
		return this._roleData.isActive;
	}

	get createdAt() {
		return this._roleData.createdAt;
	}

	get permissions() {
		return this._permissions;
	}
}