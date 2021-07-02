exports.up = async knex => {
	await knex('permissions').insert([
		{ name: 'Gestion de permisos', key: 'permissions' },
		{ name: 'Gestion de categorías', key: 'categories' },
		{ name: 'Gestion de deliveries', key: 'deliveries' },
		{ name: 'Visualizar métricas', key: 'metrics' },
		{ name: 'Gestion de roles', key: 'roles' },
		{ name: 'Gestion de horarios de la tienda', key: 'schedule' },
		{ name: 'Gestion de la tienda', key: 'store' },
	])
};

exports.down = async knex => {
	await knex('permissions')
		.whereIn('key', ['permissions', 'categories', 'deliveries', 'metrics', 'roles', 'schedule', 'store'])
		.del();
};