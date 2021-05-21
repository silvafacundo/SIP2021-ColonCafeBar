
exports.up = async knex => {
	await knex.schema.createTable('orderMercadopago', table => {
		table.bigIncrements('orderId').references('orders.id');
		table.string('mpId').notNullable();
		// table.primary(['orderId']);
		table.timestamp('createdAt').defaultTo(knex.fn.now());
	})
};

exports.down = async knex => {
	await knex.schema.dropTableIfExists('orderMercadopago');
};
