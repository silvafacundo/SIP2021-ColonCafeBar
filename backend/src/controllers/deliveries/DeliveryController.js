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
		const delivery = await this.db('deliveries').insert({ name, lastName, phoneNumber }).returning('*');
		return delivery;
	}

	//Get specific delivery
	async getDelivery(id, fetchDeleted = false){
		const whereQuery = { id };
		if (!fetchDeleted) whereQuery.isDeleted = false;

		const delivery = await this.db('deliveries')
			.where(whereQuery)
			.first();
		if (!delivery) return null;
		return delivery;
	}

	//Get all deliveries loaded
	async getAllDeliveries(fetchDeleted = false){
		const deliveries = await this.db('deliveries')
			.where(query => {
				if (!fetchDeleted)
					query.where({ isDeleted: false })
			})
			.select();
		return deliveries;
	}

	//Delete specific Delivery
	async deleteDelivery(id){
		await this.db('deliveries')
			.where({ id })
			.update({ isDeleted: true });
		return (true);
	}

	//Update specific Delivery
	async updateDelivery({ id, name, lastName, phoneNumber }){
		await this.db('deliveries')
			.where({ id, isDeleted: false })
			.update({
				name,
				lastName,
				phoneNumber
			});
		return (true);
	}
}