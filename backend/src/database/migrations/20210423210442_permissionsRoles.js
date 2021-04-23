
exports.up = async function(knex) {
	await knex.schema.createTable('permissionsRoles', table => {
		table.bigInteger('permissionId').unsigned().references('permissions.id').index();
		table.bigInteger('roleId').unsigned().references('roles.id').index();
		table.timestamp('createdAt').defaultTo(knex.fn.now());

		table.primary(['permissionId', 'roleId']);
	});
};

exports.down = async function(knex) {
	await knex.schema.dropTableIfExists('permissionsRoles');
};
