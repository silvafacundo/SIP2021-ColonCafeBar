
exports.up = async function(knex) {
	await knex.schema.createTable('permissions', table => {
		table.bigIncrements('id');
		table.string('name').notNullable();
		table.string('key').notNullable();
		table.boolean('isActive');
	});
};

exports.down = async function(knex) {
	await knex.schema.dropTableIfExists('permissions');
};
