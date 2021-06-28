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
		},
		{
			sequelize,
			tableName: 'deliveries',
			modelName: 'Delivery',
			paranoid: true,
			updatedAt: false
		}
	);

	return Delivery;
}