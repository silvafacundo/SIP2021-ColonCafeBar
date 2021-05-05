const express = require('express');
const jetpack = require('fs-jetpack');
const path = require('path');

const cors = require('cors');

require('dotenv').config();

// Controllers
const UserController = require('./controllers/users/UserController');
const AddressController = require('./controllers/addresses/AddressController');
const CategoryController = require('./controllers/categories/CategoryController');
const RoleController = require('./controllers/roles/RoleController');
const ProductController = require('./controllers/products/ProductController');
const DeliveryController = require('./controllers/deliveries/DeliveryController');
const ClientController = require('./controllers/clients/ClientsController');
const AuthController = require('./controllers/auth/AuthController');

module.exports = class Server {
	constructor() {
		this.webserver = express();
		this.db = null;
		this.utils = {};
	}

	get port() {
		return process.env.PORT || 3000;
	}

	async initialize() {
		await this.initializeDatabase();
		await this.initializeControllers();
		await this.initializeWebServer();
	}

	/**
	 * Initializes WebServer
	 *
	 */
	async initializeWebServer() {
		// Accept JSON as requests
		this.webserver.use(express.json());
		this.webserver.use(cors());

		// Serve Static files
		this.webserver.use('/static', express.static('public'));

		// Api Routes
		jetpack.find(`${__dirname}/routes`, { matching: '*.js' }).forEach(routeFile => {
			const Route = require(path.join('..', routeFile));
			const route = new Route();
			if (typeof route.initialize === 'function') {
				route.initialize(this.db, this);
			}
			let routePath = route.path.replace(/^\//, '');
			routePath = `/api/${routePath}`;
			this.webserver[route.method](routePath, route.auth.bind(route));
		});
		this.webserver.all('/api/*', this.handleUnknownEndpoint.bind(this));

		// Serve index
		this.webserver.get('*', (req, res) => res.sendFile(path.resolve('public/index.html')));

		// Listen to port
		this.webserver.listen(process.env.PORT, () => {
			console.log(`[WEBSERVER] Running on ${process.env.PORT}`);
		});
	}

	handleUnknownEndpoint(req, res) {
		return res.status(400).json({ message: 'Route not found' });
	}

	/**
	 * Initializes database
	 *
	 */
	async initializeDatabase() {
		const config = require('../knexfile');
		const knex = require('knex')(config);

		this.db = knex;
		await this.db('users').first();
	}

	async initializeControllers() {
		this.utils = {
			auth: new AuthController(this),
			users: new UserController(this),
			addresses: new AddressController(this),
			roles: new RoleController(this),
			categories: new CategoryController(this),
			products: new ProductController(this),
			deliveries: new DeliveryController(this),
			clients: new ClientController(this)
		}
	}
};
