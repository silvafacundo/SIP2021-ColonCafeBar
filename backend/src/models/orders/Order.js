const BaseModel = require('../BaseModel');
const Client = require('../clients/Client');
const OrderProduct = require('../products/OrderProduct');
const Delivery = require('../deliveries/delivery');
module.exports = class Order extends BaseModel{
	constructor(server, orderData, products, client, delivery) {
		super(server);

		if (!orderData) throw new Error('orderData is required');
		if (!products) throw new Error('products is required');

		if (!client) throw new Error('client is required');
		if (client && !(client instanceof Client)) throw new Error('Client should be an instance of Client');

		if (!Array.isArray(products)) throw new Error('Expected an array of OrderProducts');
		for (const product of products) {
			if (!(product instanceof OrderProduct)) throw new Error('Expected an array of OrderProducts')
		}

		if (delivery && !(delivery instanceof Delivery)) throw new Error('delivery should be an instance of Delivery');

		this._orderData = orderData || {};
		this._products = products || {};
		this._client = client || {};
		this._delivery = delivery || {};
	}
	get id() {
		return this._orderData.id;
	}

	get status() {
		return this._orderData.statusId;
	}

	/**
	 * order products
	 * @returns {OrderProduct[]}
	 * @readonly
	 */
	get products() {
		return this._products;
	}

	/**
	 * order delivery
	 * @returns {Delivery}
	 * @readonly
	 */
	get delivery() {
		return this._delivery;
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

	/**
	 * order address
	 * @returns {Address}
	 * @readonly
	 */
	get address() {
		return this._orderData.address;
	}
	get paymentMethod() {
		return this._orderData.paymentMethodId;
	}

	get paymentLink() {
		return this._orderData.mpLink;
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