
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
				type: DataTypes.VIRTUAL,
				get() {
					switch (this.key) {
						case 'pending':
							return 10;
						case 'awaitingPreparation':
							return 9;
						case 'inPreparation':
							return 8
						default:
							return 7
					}
				}
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