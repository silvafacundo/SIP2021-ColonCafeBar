
exports.up = async knex => {
	await knex.schema.alterTable('deliveries', table => {
		table.boolean('isDeleted').default(false);
	});
};

exports.down = async knex => {
	await knex.schema.alterTable('deliveries', table => {
		table.dropColumn('isDeleted');
	});
};
