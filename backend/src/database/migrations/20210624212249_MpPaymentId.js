exports.up = async knex => {
	await knex.schema.alterTable('orderMercadopago', table => {
		table.timestamp('updatedAt').defaultTo(knex.fn.now());
		table.string('paymentId');
	});
};

exports.down = async knex => {
	await knex.schema.alterTable('orderMercadopago', table => {
		table.dropColumn('updatedAt');
		table.dropColumn('paymentId');
	});
};
