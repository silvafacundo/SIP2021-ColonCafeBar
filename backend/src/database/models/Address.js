const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class Address extends Model {
		static associate(models) {
			Address.belongsTo(models.Client, {
				foreignKey: 'clientId',
				as: 'client',
			});
		}
	}
	Address.init(
		{
			alias: {
				type: DataTypes.STRING,
			},
			corner: {
				type: DataTypes.STRING,
				required: true
			},
			street: {
				type: DataTypes.STRING,
				required: true
			},
			coordinates: {
				type: DataTypes.STRING,
				required: false
			},
			city: {
				type: DataTypes.STRING,
				required: true
			},
			neighborhood: {
				type: DataTypes.STRING,
				required: true
			},
			number: {
				type: DataTypes.STRING,
				required: true
			},
			floor: DataTypes.STRING,
			postalCode: DataTypes.STRING,
		},
		{
			sequelize,
			paranoid: true,
			tableName: 'addresses',
			modelName: 'Address',
			updatedAt: false
		}
	);

	return Address;
}