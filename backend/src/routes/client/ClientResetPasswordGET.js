const Route = require('../../models/Route');

module.exports = class ClientResetPasswordGET extends Route {
	constructor() {
		super('/reset', 'get');
	}

	async run(req, res, client) {
		try {
			const resetData = await this.utils.auth.generateResetPasswordToken(client.id);

			await this.utils.mailController.sendResetPasswordEmail({ to: client.email, token: resetData.token, clientName: client.firstName });

			return res.json({ message: 'Reset Password email successfully sent' });
		} catch (error) {
			return res.status(400).json({ message: error.message });
		}
	}
}
