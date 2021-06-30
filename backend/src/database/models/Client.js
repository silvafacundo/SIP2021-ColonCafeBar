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
			password: DataTypes.STRING,
			sessionValidDate: DataTypes.DATE,
			isActive: {
				type: DataTypes.BOOLEAN,
				default: true
			},
			availablePoints: DataTypes.INTEGER
		},
		{
			sequelize,
			defaultScope: {
				attributes: { exclude: 'password' },
				include: [{
					required: false,
					association: 'addresses'
				}]
			},
			scopes: {
				sensitive: {
					attributes: { include: 'password' }
				}
			},
			tableName: 'clients',
			modelName: 'Client',
			updatedAt: false
		}
	);

	return Client;
}