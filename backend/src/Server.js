const express = require('express');
const jetpack = require('fs-jetpack');
const path = require('path');
require('dotenv').config();

module.exports = class Server {
	constructor() {
		this.webserver = express();
		this.db = null;
	}

	get port() {
		return process.env.PORT || 3000;
	}

	async initialize() {
		await this.initializeDatabase();
		await this.initializeWebServer();
	}

	/**
	 * Initializes WebServer
	 *
	 */
	async initializeWebServer() {
		// Accept JSON as requests
		this.webserver.use(express.json());

		// Serve Static files
		this.webserver.use('/static', express.static('public'));

		// Api Routes
		jetpack.find(`${__dirname}/routes`, { matching: '*.js' }).forEach(routeFile => {
			const Route = require(path.join('..', routeFile));
			const route = new Route();
			if (typeof route.initialize === 'function') {
				route.initialize(this.db);
			}
			let routePath = route.path.replace(/^\//, '');
			routePath = `/api/${routePath}`;
			this.webserver[route.method](routePath, route.auth.bind(route));
		});

		// Serve index
		this.webserver.get('*', (req, res) => res.sendFile(path.resolve('public/index.html')));

		// Listen to port
		this.webserver.listen(process.env.PORT, () => {
			console.log(`[WEBSERVER] Running on ${process.env.PORT}`);
		});
	}

	/**
	 * Initializes database
	 *
	 */
	async initializeDatabase() {
		const config = require('../knexfile');
		const knex = require('knex')(config);

		this.db = knex;
		const test = await this.db('users').first();
	}
};
