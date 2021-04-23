const Route = require('../models/Route');
module.exports = class Test extends Route {
	constructor() {
		super('/test', 'get', { publicRoute: false });
	}

	async run(req, res) {
		return res.send('Heasdasdllo world');
	}
};
