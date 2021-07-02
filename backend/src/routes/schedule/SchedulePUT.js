const Route = require('../../models/Route');

module.exports = class SchedulePUT extends Route {
	constructor() {
		super('/admin/schedule', 'put', { permissions: 'schedule', isPublic: false });
	}

	async run(req, res, user) {
		const { id, openingTime, closingTime, dayOfWeek } = req.body;
		// Check if body parameters are valid
		if (!id) return res.status(400).json({ message: 'id is required!' });
		if (!openingTime) return res.status(400).json({ message: 'openingTime is required!' });
		if (!closingTime) return res.status(400).json({ message: 'closingTime is required!' });
		if (!dayOfWeek) return res.status(400).json({ message: 'dayOfWeek is required!' });

		try {
			// Insert into database
			await this.utils.schedules.updateSchedule({ id, openingTime, closingTime, dayOfWeek });
			return res.json({ message: 'Schedule successfully updated!' });
		} catch (error) {
			return super.error(res, error);
		}
	}
}