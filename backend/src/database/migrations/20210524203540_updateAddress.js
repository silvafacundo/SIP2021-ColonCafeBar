exports.up = async knex => {
	await knex.schema.alterTable('addresses', table => {
		// ID
		table.string('alias');
		// ClientId
		table.string('city').notNullable();
		table.string('neighborhood').notNullable();
		// Street
		table.string('number').alter();
		// Floor
		table.string('corner').notNullable();
		table.string('coordinates');
		table.boolean('isDeleted').default(false);
		table.timestamp('createdAt').default(knex.fn.now());
	});
};

exports.down = async knex => {
	await knex.schema.alterTable('addresses', table => {
		table.dropColumn('alias');
		table.dropColumn('city');
		table.dropColumn('neighborhood');
		table.bigInteger('number').alter();
		table.dropColumn('corner');
		table.dropColumn('coordinates');
		table.dropColumn('isDeleted');
		table.dropColumn('createdAt');
	})
};
