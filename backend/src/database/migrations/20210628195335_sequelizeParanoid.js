
exports.up = async knex => {
	// User
	await knex.schema.alterTable('users', table => {
		table.timestamp('deletedAt');
	});

	// Permissions
	const deletedPermissions = await knex('permissions').where({ isActive: false });
	await knex.schema.alterTable('permissions', table => {
		table.dropColumn('isActive');
		table.timestamp('deletedAt');
	});
	await knex('permissions').whereIn('id', deletedPermissions.map(permission => permission.id)).update({ deletedAt: knex.fn.now() });

	// Roles
	const deletedRoles = await knex('roles').where({ isActive: false });
	await knex.schema.alterTable('roles', table => {
		table.dropColumn('isActive');
		table.timestamp('deletedAt');
	});
	await knex('roles').whereIn('id', deletedRoles.map(role => role.id)).update({ deletedAt: knex.fn.now() });

	// Products
	await knex.schema.alterTable('products', table => {
		table.timestamp('deletedAt');
	});

	// Categories
	const deletedCategories = await knex('categories').where({ isActive: false });
	await knex.schema.alterTable('categories', table => {
		table.dropColumn('isActive');
		table.timestamp('deletedAt');
	});
	await knex('categories').whereIn('id', deletedCategories.map(category => category.id)).update({ deletedAt: knex.fn.now() });

	// Addresses
	const deletedAddresses = await knex('addresses').where({ isDeleted: true });
	await knex.schema.alterTable('addresses', table => {
		table.timestamp('deletedAt');
		table.dropColumn('isDeleted');
	});
	await knex('addresses').whereIn('id', deletedAddresses.map(address => address.id)).update({ deletedAt: knex.fn.now() });

	// Deliveries
	const deletedDeliveries = await knex('deliveries').where({ isDeleted: true });
	await knex.schema.alterTable('deliveries', table => {
		table.dropColumn('isDeleted');
		table.timestamp('deletedAt');
	});
	await knex('deliveries').whereIn('id', deletedDeliveries.map(delivery => delivery.id)).update({ deletedAt: knex.fn.now() });
};

exports.down = async knex => {
	// User
	await knex.schema.alterTable('users', table => {
		table.dropColumn('deletedAt');
	});

	// Permissions
	const deletedPermissions = await knex('permissions').whereNotNull('deletedAt');
	await knex.schema.alterTable('permissions', table => {
		table.boolean('isActive').defaultTo(true);
		table.deleteColumn('deletedAt');
	});
	await knex('permissions').whereIn('id', deletedPermissions.map(permission => permission.id)).update({ isActive: false });

	// Roles
	const deletedRoles = await knex('roles').whereNotNull('deletedAt');
	await knex.schema.alterTable('roles', table => {
		table.boolean('isActive').defaultTo(true);
		table.deleteColumn('deletedAt');
	});
	await knex('roles').whereIn('id', deletedRoles.map(role => role.id)).update({ isActive: false });

	// Products
	await knex.schema.alterTable('products', table => {
		table.dropColumn('deletedAt');
	});

	// Categories
	const deletedCategories = await knex('categories').whereNotNull('deletedAt');
	await knex.schema.alterTable('categories', table => {
		table.boolean('isActive').defaultTo(true);
		table.dropColumn('deletedAt');
	});
	await knex('categories').whereIn('id', deletedCategories.map(category => category.id)).update({ isActive: false });

	// Addresses
	const deletedAddresses = await knex('addresses').whereNotNull('deletedAt');
	await knex.schema.alterTable('addresses', table => {
		table.dropColumn('deletedAt');
		table.boolean('isDeleted').defaultTo(false);
	});
	await knex('addresses').whereIn('id', deletedAddresses.map(address => address.id)).update({ isDeleted: true });

	// Deliveries
	const deletedDeliveries = await knex('deliveries').whereNotNull('deletedAt');
	await knex.schema.alterTable('deliveries', table => {
		table.boolean('isDeleted').defaultTo(false);
		table.dropColumn('deletedAt');
	});
	await knex('deliveries').whereIn('id', deletedDeliveries.map(delivery => delivery.id)).update({ isDeleted: true });
};
