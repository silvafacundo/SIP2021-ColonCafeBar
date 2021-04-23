const Route = require('../models/Route');
module.exports = class Test extends Route {
	constructor() {
		super('/test', 'get');
	}

	async run(req, res) {
		return res.send('Hello world');
	}
};
