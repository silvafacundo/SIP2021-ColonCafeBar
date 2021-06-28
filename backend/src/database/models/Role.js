const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class Role extends Model {
		static associate(models) {
			Role.belongsToMany(models.Permission, {
				through: 'permissionsRoles',
				otherKey: 'permissionId',
				foreignKey: 'roleId',
				// targetKey: 'roleId',
				as: 'permissions'
			})
		}
	}
	Role.init(
		{
			name: DataTypes.STRING,
			description: DataTypes.STRING
		},
		{
			sequelize,
			defaultScope: {
				include: [
					{
						association: 'permissions',
						required: false
					}
				]
			},
			paranoid: true,
			tableName: 'roles',
			modelName: 'Role',
			updatedAt: false,
		}
	);
	return Role;
}