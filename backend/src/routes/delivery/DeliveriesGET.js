const Route = require('../../models/Route');

module.exports = class DeliveriesGET extends Route {
	constructor() {
		super('/admin/deliveries', 'get');
	}

	async run(req, res) {
		// Check if body parameters are valid
		try {
			// Get all deliveries
			const deliveries = await this.utils.deliveries.getAllDeliveries();
			if (!deliveries){
				return res.json({ message: 'There are no loaded deliveries!' });
			} else {
				return res.json({ deliveries });
			}
		} catch (error) {
			return super.error(res, error);
		}
	}
}