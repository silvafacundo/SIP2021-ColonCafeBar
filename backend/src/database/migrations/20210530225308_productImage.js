
exports.up = async knex => {
	await knex.schema.alterTable('products', table => {
		table.string('imageUrl')
	});
};

exports.down = async knex => {
	await knex.schema.alterTable('products', table => {
		table.dropColumn('imageUrl');
	});
};