exports.up = async function(knex) {
	await await knex.schema.dropTableIfExists('storeData');

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

	await knex('storeConfig')
		.insert({
			minDeliveryPrice: 0,
			maxDeliveryPrice: 0,
			deliveryPricePerKm: 20,
			maxDeliveryKm: 10,
			coordinates: '-34.8921894;-60.01899949999999'
		});
};

exports.down = async function(knex) {
	await knex.schema.dropTableIfExists('storeConfig');
};
