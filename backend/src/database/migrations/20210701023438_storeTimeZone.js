
exports.up = async knex => {
	await knex.schema.alterTable('storeConfig', table => {
		table.integer('timeZone').defaultTo(-3);
	})
};

exports.down = async knex => {
	await knex.schema.alterTable('storeConfig', table => {
		table.dropColumn('timeZone')
	})
};
