const Server = require('../Server');
const { Op } = require('sequelize');

module.exports = {
	schedulePattern: '*/5 * * * * *',

	/**
	 *
	 *
	 * @param {Server} server
	 */
	run: async server => {
		try {
			if (!server) throw Error('No Server was passed');

			const actualDate = new Date();

			const pendingStatus = await server.utils.orders.getOrderStatus({ key: 'pending' });
			const cancelledStatus = await server.utils.orders.getOrderStatus({ key: 'cancelled' });
			const { orderTimeoutMinutes } = await server.utils.store.getStoreConfig();

			actualDate.setMinutes(actualDate.getMinutes() - orderTimeoutMinutes);

			const orders = await server.db('orders')
				.where('statusId', pendingStatus.id)
				.where('createdAt', '<=', actualDate);

			for (const order of orders) {
				await server.utils.orders.updateOrder({ orderId: order.id, statusId: cancelledStatus.id });
			}

			if (orders.length > 0) console.log(`${orders.length} orders cancelled due to inactivity`);

		} catch (error) {
			console.error('Cancel Order cronjob failed');
			console.error(error);
		}
	}
}