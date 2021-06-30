const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		static associate(models) {
			User.belongsToMany(models.Role, {
				through: 'usersRoles',
				foreignKey: 'userId',
				otherKey: 'roleId',
				as: 'roles'
			})
		}
	}
	User.init(
		{
			username: {
				type: DataTypes.STRING,
				required: true
			},
			name: {
				type: DataTypes.STRING,
				required: true
			},
			password: DataTypes.STRING,
			isAdmin: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			isActive: {
				type: DataTypes.BOOLEAN,
				defaultValue: true
			},
			sessionValidDate: DataTypes.DATE,
			firebaseToken: {
				type: DataTypes.VIRTUAL,
				get() {
					return this._firebaseToken;
				},
				set(val) {
					return this._firebaseToken = val;
				}
			}
		},
		{
			sequelize,
			defaultScope: {
				attributes: { exclude: 'password' },
				include: [{
					required: false,
					association: 'roles'
				}]
			},
			scopes: {
				sensitive: {
					attributes: { include: 'password' }
				}
			},
			paranoid: true,
			tableName: 'users',
			modelName: 'User',
			updatedAt: false
		}
	);

	return User;
}