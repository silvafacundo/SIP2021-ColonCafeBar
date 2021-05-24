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
			//if delivery doesn't exists, display a error message
			if (!delivery){
				res.json({ message: 'There is no delivery with that id' });
			} else {
				await this.utils.deliveries.updateDelivery({ id, name, lastName, phoneNumber });
				return res.json({ message: 'Delivery successfully updated' });
			}
		} catch (error) {
			return super.error(res, error);
		}
	}
}