
exports.up = async knex => {
	await knex.schema.alterTable('orderStatus', table => {
		table.integer('sortNumber');
		table.integer('priorityService').defaultTo(7);
	});

	await knex('orderStatus').where({ key: 'pending' }).update({ sortNumber: 1, priorityService: 10 });
	await knex('orderStatus').where({ key: 'awaitingPreparation' }).update({ sortNumber: 2, priorityService: 9 });
	await knex('orderStatus').where({ key: 'inPreparation' }).update({ sortNumber: 3, priorityService: 8 });
	await knex('orderStatus').where({ key: 'awaitingWithdrawal' }).update({ sortNumber: 4, priorityService: 7 });
	await knex('orderStatus').where({ key: 'dispatched' }).update({ sortNumber: 5, priorityService: 7 });
	await knex('orderStatus').where({ key: 'onTheWay' }).update({ sortNumber: 6, priorityService: 7 });
	await knex('orderStatus').where({ key: 'delivered' }).update({ sortNumber: 7, priorityService: 7 });
	await knex('orderStatus').where({ key: 'cancelled' }).update({ sortNumber: 8, priorityService: 7 });
};

exports.down = async knex => {
	await knex.schema.alterTable('orderStatus', table => {
		table.dropColumn('sortNumber');
		table.dropColumn('priorityService');
	});
};
