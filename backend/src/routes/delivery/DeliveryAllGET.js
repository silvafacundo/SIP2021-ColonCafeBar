const Route = require('../../models/Route');

module.exports = class DeliveryAllGET extends Route {
	constructor() {
		super('/delivery/getAll', 'get');
	}

	async run(req, res) {
		// Check if body parameters are valid
		try {
			// Get all deliveries
			const deliveries = await this.utils.deliveries.getAllDeliveries();
			if (!deliveries){
				return res.json({ message: 'There are no loaded deliveries!' });
			} else {
				return res.json(deliveries);
			}
		} catch (error) {
			return super.error(res, error);
		}
	}
}