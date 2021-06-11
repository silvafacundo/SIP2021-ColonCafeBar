const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class Delivery extends Model {
	}
	Delivery.init(
		{
			name: {
				type: DataTypes.STRING,
				required: true
			},
			lastName: {
				type: DataTypes.STRING,
				required: true
			},
			phoneNumber: {
				type: DataTypes.STRING,
				required: true
			},
			isDeleted: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			}
		},
		{
			sequelize,
			tableName: 'deliveries',
			modelName: 'Delivery',
			updatedAt: false
		}
	);

	return Delivery;
}