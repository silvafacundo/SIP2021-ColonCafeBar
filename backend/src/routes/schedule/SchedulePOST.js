const Route = require('../../models/Route');

module.exports = class SchedulePOST extends Route {
	constructor() {
		super('/admin/schedule', 'post', { permissions: 'schedule', isPublic: false });
	}

	async run(req, res, user) {
		const { openingTime, closingTime, dayOfWeek } = req.body;
		// Check if body parameters are valid
		if (!openingTime) return res.status(400).json({ message: 'openingTime is required!' });
		if (!closingTime) return res.status(400).json({ message: 'closingTime is required!' });
		if (!dayOfWeek) return res.status(400).json({ message: 'dayOfWeek is required!' });

		try {
			// Insert into database
			await this.utils.schedules.createSchedule({ openingTime, closingTime, dayOfWeek });
			return res.json({ message: 'Schedule successfully created!' });
		} catch (error) {
			return super.error(res, error);
		}
	}
}