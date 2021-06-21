const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class ProductPoints extends Model {
		static associate(models) {
			ProductPoints.belongsTo(models.Product, {
				foreignKey: 'productId',
				as: 'product'
			})
		}
	}
	ProductPoints.init(
		{
			price: {
				type: DataTypes.INTEGER,
				required: true
			},
			grant: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
				required: true
			}
		},
		{
			sequelize,
			tableName: 'productPoints',
			modelName: 'ProductPoints',
			updatedAt: false
		}
	)

	return ProductPoints;
}