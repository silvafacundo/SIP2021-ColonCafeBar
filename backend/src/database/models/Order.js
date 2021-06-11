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
			})
		}
	}
	Order.init(
		{
			status: {
				type: DataTypes.STRING,
				required: true
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
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
		},
		{
			sequelize,
			defaultScope: [
				'client',
				'delivery',
				'address',
				'products'
			],
			tableName: 'orders',
			modelName: 'Order',
			updatedAt: false
		}
	);

	return Order;
}