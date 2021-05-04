
exports.up = async function(knex) {
	await knex.schema.createTable('roles', table => {
		table.bigIncrements('id');
		table.string('name').notNullable();
		table.string('description').notNullable();
		table.boolean('isActive');
		table.timestamp('createdAt').defaultTo(knex.fn.now());
	});
};

exports.down = async function(knex) {
	await knex.schema.dropTableIfExists('roles');
};
