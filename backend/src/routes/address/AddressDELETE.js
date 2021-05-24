const Route = require('../../models/Route');

module.exports = class AddressDELETE extends Route {
	constructor() {
		super('/address', 'delete', { isPublic: false });
	}

	async run(req, res, user) {
		const { addressId } = req.query;

		try {
			// Insert into database
			if (! await this.utils.addresses.isAddressFromClient(addressId, user.id)) return res.status(400).json({ message: 'Invalid addressId' });

			await this.utils.addresses.deleteAddress(addressId);
			return res.json({ message: 'Address successfully deleted!' });
		} catch (error) {
			return super.error(res, error);
		}
	}
}