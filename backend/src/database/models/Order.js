const { Model } = require('sequelize');

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
			Order.belongsTo(models.OrderPaymentMethod, {
				foreignKey: 'paymentMethodId',
				as: 'orderPaymentMethod'
			});
		}
	}
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
			withDelivery: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			paymentMethod: {
				type: DataTypes.VIRTUAL,
				get() {
					if (!this.orderPaymentMethod) return 'Not Defined';
					return this.orderPaymentMethod.methodName;
				}
			},
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
					'orderStatus',
					'orderPaymentMethod'
				]
			},
			tableName: 'orders',
			modelName: 'Order',
			updatedAt: false
		}
	);

	return Order;
}