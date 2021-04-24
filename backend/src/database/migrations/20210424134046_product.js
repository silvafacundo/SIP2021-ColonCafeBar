
exports.up = async function(knex) {
    await knex.schema.createTable('product', table => {
		table.bigIncrements('id');
		table.bigInteger('idCategory').unsigned().references('category.id').index();;
        table.string('name');
        table.string('description');
        table.float('price');
		table.timestamp('createdAt').defaultTo(knex.fn.now());
	});
};

exports.down = function(knex) {
    await knex.schema.dropTableIfExists('product');
};
