exports.up = async knex => {
	await knex.schema.alterTable('orders', table => {
		table.boolean('refunded').defaultTo(false);
	});
};

exports.down = async knex => {
	await knex.schema.alterTable('orders', table => {
		table.dropColumn('refunded');
	});
};
