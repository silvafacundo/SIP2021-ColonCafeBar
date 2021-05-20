
exports.up = async function(knex) {
	await knex.schema.createTable('orders', table => {
		table.bigIncrements('id');
		table.bigInteger('clientId').notNullable().references('clients.id');
		table.string('status').notNullable().defaultTo('pendiente');
		table.string('paymentMethod').notNullable();
		table.boolean('isPaid').defaultTo(false);
		table.boolean('withDelivery').notNullable();
		table.bigInteger('deliveryId').references('deliveries.id');
		table.bigInteger('addressId').references('addresses.id');
		table.timestamp('createdAt').defaultTo(knex.fn.now());
	});
	/*
		estados
			pendiente (de aprobacion, si se acepta sigue, sino cancelado)
			en espera de preparacion
			en preparacion
			en espera de retiro (take away)
			despachado
			entregado
			cancelado
	*/

	await knex.schema.createTable('orderProducts', table => {
		table.bigInteger('orderId').unsigned().references('orders.id').index();
		table.bigInteger('productId').unsigned().references('products.id').index();
		table.integer('amount').notNullable();
		table.float('price');

		table.primary(['orderId', 'productId']);
	});
};

exports.down = async function(knex) {
	await knex.schema.dropTableIfExists('orderProducts');
	await knex.schema.dropTableIfExists('orders');
};
