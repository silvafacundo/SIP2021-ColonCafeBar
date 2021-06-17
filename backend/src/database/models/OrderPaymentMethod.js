
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class OrderPaymentMethod extends Model {
		static associate(models) {}
	}
	OrderPaymentMethod.init(
		{
			methodName: {
				type: DataTypes.STRING,
				require: true
			}
		},
		{
			sequelize,
			tableName: 'orderPaymentMethods',
			modelName: 'OrderPaymentMethod',
			updatedAt: false,
			createdAt: false
		}
	);

	return OrderPaymentMethod;
}