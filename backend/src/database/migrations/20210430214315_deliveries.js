
exports.up = async function(knex) {
	await knex.schema.createTable('deliveries', table => {
		table.bigIncrements('id');
		table.string('name');
		table.string('lastName');
		table.string('phoneNumber');
		table.timestamp('createdAt').defaultTo(knex.fn.now());
	});
};

exports.down = async function(knex) {
	await knex.schema.dropTableIfExists('deliveries');
};
