
exports.up = async function(knex) {
	await knex.schema.createTable('clients', table => {
		table.bigIncrements('id');
		table.string('email').unique();
		table.string('firstName');
		table.string('lastName');
		table.string('phoneNumber');
		table.string('password');
		table.boolean('isActive').defaultTo(true);
		table.timestamp('createdAt').defaultTo(knex.fn.now());
	});
};

exports.down = async function(knex) {
	await knex.schema.dropTableIfExists('clients');
};
