const bcrypt = require('bcrypt');

exports.seed = async knex => {
	// Inserts seed entries
	const hash = await bcrypt.hash('12345', 10);

	await knex('users').insert({
		email: 'admin@local.com',
		firstName: 'admin',
		lastName: 'super fachero',
		password: hash,
		isActive: true
	});
};
