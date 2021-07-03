const Route = require('../../models/Route');

module.exports = class MostSoldProductsGET extends Route {
	constructor() {
		super('/mostSoldProducts', 'get', { isPublic: true });
	}

	async run(req, res, user) {
		try {
			const toDate = new Date();
			let fromDate = new Date();
			fromDate.setDate(fromDate.getDate() - 7);
			const options = { fromDate, toDate };
			const products = await this.utils.report.mostSelledProducts(options);

			return res.json({
				message: 'Products successfully retrieved!',
				products
			});
		} catch (error) {
			return super.error(res, error);
		}
	}
}