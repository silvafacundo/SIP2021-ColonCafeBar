
exports.up = async function(knex) {
	await knex.schema.createTable('addresses', table => {
		table.bigIncrements('id');
		table.bigInteger('userId').unsigned().notNullable().references('users.id');
		table.string('street').notNullable();
		table.bigInteger('number').notNullable();
		table.string('floor');
	});
};

exports.down = async function(knex) {
	await knex.schema.dropTableIfExists('addresses');
};
