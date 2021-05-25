
exports.up = async knex => {
	await knex.schema.alterTable('clients', table => {
		table.timestamp('sessionValidDate')
	})
};

exports.down = async knex => {
	await knex.schema.alterTable('clients', table => {
		table.dropColumn('sessionValidDate');
	})
};
