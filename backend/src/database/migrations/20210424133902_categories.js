
exports.up = async function(knex) {
	await knex.schema.createTable('categories', table => {
		table.bigIncrements('id');
		table.string('name');
		table.boolean('isActive').defaultTo(true);
		table.timestamp('createdAt').defaultTo(knex.fn.now());
	});
};

exports.down = async function(knex) {
	await knex.schema.dropTableIfExists('categories');
};
