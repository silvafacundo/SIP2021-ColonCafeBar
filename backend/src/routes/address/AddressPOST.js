const Route = require('../../models/Route');

module.exports = class AddressPOST extends Route {
	constructor() {
		super('/address', 'post');
	}

	async run(req, res) {
		const { userId, street, number, floor, postalCode } = req.body;
		if (!userId) return res.status(400).json({ message: 'userId is required!' });
		if (!street) return res.status(400).json({ message: 'street is required!' });
		if (!number) return res.status(400).json({ message: 'number is required!' });
		if (!postalCode) return res.status(400).json({ message: 'postalCode is required!' });

		try {
			await this.utils.addresses.createAddress({
				userId,
				street,
				number,
				floor,
				postalCode,
			});

			return res.json({ message: 'Address successfully created!' });
		} catch (error) {
			return super.error(res, error);
		}
	}
}