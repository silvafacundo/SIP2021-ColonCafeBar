const Route = require('../../models/Route');

module.exports = class LoginPOST extends Route {
	constructor() {
		super('/auth/login', 'post');
	}

	async run(req, res) {
		const { email, password } = req.body;
		if (!email) return res.status(400).json({ message: 'email is required!' });
		if (!password) return res.status(400).json({ message: 'password is required!' });

		try {
			const client = await this.utils.clients.getClient({ email });
			if (!client) return res.status(400).json({ message: 'Client not registered' });

			const samePassword = await this.utils.auth.compareHash(password, client.password);
			if (!samePassword) return res.status(401).json({ message: 'Invalid password' });

			const jwt = await this.utils.auth.generateJWT(client);

			return res.json({ message: 'Successfully logged in', payload: jwt });
		} catch (error) {
			return super.error(res, error);
		}
	}
};
