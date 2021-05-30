
exports.up = async knex => {
	await knex.schema.alterTable('products', table => {
		table.jsonb('variants')
	});

	await knex.schema.alterTable('orderProducts', table => {
		table.jsonb('selectedVariants')
	});
};

exports.down = async knex => {
	await knex.schema.alterTable('products', table => {
		table.dropColumn('variants');
	});

	await knex.schema.alterTable('orderProducts', table => {
		table.dropColumn('selectedVariants');
	});
};
