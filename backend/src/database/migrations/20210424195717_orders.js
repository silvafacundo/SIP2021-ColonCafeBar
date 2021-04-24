
exports.up = async function(knex) {
    await knex.schema.createTable('orders', table => {
		table.bigIncrements('id');
        
	});
};

exports.down = async function(knex) {
    await knex.schema.dropTableIfExists('orders');
};
