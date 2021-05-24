const Route = require('../../models/Route');

module.exports = class AddressPOST extends Route {
	constructor() {
		super('/address', 'post', { isPublic: false });
	}

	async run(req, res, user) {
		const { street, number, floor, postalCode } = req.body;
		// Check if body parameters are valid
		if (!street) return res.status(400).json({ message: 'street is required!' });
		if (!number) return res.status(400).json({ message: 'number is required!' });
		if (!postalCode) return res.status(400).json({ message: 'postalCode is required!' });

		try {
			// Insert into database
			const address = await this.utils.addresses.createAddress({
				clientId: user.id,
				street,
				number,
				floor,
				postalCode,
			});

			return res.json({ message: 'Address successfully created!', address });
		} catch (error) {
			return super.error(res, error);
		}
	}
}