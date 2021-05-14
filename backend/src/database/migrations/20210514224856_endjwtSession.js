
exports.up = async knex => {
	await knex.schema.alterTable('users', table => {
		table.timestamp('sessionValidDate')
	})
};

exports.down = async knex => {
	await knex.schema.alterTable('users', table => {
		table.dropColumn('sessionValidDate');
	})

};
