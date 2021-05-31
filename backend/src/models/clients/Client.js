const BaseModel = require('../BaseModel');
const Address = require('./Address');

module.exports = class Client extends BaseModel{
	constructor(server, user, addresses, firebaseToken) {
		super(server);
		this._data = user;
		if (addresses && Array.isArray(addresses)) {
			for (const address of addresses) {
				if (!(address instanceof Address)) throw new Error('Addresses should be an array of Addresses');
			}
		} else if (addresses) {
			throw new Error('Addresses should be an array of addresses');
		}
		this._addresses = addresses || [];
		this._firebaseToken = firebaseToken || '';
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

	get addresses() {
		return this._addresses;
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