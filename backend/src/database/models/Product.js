const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class Product extends Model {
		static associate(models) {
			Product.belongsTo(models.Category, {
				foreignKey: 'idCategory',
				as: 'category'
			});
			Product.belongsTo(models.ProductPrice, {
				foreignKey: 'priceId',
				as: 'priceData'
			});
			Product.belongsTo(models.ProductPoints, {
				foreignKey: 'pointsId',
				as: 'pointsData'
			});
		}
	}
	Product.init(
		{
			name: {
				type: DataTypes.STRING,
				required: true
			},
			description: {
				type: DataTypes.STRING,
				required: true
			},
			price: {
				type: DataTypes.VIRTUAL,
				get() {
					if (!this.priceData) return -1;
					return this.priceData.price;
				}
			},
			pointsPrice: {
				type: DataTypes.VIRTUAL,
				get() {
					if (!this.pointsData) return -1;
					return this.pointsData.price;
				}
			},
			grantablePoints: {
				type: DataTypes.VIRTUAL,
				get() {
					if (!this.pointsData) return -1;
					return this.pointsData.grant;
				}
			},
			variants: DataTypes.JSON,
			imageUrl: DataTypes.STRING,
			isActive: DataTypes.BOOLEAN
		},
		{
			sequelize,
			defaultScope: {
				include: [
					'category',
					'priceData',
					'pointsData'
				]
			},
			tableName: 'products',
			modelName: 'Product',
			updatedAt: false
		}
	);

	return Product;
}