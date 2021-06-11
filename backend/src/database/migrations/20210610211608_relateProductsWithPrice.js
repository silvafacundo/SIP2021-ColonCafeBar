
exports.up = async knex => {
	await knex.schema.alterTable('products', table => {
		table.bigInteger('priceId')
			.unsigned()
			.references('productPrices');
	});

	const products = await knex('products');
	for (const product of products) {
		const price = await knex('productPrices')
			.where('productId', product.id)
			.orderBy('createdAt', 'DESC')
			.first();
		await knex('products')
			.where('id', product.id)
			.update({ priceId: price.id })
	}
};

exports.down = async knex => {
	await knex.schema.alterTable('products', table => {
		table.dropColumn('priceId');
	});
};
