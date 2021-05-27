const Route = require('../../models/Route');

module.exports = class DeliveryPUT extends Route {
	constructor() {
		super('/admin/delivery', 'put');
	}

	async run(req, res) {
		const { id, name, lastName, phoneNumber } = req.body;
		// Check if body parameters are valid
		if (!id) return res.status(400).json({ message: 'id is required!' });

		try {
			const delivery = await this.utils.deliveries.getDelivery(id);
			if (!delivery) return res.status(400).json({ message: 'delivery not found!' });

			const toUpdate = {};
			if (name) toUpdate.name = name;
			if (lastName) toUpdate.lastName = lastName;
			if (phoneNumber) toUpdate.phoneNumber = phoneNumber;
			if (Object.keys(toUpdate).length === 0) return res.status(400).json({ message: 'At least one param is required!' });

			await this.utils.deliveries.updateDelivery({ id, name, lastName, phoneNumber });

			return res.json({ message: 'Delivery successfully updated' });
		} catch (error) {
			return super.error(res, error);
		}
	}
}