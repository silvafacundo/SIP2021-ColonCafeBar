
exports.up = async knex => {
	await knex.schema.dropTable('orderProducts');
	await knex.schema.createTable('orderProducts', table => {
		table.bigIncrements('id');
		table.bigInteger('orderId').unsigned().references('orders.id').index();
		table.bigInteger('productId').unsigned().references('products.id').index();
		table.integer('amount').notNullable();
		table.jsonb('selectedVariants')
		table.float('price');

	});
}
exports.down = async knex => {
	await knex.schema.dropTable('orderProducts');
	await knex.schema.createTable('orderProducts', table => {
		table.bigInteger('orderId').unsigned().references('orders.id').index();
		table.bigInteger('productId').unsigned().references('products.id').index();
		table.integer('amount').notNullable();
		table.float('price');
		table.jsonb('selectedVariants')
		table.primary(['orderId', 'productId']);
	});
}
