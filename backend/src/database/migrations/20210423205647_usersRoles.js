
exports.up = async function(knex) {
	await knex.schema.createTable('usersRoles', table => {
		table.bigInteger('roleId').unsigned().references('roles.id').index();
		table.bigInteger('userId').unsigned().references('users.id').index();
		table.timestamp('createdAt').defaultTo(knex.fn.now());

		table.primary(['roleId', 'userId']);
	});
};

exports.down = async function(knex) {
	await knex.schema.dropTableIfExists('usersRoles');
};
