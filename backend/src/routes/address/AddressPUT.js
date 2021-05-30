const Route = require('../../models/Route');

module.exports = class AddressPOST extends Route {
	constructor() {
		super('/address', 'put', { isPublic: false });
	}

	async run(req, res, user) {
		const { addressId, alias, street, number, city, neighborhood, corner, coordinates, floor, postalCode } = req.body;
		// Check if body parameters are valid

		try {
			// Insert into database
			const address = await this.utils.addresses.updateAddress({
				addressId,
				alias,
				street,
				number,
				floor,
				postalCode,
				neighborhood,
				corner,
				coordinates,
				city
			});

			return res.json({ message: 'Address successfully updated!', address });
		} catch (error) {
			return super.error(res, error);
		}
	}
}