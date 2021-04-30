const Route = require('../../models/Route');

module.exports = class DeliveryDELETE extends Route {
	constructor() {
		super('/delivery/delete', 'delete');
	}

	async run(req, res) {
		const { id } = req.query;
		// Check if body parameters are valid
		if (!id) return res.status(400).json({ message: 'id is required to delete a delivery!' });
		try {
			// Delete into database
			const delivery = await this.utils.deliveries.getDelivery(id);
			if (!delivery){
				return res.json({ message: 'There are no delivery with that id!' });
			} else {
				await this.utils.deliveries.deleteDelivery(id);
				return res.json({ message: 'delivery successfully deleted!' });
			}
		} catch (error) {
			return super.error(res, error);
		}
	}
}