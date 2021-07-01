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

		if (!this.timesAreValid(openingTime, closingTime)) throw new PublicError('Closing time should be grater than the opening time');

		if (!dayOfWeek && typeof dayOfWeek !== 'number' || ( dayOfWeek < 1 || dayOfWeek > 7))
			throw new PublicError('dayOfWeek is required and must be between 1 and 7');

		const isInside = await this.insideTime(dayOfWeek, openingTime, closingTime);
		if (isInside) throw new PublicError('El horario está colisionando con uno ya existente');

		const schedule = await this.db('schedules').insert({
			openingTime,
			closingTime,
			dayOfWeek
		});
		return schedule;
	}

	timesAreValid(openingTime, closingTime) {
		function toMinutes(time) {
			const [hs, mins] = time.split(':').map(val => Number(val));
			return (hs * 60) + mins;
		}
		return toMinutes(openingTime) < toMinutes(closingTime);
	}

	//Get specific schedule
	async getSchedule({ id }){
		return await this.db('schedules')
			.where({ id })
			.first();
	}

	//Get all schedule loaded
	async getAllSchedules(){
		const schedules = await this.db('schedules')
			.orderBy([
				{ column: 'dayOfWeek' },
				{ column: 'openingTime' }
			])
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
			...schedule,
			'openingTime': openingTime,
			'closingTime': closingTime,
			'dayOfWeek': dayOfWeek
		};
		if (!this.timesAreValid(toUpdate.openingTime, toUpdate.closingTime)) throw new PublicError('Closing time should be grater than the opening time');

		const isInside = await this.insideTime(toUpdate.dayOfWeek, toUpdate.openingTime, toUpdate.closingTime, id);
		if (isInside) throw new PublicError('El horario está colisionando con uno ya existente');

		await this.db('schedules')
			.where( { id } )
			.update(toUpdate);
		return schedule;
	}


	async insideTime(dayOfWeek, time, time2, ignoreId) {
		function whereTime(_time) {
			return builder => builder.where('openingTime', '<=', _time)
				.where('closingTime', '>=', _time);
		}
		let query = this.db('schedules')
			.where({ dayOfWeek })
			.where(builder => {
				builder.where(whereTime(time));
				if (time2) builder.orWhere(whereTime(time2));
			});

		if (ignoreId)
			query = query.where('id', '<>', ignoreId)


		const result = await query.first();
		return !!result
	}

}