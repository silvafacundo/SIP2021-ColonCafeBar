const Route = require('../../models/Route');

module.exports = class SchedulesGET extends Route {
	constructor() {
		super('/admin/schedules', 'get');
	}

	async run(req, res, user) {
		try {
			const schedule = await this.utils.schedules.getAllSchedules();
			return res.json(schedule);
		} catch (error) {
			return super.error(res, error);
		}
	}
}