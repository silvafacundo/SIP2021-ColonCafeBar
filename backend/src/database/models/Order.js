const { Model, Transaction } = require('sequelize');
const Server = require('../../Server');

module.exports = (sequelize, DataTypes) => {
	class Order extends Model {
		static associate(models) {
			Order.belongsTo(models.Client, {
				foreignKey: 'clientId',
				as: 'client'
			});
			Order.belongsTo(models.Delivery, {
				foreignKey: 'deliveryId',
				as: 'delivery'
			});
			Order.belongsTo(models.Address, {
				foreignKey: 'addressId',
				as: 'address'
			});
			Order.hasMany(models.OrderProduct, {
				foreignKey: 'orderId',
				as: 'products',
			});
			Order.belongsTo(models.OrderStatus, {
				foreignKey: 'statusId',
				as: 'orderStatus'
			});
		}

		/**
		 *
		 *
		 * @static
		 * @param {Server} server
		 * @memberof Order
		 */
		static bindings(server) {
			/** @type {Server} */
			Order.prototype.server = server
		}
	}
	Order.prototype._paymentLink = null;
	Order.init(
		{
			status: {
				type: DataTypes.VIRTUAL,
				get() {
					if (!this.orderStatus) return 'Pending';
					return this.orderStatus.statusName;
				}
			},
			isPaid: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			refunded: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			withDelivery: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			deliveryPrice: {
				type: DataTypes.FLOAT,
			},
			paymentMethod: {
				type: DataTypes.STRING,
			},
			paymentLink: {
				type: DataTypes.VIRTUAL,
				get() {
					return this._paymentLink;
				},
				set(val) {
					return this._paymentLink = val;
				}
			},
			total: {
				type: DataTypes.VIRTUAL,
				get() {
					return this.products.reduce((prev, product) => prev + product.price * product.amount, 0);
				}
			}
		},
		{
			sequelize,
			defaultScope: {
				include: [
					'client',
					{
						required: false,
						association: 'delivery'
					},
					{
						required: false,
						association: 'address'
					},
					'products',
					'orderStatus'
				]
			},
			tableName: 'orders',
			modelName: 'Order',
			updatedAt: false
		}
	);

	Order.addHook('afterSave', async (order, option) => {
		if (!order.orderStatus) return;
		const oldStatusKey = order.orderStatus.key;
		await order.reload();
		const newStatusKey = order.orderStatus.key;

		if (oldStatusKey !== 'cancelled' && newStatusKey === 'cancelled') {
			await order.server.utils.orders.refundOrder(order.id);
		}
	})

	return Order;
}