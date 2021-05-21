const BaseModel = require('../BaseModel');
const Client = require('../clients/Client');
const OrderProduct = require('../products/orderProduct');
module.exports = class Order extends BaseModel{
	constructor(server, orderData, products, client) {
		super(server);
		if (!orderData) throw new Error('orderData is required');
		if (!products) throw new Error('products is required');
		if (!client) throw new Error('client is required');
		if (client && !(client instanceof Client)) throw new Error('Client should be an instance of Client');
		if (!Array.isArray(products)) throw new Error('Expected an array of OrderProducts');
		for (const product of products) {
			if (!(product instanceof OrderProduct)) throw new Error('Expected an array of OrderProducts')
		}

		this._orderData = orderData;
		this._products = products;
		this._client = client;
	}
	get id() {
		return this._orderData.id;
	}
	get status() {
		return this._orderData.status;
	}
	get products() {
		return this._products;
	}
	get total() {
		return this.products.reduce((prevValue, product) => prevValue + (product.price * product.amount), 0)
	}
	get isPaid() {
		return this._orderData.isPaid;
	}
	get withDelivery() {
		return this._orderData.withDelivery;
	}
	get address() {
		return this._orderData.address;
	}
	/**
	 * order client
	 * @returns {Client}
	 * @readonly
	 */
	get client() {
		return this._client;
	}

}