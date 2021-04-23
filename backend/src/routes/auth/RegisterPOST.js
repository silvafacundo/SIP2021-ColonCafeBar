const Route = require('../../models/Route');
const bcrypt = require('bcrypt');


module.exports = class RegisterPOST extends Route {
	constructor() {
		super('/auth/register', 'post');
	}

	async run(req, res) {
		const { firstName, lastName, phoneNumber, email, password } = req.body;
		if (!firstName) return res.status(400).json({ message: 'firstName is required!' });
		if (!email) return res.status(400).json({ message: 'email is required!' });
		if (!password) return res.status(400).json({ message: 'password is required!' });


		try {
			// TODO: enviar email de confirmacion
			await this.utils.users.createUser({ email, firstName, lastName, phoneNumber, password });

			return res.json({ message: 'User successfully registered!' });
		} catch (error) {
			return super.error(res, error);
		}

	}
};
