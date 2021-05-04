const Route = require('../../models/Route');

module.exports = class UserLoginPOST extends Route {
	constructor() {
		super('/auth/admin/login', 'post');
	}

	async run(req, res) {
		const { username, password } = req.body;
		if (!username) return res.status(400).json({ message: 'username is required!' });
		if (!password) return res.status(400).json({ message: 'password is required!' });

		try {
			const user = await this.utils.users.getUser({ username });
			if (!user) return res.status(400).json({ message: 'User not registered' });

			const samePassword = await this.utils.auth.compareHash(password, user.password);
			if (!samePassword) return res.status(401).json({ message: 'Invalid password' });

			const jwt = await this.utils.auth.generateJWT(user);

			return res.json({ message: 'Successfully logged in', payload: jwt });
		} catch (error) {
			return super.error(res, error);
		}
	}
};
