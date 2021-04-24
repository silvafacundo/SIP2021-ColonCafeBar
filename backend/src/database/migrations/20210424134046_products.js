
exports.up = async function(knex) {
    await knex.schema.createTable('products', table => {
		table.bigIncrements('id');
		table.bigInteger('idCategory').unsigned().references('categories.id').index();;
        table.string('name');
        table.string('description');
        table.float('price');
		table.timestamp('createdAt').defaultTo(knex.fn.now());
	});
};

exports.down = async function(knex) {
    await knex.schema.dropTableIfExists('products');
};
