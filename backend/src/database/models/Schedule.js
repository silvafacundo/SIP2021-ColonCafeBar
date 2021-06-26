const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class Schedule extends Model {
	}
	Schedule.init(
		{
			openingTime: {
				type: DataTypes.TIME,
				required: true
			},
			closingTime: {
				type: DataTypes.TIME,
				required: true
			},
			dayOfWeek: {
				type: DataTypes.INTEGER,
				required: true
			}
		},
		{
			sequelize,
			tableName: 'schedules',
			modelName: 'Schedule',
			updatedAt: false
		}
	);

	return Schedule;
}