class Route {
	constructor(path, method, config) {
		this.path = path;
		this._method = method;
		this.config = config;
	}

	get method() {
		return this._method.toLowerCase();
	}

	get utils() {
		return this.server.utils;
	}

	initialize(db, server) {
		this.db = db;
		this.server = server;
	}

	auth(req, res) {
		return this.run(req, res);
	}

	// eslint-disable-next-line no-unused-vars
	run(req, res, db) {
		// Overload!!
		return null;
	}
}

module.exports = Route;
