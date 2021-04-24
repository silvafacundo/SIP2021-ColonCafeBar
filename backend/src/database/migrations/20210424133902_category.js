
exports.up = async function(knex) {
    await knex.schema.createTable('category', table => {
		table.bigIncrements('id');
		table.string('name');
		table.timestamp('createdAt').defaultTo(knex.fn.now());
	});
};

exports.down = function(knex) {
    await knex.schema.dropTableIfExists('category');
};
