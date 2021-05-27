const Route = require('../../models/Route');

module.exports = class DeliveriesGET extends Route {
	constructor() {
		super('/admin/deliveries', 'get');
	}

	async run(req, res, user) {
		try {
			// Get all deliveries
			const deliveries = await this.utils.deliveries.getAllDeliveries();

			return res.json({
				message: 'Deliveries Sucessfully retrieved!',
				payload: deliveries
			});
		} catch (error) {
			return super.error(res, error);
		}
	}
}