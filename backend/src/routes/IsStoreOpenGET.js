const Route = require('../models/Route');
module.exports = class IsStoreOpenGET extends Route {
	constructor() {
		super('/isopen', 'get', { isPublic: true });
	}
	async run(req, res, user) {
		const isOpen = await this.utils.schedules.isOpen();
		const schedules = await this.utils.schedules.getScheduleFromDay()
		return res.json({
			message: isOpen ? 'Está abierto! 🥳' : 'Está cerrado 😭',
			isOpen,
			schedules,
		})
	}
}