const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class OrderProducts extends Model {
		static associate(models) {
			OrderProducts.belongsTo(models.Order, {
				foreignKey: 'orderId',
				as: 'order'
			});

			OrderProducts.belongsTo(models.Product, {
				foreignKey: 'productId',
				as: 'product'
			});
		}
	}
	OrderProducts.init(
		{
			amount: {
				type: DataTypes.INTEGER,
				required: true,
				defaultValue: 1
			},
			price: {
				type: DataTypes.DECIMAL,
				required: true,
				defaultValue: 0
			},
			selectedVariants: {
				type: DataTypes.JSON,
				required: false,
				defaultValue: {}
			}
		},
		{
			sequelize,
			defaultScope: {
				include: ['product']
			},
			tableName: 'orderProducts',
			modelName: 'OrderProduct',
			updatedAt: false,
			createdAt: false,
		}
	);

	return OrderProducts;
}