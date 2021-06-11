const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);

module.exports = server => {
	const models = {};
	fs.readdirSync(__dirname)
		.filter(file => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
		.forEach(file => {
			const model = require(path.join(__dirname, file))(server.sequelize, Sequelize.DataTypes);
			models[model.name] = model;
		});

	for (const name in models) {
		const model = models[name];
		if (typeof model.associate === 'function') model.associate(models);
		if (typeof model.bindings === 'function') model.bindings(server);
	}

	return models;
}