require('winston-daily-rotate-file');
const winston = require('winston');
const format = winston.format;
const fileRotate = new winston.transports.DailyRotateFile({
	filename: `${__dirname}/../logs/%DATE%.log`,
	datePattern: 'YYYY-MM-DD',
	maxSize: '20m'
});

module.exports = winston.createLogger({
	format: format.combine(format.simple(),
		format.timestamp(),
		format.printf(info=>`[${info.timestamp}] [${info.level}]  ${info.message}`)),
	transports: [
		fileRotate
	]
});

