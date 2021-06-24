exports.up = async function(knex) {
	await knex.schema.createTable('storeData', table => {
		table.bigIncrements('id');
		// Delivery distances
		table.float('minDeliveryPrice');
		table.float('maxDeliveryPrice');
		table.float('deliveryPricePerKm');
		table.float('maxDeliveryKm');
		// Address data
		table.string('street').notNullable();
		table.string('city').notNullable();
		table.string('neighborhood').notNullable();
		table.string('number').notNullable();
		table.string('postalCode').notNullable();
		table.string('coordinates').notNullable();
		table.timestamp('createdAt').defaultTo(knex.fn.now());
	});
};

exports.down = async function(knex) {
	await knex.schema.dropTableIfExists('storeData');
};
