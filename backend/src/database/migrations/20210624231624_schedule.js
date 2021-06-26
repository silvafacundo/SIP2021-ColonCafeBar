
exports.up = async function(knex) {
	await knex.schema.createTable('schedules', table => {
		table.bigIncrements('id');
		table.time('openingTime',);
		table.time('closingTime');
		table.specificType('dayOfWeek', 'smallint');
		table.timestamp('createdAt').defaultTo(knex.fn.now());
	});
};

exports.down = async function(knex) {
	await knex.schema.dropTableIfExists('schedules');
};
