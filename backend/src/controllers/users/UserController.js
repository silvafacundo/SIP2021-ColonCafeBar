module.exports = class UserController {
	constructor(db) {
		this.db = db;
	}

	async createUser({ email, password, firstName, lastName, phoneNumber }) {
		if (!email) throw Error('email is required!');
		if (!password) throw Error('password is required!');
		if (!firstName) throw Error('email is required!');

		if (lastName && typeof lastName !== 'string') throw Error('lastName must be a string!');
		if (phoneNumber && typeof phoneNumber !== 'string') throw Error('phoneNumber must be a string!');

		await this.db('users').insert({
			email,
			password,
			firstName,
			lastName,
			phoneNumber
		});
	}
};