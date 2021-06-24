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


	async createReportPriceHistoryByProduct() 
	{
		const productPrice = await this.db('productPrices')
		.select('productPrices.productId','productPrices.price','productPrices.createdAt')
		.innerJoin('product','productPrices.productId','product.id')
		.groupBy('productId')
		.where('product.isActive'===true);
		return { productPrice};
	}

	async createReportIssueCollectionByPeriod(dateFrom,dateTo) 
	{
		const sum = await this.db('orders')
		.select(SUM('orderProducts.price'))
		.innerJoin('orderProducts','orderProducts.orderId','orders.id')
		.where(('orders.createdAt'>=dateFrom) && ('orders.createdAt'<=dateTo));
		return {sum};
	}


	async createReportMostSelledProducts(dateFrom,dateTo) 
	{
		const products = await this.db('orders')
		.select('product.id','product.name',COUNT('orderProducts.amount'))
		.innerJoin('orderProducts','orderProducts.orderId','orders.id')
		.innerJoin('product','product.id','orderProducts.productId')
		.groupBy('product.id')
		.where(((('orders.createdAt'>=dateFrom) && ('orders.createdAt'<=dateTo) ) && 'orders.isPaid' === true ));
		return {products};
	}

	async createReportAmountOfTotalSalesByPeriods(dateFrom,dateTo) 
	{
		const count = await this.db('orders')
		.select(COUNT('order.id'))
		.where('orders.createdAt'>=dateFrom && 'orders.createdAt'<=dateTo);
		return {count};
	}

	//condition = >'orders.paymentMethod'==='' or 'orders.paymentMethod'==='' or 'orders.paymentMethod'==='' 
	async createReportQuantityOfOrdersByTypeOfDelivery(dateFrom,dateTo,condition)
	{
		const count = await this.db('orders')
		.select(COUNT('order.id'))
		.where(('orders.createdAt'>=dateFrom && 'orders.createdAt'<=dateTo) && condition);
		return {count};
	}

	//condition = >'orders.withDelivery'===true or 'orders.withDelivery'===false 
	async createReportNumberOfOrdersByTypeOfPayment(dateFrom,dateTo,condition)
	{
		const count = await this.db('orders')
		.select(COUNT('order.id'))
		.where(('orders.createdAt'>=dateFrom && 'orders.createdAt'<=dateTo) && condition);
		return {count};
	}

	async createReportCustomerWhoMadeTheMostPurchases(dateFrom,dateTo)
	{
		const clients = await this.db('orders')
		.select('orders.clientId',COUNT('orderProducts.amount'))
		.innerJoin('orderProducts','orderProducts.orderId','orders.id')
		.innerJoin('product','product.id','orderProducts.productId')
		.groupBy('orders.clientId')
		.where((('orders.createdAt'>=dateFrom) && ('orders.createdAt'<=dateTo)));
		
		const client = await this.db('clients')
		.select('*')
		.innerJoin(clients, function(){
			this.on('clients.clientId', 'clients.id')})
		.where( 'clients.count'===(MAX('clients.count'))).first();;

		return {client};
	}
}