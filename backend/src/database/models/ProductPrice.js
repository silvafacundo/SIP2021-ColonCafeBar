const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class ProductPrice extends Model {
		static associate(models) {
			ProductPrice.belongsTo(models.Product, {
				foreignKey: 'productId',
				as: 'product'
			})
		}
	}
	ProductPrice.init(
		{
			price: {
				type: DataTypes.FLOAT
			}
		},
		{
			sequelize,
			tableName: 'productPrices',
			modelName: 'ProductPrice',
			updatedAt: false
		}
	)

	return ProductPrice;
}