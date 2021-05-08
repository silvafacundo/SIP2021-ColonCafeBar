const bcrypt = require('bcrypt');

exports.seed = async knex => {
	// Inserts seed entries
	const hash = await bcrypt.hash('12345', 10);

	await knex('users').insert({
		username: 'admin',
		name: 'Admin Supremo',
		password: hash,
		isAdmin: true,
		isActive: true
	});

	// permissions
	const permissions = await knex('permissions')
		.insert([
			{ name: 'Gestion de usuarios', key: 'users', isActive: true },
			{ name: 'Gestion de ordenes', key: 'orders', isActive: true },
			{ name: 'Gestion del menu', key: 'menu', isActive: true },
			{ name: 'Gestion del clientes', key: 'clients', isActive: true }
		])
		.returning('*');

	const role = await knex('roles')
		.insert({
			name: 'Super admin',
			description: 'Este rol tiene acceso a todos los modulos del sistema',
			isActive: true
		})
		.returning('*');

	await knex('permissionsRoles')
		.insert([
			{ roleId: role[0].id, permissionId: permissions[0].id },
			{ roleId: role[0].id, permissionId: permissions[1].id },
			{ roleId: role[0].id, permissionId: permissions[2].id },
			{ roleId: role[0].id, permissionId: permissions[3].id },
		])
};
