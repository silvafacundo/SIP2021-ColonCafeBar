exports.up = async function(knex) {
	await knex.schema.createTable('storeConfig', table => {
		table.bigIncrements('id');
		// Delivery distances
		table.float('minDeliveryPrice');
		table.float('maxDeliveryPrice');
		table.float('deliveryPricePerKm');
		table.float('maxDeliveryKm');
		// Address data
		table.string('coordinates').notNullable();
		table.timestamp('createdAt').defaultTo(knex.fn.now());
	});
};

exports.down = async function(knex) {
	await knex.schema.dropTableIfExists('storeConfig');
};
