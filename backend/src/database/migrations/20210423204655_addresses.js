
exports.up = async function(knex) {
	await knex.schema.createTable('addresses', table => {
		table.bigIncrements('id');
		table.bigInteger('clientId').unsigned().notNullable().references('clients.id');
		table.string('street').notNullable();
		table.bigInteger('number').notNullable();
		table.string('floor');
	});
};

exports.down = async function(knex) {
	await knex.schema.dropTableIfExists('addresses');
};
