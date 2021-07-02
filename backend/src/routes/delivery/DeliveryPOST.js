const Route = require('../../models/Route');

module.exports = class DeliveryPOST extends Route {
	constructor() {
		super('/admin/delivery', 'post', { permissions: 'deliveries', isPublic: false });
	}

	async run(req, res) {
		const { name, lastName, phoneNumber } = req.body;
		// Check if body parameters are valid
		if (!name) return res.status(400).json({ message: 'El nombre es obligatorio!' });
		if (!lastName) return res.status(400).json({ message: 'El apellido es obligatorio!' });
		if (!phoneNumber) return res.status(400).json({ message: 'El número de teléfono es obligatorio!' });

		// Insert into database
		const delivery = await this.utils.deliveries.createDelivery({ name, lastName, phoneNumber });
		return res.json({ message: 'Delivery successfully created!', delivery });
	}
}