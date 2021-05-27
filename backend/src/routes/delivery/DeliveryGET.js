const Route = require('../../models/Route');

module.exports = class DeliveryGET extends Route {
	constructor() {
		super('/admin/delivery', 'get');
	}

	async run(req, res) {
		const { id } = req.query;
		// Check if body parameters are valid
		if (!id) return res.status(400).json({ message: 'id is required to get a delivery!' });

		try {
			// Get a delivery
			const delivery = await this.utils.deliveries.getDelivery(id);
			if (!delivery) return res.status(400).json({ message: 'Delivery not found!' });

			return res.json({
				messsage: 'Delivery Sucessfully retrieved!',
				payload: delivery
			});
		} catch (error) {
			return super.error(res, error);
		}
	}
}