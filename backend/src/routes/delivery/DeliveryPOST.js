const Route = require('../../models/Route');

module.exports = class DeliveryPOST extends Route {
	constructor() {
		super('/delivery/new', 'post');
	}

	async run(req, res) {
		const { name, lastName, phoneNumber } = req.body;
		// Check if body parameters are valid
		if (!name) return res.status(400).json({ message: 'name is required!' });
        if (!lastName) return res.status(400).json({ message: 'lastName is required!' });
        if (!phoneNumber) return res.status(400).json({ message: 'phoneNumber is required!' });

		try {
			// Insert into database
			await this.utils.deliveries.createDelivery({ name, lastName, phoneNumber });
			return res.json({ message: 'Delivery successfully created!' });
		} catch (error) {
			return super.error(res, error);
		}
	}
}