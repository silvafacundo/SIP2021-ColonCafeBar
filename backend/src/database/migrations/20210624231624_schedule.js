
exports.up = async function(knex) {
	await knex.schema.createTable('schedules', table => {
		table.bigIncrements('id');
		table.string('alias').notNullable();
		table.time('openingTime').notNullable();
		table.time('closingTime').notNullable();
		table.specificType('dayOfWeek', 'smallint').notNullable();
		table.timestamp('createdAt').defaultTo(knex.fn.now());
	});
};

exports.down = async function(knex) {
	await knex.schema.dropTableIfExists('schedules');
};
