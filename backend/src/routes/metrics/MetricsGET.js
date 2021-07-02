const Route = require('../../models/Route');

module.exports = class MetricsGET extends Route {
	constructor() {
		super('/admin/metrics', 'post', { permissions: 'metrics', isPublic: false });
	}

	async run(req, res, user) {
		const { fromDate, toDate } = req.body;
		const options = { fromDate, toDate };
		try {
			const totalSells = await this.utils.report.totalSells(options);
			const mostSelledProducts = await this.utils.report.mostSelledProducts(options);
			const amountOfOrdersByTypeOfDelivery = await this.utils.report.amountOfOrdersByTypeOfDelivery(options);
			const amountOfOrdersByTypeOfPayment = await this.utils.report.amountOfOrdersByTypeOfPayment(options);
			const customers = await this.utils.report.customersWhoMadeTheMostPurchases(options);
			const avgSalesPerDayOfTheWeek = await this.utils.report.avgSalesPerDayOfTheWeek(options);

			return res.json({
				message: 'Metrics successfully retrieved',
				metrics: {
					totalSells,
					mostSelledProducts,
					amountOfOrdersByTypeOfDelivery,
					amountOfOrdersByTypeOfPayment,
					customers,
					avgSalesPerDayOfTheWeek
				}
			})
		} catch (err) {
			return super.error(res, err);
		}
	}
}