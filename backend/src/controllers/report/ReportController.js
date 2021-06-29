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


	async productsPriceHistory() {
		const productsPricesHistory = await this.db('productPrices')
			.orderBy('productId', 'asc')
			.orderBy('createdAt', 'asc');

		const productPointsPricesHistory = await this.db('productPoints')
			.orderBy('productId', 'asc')
			.orderBy('createdAt', 'asc');

		const products = await this.db('products').orderBy('id', 'asc');

		const finalProducts = [];

		for (const product of products) {
			finalProducts.push({
				...product,
				priceHistory: productsPricesHistory.filter(productPrice => Number(productPrice.productId) === Number(product.id)),
				pointsPricesHistory: productPointsPricesHistory.filter(productPrice => Number(productPrice.productId) === Number(product.id))
			})
		}

		return finalProducts;
	}

	async incomeByPeriod(dateFrom, dateTo) {
		const dispatchedStatus = await this.utils.orders.getOrderStatus({ key: 'dispatched' });
		const deliveredStatus = await this.utils.orders.getOrderStatus({ key: 'delivered' });

		const orders = await this.db('orders')
			.whereNot('paymentMethod', 'points')
			.whereIn('statusId', [dispatchedStatus.id, deliveredStatus.id])
			.where(builder =>{
				if (dateFrom) builder.where('createAt', '>=', new Date(dateFrom))
				if (dateTo) builder.where('createAt', '<', new Date(dateTo))
			})

		return orders;
	}


	async mostSelledProducts(dateFrom, dateTo) {
		const products = await this.db('orderProducts')
			.select([
				'orderProducts.productId',
				this.db.raw(`SUM("orderProducts".amount) AS "totalSells"`)
			])
			.innerJoin('orders', 'orderProducts.orderId', 'orders.id')
			.where(builder => {
				if (dateFrom) builder('orders.createdAt', '>=', new Date(dateFrom));
				if (dateTo) builder('orders.createdAt', '>=', new Date(dateTo));
			})
			.orderBy('totalSells', 'desc');

		return products;
	}

	async createReportAmountOfTotalSalesByPeriods(dateFrom,dateTo) {
		// const count = await this.db('orders')
		// .select(COUNT('order.id'))
		// .where('orders.createdAt'>=dateFrom && 'orders.createdAt'<=dateTo);
		// return {count};
	}

	//condition = >'orders.paymentMethod'==='' or 'orders.paymentMethod'==='' or 'orders.paymentMethod'===''
	async createReportQuantityOfOrdersByTypeOfDelivery(dateFrom,dateTo,condition) {
		// const count = await this.db('orders')
		// .select(COUNT('order.id'))
		// .where(('orders.createdAt'>=dateFrom && 'orders.createdAt'<=dateTo) && condition);
		// return {count};
	}

	//condition = >'orders.withDelivery'===true or 'orders.withDelivery'===false
	async createReportNumberOfOrdersByTypeOfPayment(dateFrom, dateTo, condition) {
		// const count = await this.db('orders')
		// .select(COUNT('order.id'))
		// .where(('orders.createdAt'>=dateFrom && 'orders.createdAt'<=dateTo) && condition);
		// return {count};
	}

	async createReportCustomerWhoMadeTheMostPurchases(dateFrom, dateTo) {
		// const clients = await this.db('orders')
		// .select('orders.clientId',COUNT('orderProducts.amount'))
		// .innerJoin('orderProducts','orderProducts.orderId','orders.id')
		// .innerJoin('product','product.id','orderProducts.productId')
		// .groupBy('orders.clientId')
		// .where((('orders.createdAt'>=dateFrom) && ('orders.createdAt'<=dateTo)));

		// const client = await this.db('clients')
		// .select('*')
		// .innerJoin(clients, function(){
		// 	this.on('clients.clientId', 'clients.id')})
		// .where( 'clients.count'===(MAX('clients.count'))).first();;

		// return {client};
	}
}