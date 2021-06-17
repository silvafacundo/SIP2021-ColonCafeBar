const Route = require('../../models/Route');

module.exports = class ClientResetPasswordGET extends Route {
	constructor() {
		super('/reset', 'get', { isPublic: true });
	}

	async run(req, res) {
		try {
			const { email } = req.query;
			if (!email) return res.status(400).json({ message: 'email is required!' });

			const client = await this.utils.clients.getClient({ email });
			if (!client) return res.status(400).json({ message: 'no client was found!' });

			const resetData = await this.utils.auth.generateResetPasswordToken(client.id);

			await this.utils.mailController.sendResetPasswordEmail({ to: client.email, token: resetData.token, clientName: client.firstName });

			return res.json({ message: 'Reset Password email successfully sent' });
		} catch (error) {
			return res.status(400).json({ message: error.message });
		}
	}
}
