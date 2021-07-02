const Route = require('../../models/Route');

module.exports = class UserRegisterPOST extends Route {
	constructor() {
		super('/admin/auth/register', 'post', { isPublic: false });
	}

	async run(req, res, user) {
		const { name, username, password } = req.body;
		if (!name) return res.status(400).json({ message: 'El nombre es necesario' });
		if (!username) return res.status(400).json({ message: 'El username es necesario' });
		if (!password) return res.status(400).json({ message: 'La contraseña es necesaria' });
		try {
			const exists = await this.utils.users.getUser({ username });
			if (exists) return res.status(400).json({ message: 'Ya existe un usuario con este username' });

			await this.utils.users.createUser({ username, password, name });

			return res.json({ message: 'User successfully registered' });
		} catch (error) {
			return res.status(400).json({ message: error.message });
		}
	}
};
