const Route = require('../../models/Route');

module.exports = class RegisterPOST extends Route {
	constructor() {
		super('/auth/register', 'post', { isPublic: true });
	}

	async run(req, res) {
		const { firstName, lastName, phoneNumber, email, password } = req.body;
		if (!firstName) return res.status(400).json({ message: 'firstName is required!' });
		if (!email) return res.status(400).json({ message: 'email is required!' });
		if (!password) return res.status(400).json({ message: 'password is required!' });

		try {
			// TODO: enviar email de confirmacion
			const exists = await this.utils.clients.getClient({ email });
			if (exists) return res.status(400).json({ message: 'Client with this email already exists' });

			await this.utils.clients.createClient({ email, password, firstName, lastName, phoneNumber });

			return res.json({ message: 'User successfully registered!' });
		} catch (error) {
			return super.error(res, error);
		}

	}
};
