
exports.up = async knex => {
	await knex('orderStatus').insert({
		key: 'onTheWay',
		statusName: 'En camino'
	});

	await knex('orderStatus').where({ key: 'awaitingPreparation' }).update({ statusName: 'En espera de preparación' });
	await knex('orderStatus').where({ key: 'inPreparation' }).update({ statusName: 'En preparación' });
	await knex('orderStatus').where({ key: 'dispatched' }).update({ statusName: 'Retirado' });
};

exports.down = async knex => {
	await knex('orderStatus').where({ key: 'awaitingPreparation' }).update({ statusName: 'En espera de preparacion' });
	await knex('orderStatus').where({ key: 'inPreparation' }).update({ statusName: 'En preparacion' });
	await knex('orderStatus').where({ key: 'dispatched' }).update({ statusName: 'Despachado' });

	await knex('orderStatus').where({ key: 'onTheWay' }).del();
};
