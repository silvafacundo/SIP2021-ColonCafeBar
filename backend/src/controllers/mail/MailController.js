const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const { v4: uuidv4 } = require('uuid');
const PublicError = require('../../errors/PublicError');

module.exports = class MailController {
	constructor(server) {
		this.server = server;

		this.from = 'coloncafebar@no-reply.com';
	}

	get transporter() {
		const config = {
			host: process.env.EMAIL_HOST,
			port: process.env.EMAIL_PORT,
			secure: process.env.EMAIL_SECURE === 'true',
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS
			}
		};

		return nodemailer.createTransport(config);

	}

	get db() {
		return this.server.db;
	}

	get utils() {
		return this.server.utils;
	}

	sendEmail(mailOptions) {
		mailOptions = {
			...mailOptions,
			from: this.from
		};

		return new Promise((resolve, reject) => {
			this.transporter.sendMail(mailOptions, (error, info) => {
				if (error) {
					return reject(error);
				}
				return resolve(info);
			});
		});
	}

	/**
	 * Send an email to reset the password
	 *
	 * @param { string } to - Destination email
	 * @param { string } token - Password reset token
	 */
	async sendResetPasswordEmail({ to, token, clientName }) {
		const verifyUrl = `${process.env.FRONT_URL}/password/reset/${token}`;

		const emailTemplate = fs.readFileSync(path.resolve(__dirname, './templates/ResetPassword.html'), 'utf8');
		const htmlTemplate = emailTemplate.replace(new RegExp('##user_name##', 'g'), clientName)
			.replace(new RegExp('##action_url##', 'g'), verifyUrl)

		const mailOptions = {
			from: this.from,
			to,
			subject: 'Colon Cafe Bar - Cambiar contraseña',
			html: htmlTemplate
		};

		await this.sendEmail(mailOptions);
	}

};
