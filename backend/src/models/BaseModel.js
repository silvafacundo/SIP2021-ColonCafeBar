module.exports = class BaseModel {
	constructor(server) {
		this.server = server;
	}

	get publicProperties() {
		const proto = Object.getPrototypeOf(this);
		const getters = Object.entries(Object.getOwnPropertyDescriptors(proto))
			.filter(([key, descriptor]) => typeof descriptor.get === 'function')
			.map(([key]) => key)
		return getters;
	}

	toJSON() {
		let toReturn = {};
		for (const property of this.publicProperties) {
			if (property === 'publicProperties') continue;
			toReturn[property] = this[property];
		}
		return toReturn;
	}
}