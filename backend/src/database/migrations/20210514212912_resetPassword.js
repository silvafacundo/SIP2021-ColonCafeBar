
exports.up = async knex => {
	await knex.schema.createTable('resetPassword', table => {
		table.bigIncrements('id');
		table.bigInteger('accountId').notNullable();
		table.string('accountType').notNullable().defaultTo('client');
		table.string('token').unique();
		table.boolean('consumed').defaultTo('false');
		table.timestamp('createdAt').defaultTo(knex.fn.now());
	})
};

exports.down = async knex => {
	await knex.schema.dropTableIfExists('resetPassword');
};
