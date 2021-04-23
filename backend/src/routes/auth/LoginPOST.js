const Route = require('../../models/Route');

module.exports = class LoginPOST extends Route {
	constructor() {
		super('/auth/login', 'post');
	}

	async run(req, res) {
		const { email, password } = req.body;



		return res.send('Hello world');
	}
};
