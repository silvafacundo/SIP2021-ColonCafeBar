/**
 * @typedef {(import('knex'))} Knex
 */

const { default: knex } = require('knex');


/**
  *
  * @param {Knex} knex
  */
exports.up = async knex => {
	await knex.schema.alterTable('orders', table => {
		table.dropColumn('paymentMethodId');
		table.enu('paymentMethod', ['cash', 'points', 'online']);
	});

	await knex.schema.dropTableIfExists('orderPaymentMethods');

	await knex('orders').del();

	await knex('orderStatus').del();

	await knex.schema.alterTable('orderStatus', table => {
		table.string('key').unique();
	});

	await insertStatus(knex);
};

exports.down = async knex => {
	await knex.schema.alterTable('orderStatus', table => {
		table.dropColumn('key');
	});

	await knex.schema.createTable('orderPaymentMethods', table => {
		table.bigIncrements('id');
		table.string('methodName').notNullable();
	});

	await insertPaymentMethods(knex);

	const paymentMethod = await knex('orderPaymentMethods').first();

	await knex.schema.alterTable('orders', table => {
		table.bigInteger('paymentMethodId').references('orderPaymentMethods.id').notNullable().default(paymentMethod.id);
		table.dropColumn('paymentMethod');
	});
};

async function insertStatus(knex) {
	await knex('orderStatus').insert([
		{ key: 'pending', statusName: 'Pendiente' },
		{ key: 'awaitingPreparation', statusName: 'En espera de preparacion' },
		{ key: 'inPreparation', statusName: 'En preparacion' },
		{ key: 'awaitingWithdrawal', statusName: 'En espera de retiro' },
		{ key: 'dispatched', statusName: 'Despachado' },
		{ key: 'delivered', statusName: 'Entregado' },
		{ key: 'cancelled', statusName: 'Cancelado' }
	])
}

async function insertPaymentMethods(knex) {
	await knex('orderPaymentMethods').insert([
		{ methodName: 'Efectivo' },
		{ methodName: 'Mercado Pago' },
		{ methodName: 'Puntos' }
	])
}