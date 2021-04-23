
exports.up = async function(knex) {
	await knex.schema.createTable('users', table => {
		table.bigIncrements('id');
		table.string('email');
		table.string('firstName');
		table.string('lastName');
		table.string('phoneNumber');
		table.string('password');
		table.boolean('isActive');
		table.timestamp('createdAt').defaultTo(knex.fn.now());
	});
};

exports.down = async function(knex) {
	await knex.schema.dropTableIfExists('users');
};
