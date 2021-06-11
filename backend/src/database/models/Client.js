const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class Client extends Model {
		static associate(models) {
			Client.hasMany(models.Address, {
				foreignKey: 'clientId',
				as: 'addresses',
			});
			Client.hasMany(models.Order, {
				foreignKey: 'clientId',
				as: 'orders'
			})
		}
	}
	Client.init(
		{
			email: DataTypes.STRING,
			firstName: DataTypes.STRING,
			lastName: DataTypes.STRING,
			phoneNumber: DataTypes.STRING,
			isActive: {
				type: DataTypes.BOOLEAN,
				default: true
			},
		},
		{
			sequelize,
			defaultScope: {
				include: ['addresses']
			},
			tableName: 'clients',
			modelName: 'Client',
			updatedAt: false
		}
	);

	return Client;
}