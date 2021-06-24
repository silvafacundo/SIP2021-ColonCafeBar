exports.up = async knex => {
	await knex.schema.alterTable('orders', table => {
		table.float('deliveryPrice');
	});
};

exports.down = async knex => {
	await knex.schema.alterTable('orders', table => {
		table.dropColumn('deliveryPrice');
	});
};

