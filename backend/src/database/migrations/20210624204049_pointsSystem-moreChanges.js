
exports.up = async knex => {
	await knex.schema.alterTable('orderProducts', table => {
		table.integer('pointsPrice').notNullable().defaultTo(0);
		table.integer('grantablePoints').notNullable().defaultTo(0);
	});
};

exports.down = async knex => {
	await knex.schema.alterTable('orderProducts', table => {
		table.dropColumn('pointsPrice');
		table.dropColumn('grantablePoints');
	});
};
