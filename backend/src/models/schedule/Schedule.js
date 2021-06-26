const BaseModel = require('../BaseModel');


module.exports = class Schedule extends BaseModel{
	constructor(server, openingTime, closingTime, dayOfWeek, firebaseToken) {
		super(server);
		if (typeof dayOfWeek !== 'number' || dayOfWeek < 1 || dayOfWeek > 7) {
			throw new Error('dayOfWeek expected a number between 1 and 7');
		}
		this._openingTime = openingTime;
		this._closingTime = closingTime;
		this._dayOfWeek = dayOfWeek;
		this._firebaseToken = firebaseToken || '';
	}
	get id() {
		return this._schedule.id;
	}
	get openingTime() {
		return this._schedule.openingTime;
	}
	get closingTime() {
		return this._schedule.closingTime;
	}
	get dayOfWeek() {
		return this._schedule.dayOfWeek;
	}
	get createdAt() {
		return this._schedule.createdAt;
	}
	get firebaseToken() {
		return this._firebaseToken;
	}
}