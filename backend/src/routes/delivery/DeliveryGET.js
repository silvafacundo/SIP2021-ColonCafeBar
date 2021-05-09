const Route = require('../../models/Route');

module.exports = class DeliveryGET extends Route {
	constructor() {
		super('/delivery/get', 'get');
	}

	async run(req, res) {
		const { id } = req.query;
		// Check if body parameters are valid
		if (!id) return res.status(400).json({ message: 'id is required to get a delivery!' });
		try {
			// Get a delivery
			const delivery = await this.utils.deliveries.getDelivery(id);
			if (!delivery){
				return res.json({ message: 'There are no delivery with that id!' });
			} else {
				return res.json(delivery);
			}
		} catch (error) {
			return super.error(res, error);
		}
	}
}