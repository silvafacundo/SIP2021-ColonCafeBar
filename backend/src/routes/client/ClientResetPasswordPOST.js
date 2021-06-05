const Route = require('../../models/Route');

module.exports = class ClientResetPasswordPOST extends Route {
	constructor() {
		super('/reset', 'post', { isPublic: true });
	}

	async run(req, res) {
		try {
			const { email } = req.body;
			if (typeof email !== 'string') return res.status(400).json({ message: 'email is required' });

			const client = await this.utils.clients.getClient({ email });
			if (!client) return res.status(400).json({ message: 'client does not exist' });

			const resetData = await this.utils.auth.generateResetPasswordToken(client.id);
			await this.utils.mailController.sendResetPasswordEmail({ to: email, token: resetData.token, clientName: client.firstName });

			return res.json({
				message: 'Password reset mail successfully sent',
			});
		} catch (error) {
			return res.status(400).json({ message: error.message });
		}
	}
}
