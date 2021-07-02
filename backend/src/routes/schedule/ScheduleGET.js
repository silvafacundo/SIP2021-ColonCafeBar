const Route = require('../../models/Route');

module.exports = class ScheduleGET extends Route {
	constructor() {
		super('/admin/schedule', 'get', { permissions: 'schedule', isPublic: false });
	}

	async run(req, res, user) {
		const { id } = req.query;
		// Check if body parameters are valid
		if (!id) return res.status(400).json({ message: 'id is required!' });

		try {
			const schedule = await this.utils.schedules.getSchedule({ id });
			return res.json(schedule);
		} catch (error) {
			return super.error(res, error);
		}
	}
}