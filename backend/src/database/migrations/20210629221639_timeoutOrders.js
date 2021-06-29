
exports.up = async knex => {
	await knex.schema.alterTable('storeConfig', table => {
		table.integer('orderTimeoutMinutes').defaultTo(5);
	});
};

exports.down = async knex => {
	await knex.schema.alterTable('storeConfig', table => {
		table.dropColumn('orderTimeoutMinutes');
	});
};
