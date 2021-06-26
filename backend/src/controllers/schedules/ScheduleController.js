const PublicError = require('../../errors/PublicError');
module.exports = class ScheduleController {
	constructor(server) {
		this.server = server;
	}

	get db() {
		return this.server.db;
	}

	get utils() {
		return this.server.utils;
	}
	get models() {
		return this.server.models;
	}

	async createSchedule({ openingTime, closingTime, dayOfWeek }){
		//Check if parameters are valid
		if (!openingTime) throw new PublicError('openingTime is required');
		if (!closingTime) throw new PublicError('closingTime is required');
		if (!dayOfWeek && typeof dayOfWeek !== 'number' || ( dayOfWeek < 1 || dayOfWeek > 7))
			throw new PublicError('dayOfWeek is required and must be between 1 and 7');
		const schedule = await this.db('schedules').insert({
			openingTime,
			closingTime,
			dayOfWeek
		});
		return schedule;
	}

	//Get specific schedule
	async getSchedule({ id }){
		return await this.db('schedules')
			.where({ id })
			.select();
	}

	//Get all schedule loaded
	async getAllSchedules(){
		const schedules = await this.db('schedules')
			.orderBy('id', 'ASC')
			.select();
		return schedules;
	}

	//Delete specific Schedule
	async deleteSchedule({ id }){
		await this.db('schedules')
			.where({ id })
			.del();
		return (true);
	}

	//Update specific Schedule
	async updateSchedule({ id, openingTime, closingTime, dayOfWeek }){
		if (typeof id !== 'number' && !id) throw new PublicError('id is required');
		if (!dayOfWeek && typeof dayOfWeek !== 'number' || ( dayOfWeek < 1 || dayOfWeek > 7))
			throw new PublicError('dayOfWeek is required and must be between 1 and 7');
		const schedule = await this.getSchedule({ id });
		if (!schedule) throw new PublicError('Schedule doesn\'t exists');
		const toUpdate = {
			'openingTime': openingTime,
			'closingTime': closingTime,
			'dayOfWeek': dayOfWeek
		};
		await this.db('schedules')
			.where( { id } )
			.update(toUpdate);
		return schedule;
	}

}