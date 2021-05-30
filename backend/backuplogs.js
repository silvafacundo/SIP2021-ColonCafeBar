const cron = require('node-cron');
const fs = require('fs');
const archiver = require('archiver');
const moment = require('moment');

const path = require('path')

console.log('[CRONJOB] Cronjob backup logs running');

const logsDir = path.join(__dirname, `./src/logs`);
cron.schedule('0 0 1 * *', () => {
	const fileName = `${moment().format('YYYY-MM')}.zip`;
	const output = fs.createWriteStream(path.join(__dirname, `./backups/logs/${fileName}`));
	const archive = archiver('zip');

	output.on('close', async function () {
		console.log(archive.pointer() + ' total bytes');
		console.log('Logs backup finalized');
		await clearLogs();
		console.log('Old Logs deleted');
	});

	archive.on('error', function (err) {
		throw err;
	});

	archive.pipe(output);
	archive.directory(logsDir, false);
	archive.finalize();
});

function clearLogs() {
	return new Promise((res, rej) => {
		return fs.readdir(logsDir, (err, files) => {
			if (err) return rej(err);
			for (const file of files) {
				fs.unlinkSync(path.join(logsDir, file));
			}
			return res();
		});
	})
}

