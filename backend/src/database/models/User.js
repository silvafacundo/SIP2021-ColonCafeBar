const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		static associate(models) {
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
			isAdmin: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			isActive: {
				type: DataTypes.BOOLEAN,
				defaultValue: true
			}
		},
		{
			sequelize,
			tableName: 'users',
			modelName: 'User',
			updatedAt: false
		}
	);

	return User;
}