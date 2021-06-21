
exports.up = async knex => {
	await knex.schema.alterTable('clients', table => {
		table.integer('availablePoints').notNullable().defaultTo(0);
	});

	await knex.schema.createTable('productPoints', table => {
		table.bigIncrements('id');
		table.bigInteger('productId').references('products.id');
		table.integer('price').notNullable();
		table.integer('grant').notNullable().defaultTo(0);
		table.timestamp('createdAt').defaultTo(knex.fn.now());
	})

	await knex('orderProducts').del();
	await knex('orders').del();
	await knex('productPrices').del();
	await knex('products').del();

	await knex.schema.alterTable('products', table => {
		table.bigInteger('pointsId').references('productPoints.id');
	});
};

exports.down = async knex => {
	await knex.schema.alterTable('products', table => {
		table.dropColumn('pointsId');
	});

	await knex.schema.dropTableIfExists('productPoints');

	await knex.schema.alterTable('clients', table => {
		table.dropColumn('availablePoints');
	});
};
