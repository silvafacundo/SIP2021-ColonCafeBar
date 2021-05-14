module.exports = class DeliveryController {
	constructor(server) {
		this.server = server;
	}

	get db() {
		return this.server.db;
	}

	get utils() {
		return this.server.utils;
	}

	async createDelivery({ name, lastName, phoneNumber }){
		//Check if parameters are valid
		if (!name && typeof name !=='string') throw Error('name is required');
		if (!lastName && typeof lastName !=='string') throw Error('last name is required');
		if (!phoneNumber && typeof phoneNumber !=='string') throw Error('phone number is required');
		const Delivery = await this.db('deliveries').insert({ name, lastName, phoneNumber });
		return Delivery;
	}

	//Get specific delivery
	async getDelivery(id){
		const Delivery = await this.db('deliveries')
			.where({ id })
			.first();
		return Delivery;
	}

	//Get all deliveries loaded
	async getAllDeliveries(){
		const deliveries = await this.db('deliveries')
			.select();
		return deliveries;
	}

	//Delete specific Delivery
	async deleteDelivery(id){
		await this.db('deliveries')
			.where({ id })
			.del();
		return (true);
	}

	//Update specific Delivery
	async updateDelivery({ id, name, lastName, phoneNumber }){
		await this.db('deliveries')
			.where({ id })
			.update({
				name,
				lastName,
				phoneNumber
			});
		return (true);
	}
}