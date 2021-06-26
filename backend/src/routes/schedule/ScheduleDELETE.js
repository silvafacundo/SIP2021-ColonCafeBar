const Route = require('../../models/Route');

module.exports = class ScheduleDELETE extends Route {
	constructor() {
		super('/admin/schedule', 'delete');
	}

	async run(req, res, user) {
		try {
			const { id } = req.query;
			// Check if body parameters are valid
			if (!id) return res.status(400).json({ message: 'id is required!' });
			const schedule = await this.utils.schedules.deleteSchedule({ id });
			return schedule? res.json('Schedule deleted successfully!'): res.json('Something was wrong!');
		} catch (error) {
			return super.error(res, error);
		}
	}
}