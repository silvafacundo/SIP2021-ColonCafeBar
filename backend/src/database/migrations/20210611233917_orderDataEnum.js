/**
 * @typedef {(import('knex'))} Knex
 */

const { default: knex } = require('knex');


/**
 *
 * @param {Knex} knex
 */
exports.up = async knex => {
	await knex.schema.createTable('orderPaymentMethods', table => {
		table.bigIncrements('id');
		table.string('methodName').notNullable();
	});

	await knex.schema.createTable('orderStatus', table => {
		table.bigIncrements('id');
		table.string('statusName').notNullable();
	});

	await knex.schema.alterTable('orders', table => {
		table.dropColumn('paymentMethod');
		table.dropColumn('status');
		table.bigInteger('paymentMethodId').references('orderPaymentMethods.id').notNullable();
		table.bigInteger('statusId').references('orderStatus.id').notNullable();
	});

	await insertPaymentMethods(knex);
	await insertStatus(knex);
};

exports.down = async knex => {
	await knex.schema.alterTable('orders', table => {
		table.dropColumn('paymentMethodId');
		table.dropColumn('statusId');
		table.string('status').notNullable().defaultTo('pendiente');
		table.string('paymentMethod').notNullable();
	});

	await knex.schema.dropTableIfExists('orderStatus');
	await knex.schema.dropTableIfExists('orderPaymentMethods');
};

async function insertPaymentMethods(knex) {
	await knex('orderPaymentMethods').insert([
		{ methodName: 'Efectivo' },
		{ methodName: 'Mercado Pago' },
		{ methodName: 'Puntos' }
	])
}

async function insertStatus(knex) {
	await knex('orderStatus').insert([
		{ statusName: 'Pendiente' },
		{ statusName: 'En espera de preparacion' },
		{ statusName: 'En preparacion' },
		{ statusName: 'En espera de retiro' },
		{ statusName: 'Despachado' },
		{ statusName: 'Entregado' },
		{ statusName: 'Cancelado' }
	])
}
