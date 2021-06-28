const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class Permission extends Model {
		static associate(models) {
		}
	}
	Permission.init(
		{
			name: DataTypes.STRING,
			key: DataTypes.STRING
		},
		{
			sequelize,
			paranoid: true,
			tableName: 'permissions',
			modelName: 'Permission',
			updatedAt: false,
			createdAt: false
		}
	);
	return Permission;
}