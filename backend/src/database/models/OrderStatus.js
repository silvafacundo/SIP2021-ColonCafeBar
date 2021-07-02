
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class OrderStatus extends Model {
		static associate(models) {}
	}
	OrderStatus.init(
		{
			key: {
				type: DataTypes.STRING,
				required: true
			},
			statusName: {
				type: DataTypes.STRING,
				require: true
			},
			priorityService: {
				type: DataTypes.INTEGER
			},
			sortNumber: {
				type: DataTypes.INTEGER
			}
		},
		{
			sequelize,
			tableName: 'orderStatus',
			modelName: 'OrderStatus',
			updatedAt: false,
			createdAt: false
		}
	);

	return OrderStatus;
}