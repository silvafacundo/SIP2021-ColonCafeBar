
exports.up = async function(knex) {
	await knex.schema.alterTable('addresses', table => {
		table.string('postalCode');
	});
};

exports.down = async function(knex) {
	await knex.schema.alterTable('addresses', table => {
		table.dropColumn('postalCode');
	});
};
