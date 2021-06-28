const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class Category extends Model {
	}
	Category.init(
		{
			name: {
				type: DataTypes.STRING,
				required: true
			},
		},
		{
			sequelize,
			paranoid: true,
			tableName: 'categories',
			modelName: 'Category',
			updatedAt: false
		}
	);

	return Category;
}