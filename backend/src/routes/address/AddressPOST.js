const Route = require('../../models/Route');

module.exports = class AddressPOST extends Route {
	constructor() {
		super('/address', 'post', { isPublic: false });
	}

	async run(req, res, user) {
		const { street, number, city, neighborhood, corner, coordinates, floor, postalCode } = req.body;
		// Check if body parameters are valid

		try {
			// Insert into database
			const address = await this.utils.addresses.createAddress({
				clientId: user.id,
				street,
				number,
				floor,
				postalCode,
				neighborhood,
				corner,
				coordinates,
				city
			});

			return res.json({ message: 'Address successfully created!', address });
		} catch (error) {
			return super.error(res, error);
		}
	}
}