const PublicError = require('../../errors/PublicError');
const { Op } = require('sequelize');

module.exports = class ReportController
{
	/**
	 *Creates an instance of ReportController.
	 * @param {Server} server
	 */
	constructor(server)
	{
		/**
		 * @type {Server}
		 */
		this.server = server;
	}

	get db()
	{
		return this.server.db;
	}

	get utils()
	{
		return this.server.utils
	}
	get sequelize()
	{
		return this.server.sequelize;
	}

	get models ()
	{
		return this.server.models;
	}

	filters(knex, options = {}) {
		if (options.fromDate) knex.where('orders.createdAt', '>=', new Date(options.fromDate));
		if (options.toDate) knex.where('orders.createdAt', '<=', new Date(options.toDate));

		knex.where('orders.refunded', false);
		knex.where('orders.isPaid', true);
		if (options.statusId) knex.whereIn('orders.statusId', options.statusId);
		if (options.paymentMethod) knex.where('orders.paymentMethod', options.paymentMethod);
	}

	async productPriceHistory(productId) {
		const product = await this.db('products').where('id', productId).first();
		if (!product) return {};

		const productHistory = await this.db('productPoints')
			.select([
				'productPoints.*', 'productPrices.*', 'productPoints.price as pointsPrice'
			])
			.leftJoin('productPrices', 'productPrices.id', 'productPoints.id')
			.where('productPoints.productId', productId)
			.orderBy('productPoints.createdAt', 'desc');


		const finalProduct = {
			...product,
			productHistory,
		};

		return finalProduct;
	}

	async totalSells(options = {}) {
		const dispatchedStatus = await this.utils.orders.getOrderStatus({ key: 'dispatched' });
		const deliveredStatus = await this.utils.orders.getOrderStatus({ key: 'delivered' });
		options.statusId = [dispatchedStatus.id, deliveredStatus.id];

		const { totalSells } = await this.db('orders')
			.select(this.db.raw(`SUM("orderProducts".price * "orderProducts".amount) AS "totalSells"`))
			.innerJoin('orderProducts', 'orders.id', 'orderProducts.orderId')
			.whereNot('orders.paymentMethod', 'points')
			.modify(knex => this.filters(knex, options))
			.first();

		return totalSells;
	}


	async mostSelledProducts(options = {}) {
		const productsQuery = await this.db('orderProducts')
			.select([
				'orderProducts.productId',
				this.db.raw(`SUM("orderProducts".amount) AS "totalSells"`)
			])
			.innerJoin('orders', 'orderProducts.orderId', 'orders.id')
			.innerJoin('products', 'products.id', 'orderProducts.productId')
			.modify(knex => this.filters(knex, options))
			.groupBy('productId')
			.orderBy('totalSells', 'desc')
			.limit(5);

		const productsIds = [];
		for (const product of productsQuery) {
			productsIds.push(product.productId);
		}
		if (!productsIds || !Array.isArray(productsIds) || productsIds.length <= 0) return [];
		const mostSelledProducts = await this.utils.products.getProducts(productsIds);
		for (const mostSelledProduct of mostSelledProducts) {
			for (const product of productsQuery) {
				if (product.productId == mostSelledProduct.id) {
					product.product = mostSelledProduct;
					break;
				}
			}
		}

		return productsQuery;
	}

	/*async createReportAmountOfTotalSalesByPeriods(fromDate,toDate) {
		const count = await this.db('orders')
			.count('orders.id')
			.where(builder => {
				if (fromDate) builder.where('orders.createdAt', '>=', new Date(fromDate));
				if (toDate) builder.where('orders.createdAt', '<=', new Date(toDate));
			})

		return count;
	}*/

	async amountOfOrdersByTypeOfDelivery(options = {}) {
		const countOrdersByDeliveryType = await this.db('orders')
			.select('withDelivery')
			.count('orders.id')
			.modify(knex => this.filters(knex, options))
			.groupBy('withDelivery');

		return countOrdersByDeliveryType;
	}

	async amountOfOrdersByTypeOfPayment(options = {}) {
		const countOrdersByPayment = await this.db('orders')
			.select('paymentMethod')
			.count('orders.id')
			.modify(knex => this.filters(knex, options))
			.groupBy('paymentMethod');

		return countOrdersByPayment;
	}

	async customersWhoMadeTheMostPurchases(options = {}) {
		const dispatchedStatus = await this.utils.orders.getOrderStatus({ key: 'dispatched' });
		const deliveredStatus = await this.utils.orders.getOrderStatus({ key: 'delivered' });
		options.statusId = [dispatchedStatus.id, deliveredStatus.id];

		const clientWithMostOrders = await this.db('orders')
			.select([
				'orders.clientId',
				this.db.raw(`COUNT("orders".id) AS "totalOrders"`)
			])
			.modify(knex => this.filters(knex, options))
			.groupBy('clientId')
			.orderBy('totalOrders', 'desc')
			.first();

		const clientSpentTheMost = await this.db('orders')
			.select([
				'orders.clientId',
				this.db.raw(`SUM("orderProducts".price * "orderProducts".amount) AS "totalSpent"`)
			])
			.innerJoin('orderProducts', 'orders.id', 'orderProducts.orderId')
			.modify(knex => this.filters(knex, options))
			.groupBy('clientId')
			.orderBy('totalSpent', 'desc')
			.first();

		if (!clientWithMostOrders && !clientSpentTheMost) return {};

		if (clientWithMostOrders && clientWithMostOrders.clientId) clientWithMostOrders.client = await this.utils.clients.getClient({ userId: clientWithMostOrders.clientId, onlyPublic: true });
		if (clientSpentTheMost && clientSpentTheMost.clientId) clientSpentTheMost.client = await this.utils.clients.getClient({ userId: clientSpentTheMost.clientId, onlyPublic: true });

		return { clientWithMostOrders, clientSpentTheMost };
	}

	async avgSalesPerDayOfTheWeek(options = {}) {
		const dispatchedStatus = await this.utils.orders.getOrderStatus({ key: 'dispatched' });
		const deliveredStatus = await this.utils.orders.getOrderStatus({ key: 'delivered' });
		options.statusId = [dispatchedStatus.id, deliveredStatus.id];

		const subquery = this.db('orders')
			.select([
				this.db.raw(`extract(isodow from "createdAt") as dow`),
				this.db.raw(`extract(week from "createdAt") as week`),
				this.db.raw(`count(id) as count`)
			])
			.where(builder => this.filters(builder, options))
			.groupBy(['dow', 'week'])
			.as('perDay');


		const result = await this.db(subquery).select([
			'dow',
			this.db.raw(`avg(count)`)
		]).groupBy('dow');
		return result;
	}
}