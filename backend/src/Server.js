const express = require('express');
const logger = require('./utils/logger');
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
const OrderController = require('./controllers/order/OrderController');
const MercadoPagoController = require('./controllers/MercadoPago/MercadoPagoController');
const MailController = require('./controllers/mail/MailController');
const Sequelize = require('sequelize');

module.exports = class Server {
	constructor() {
		this.webserver = express();
		this.db = null;
		this.utils = {};
		this.models = {};
		this.sequelize = null;
	}

	get port() {
		return process.env.PORT || 3000;
	}

	async initialize() {
		const jobNum = process.env.JOB_NUMBER || -1;
		const sha = process.env.COMMIT_SHA || 'null';
		console.log('Starting server...');
		console.log(`COMMIT SHA: ${sha}\nJOB NUMBER: ${jobNum}`);
		await this.initializeDatabase();
		await this.initializeSequelize();
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
		this.webserver.use('/', express.static('public'));

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
		// RUN MIGRATIONS
		const migrationMode = process.env.DATABASE_MIGRATE || 'false';
		const runMigration = process.env.NODE_ENV === 'production' || migrationMode !== 'false';

		if (runMigration) {
			console.log(`[DB] Running Migrations (${migrationMode})...`);
			if (process.env.NODE_ENV === 'development' && migrationMode === 'wipe-latest') {
				console.log('[DB] Rollingback...');
				await this.db.migrate.rollback();
				console.log('[DB] Rollback done.');
			}

			console.log('[DB] Migrating...');
			await this.db.migrate.latest();
			console.log('[DB] Migrations done.');
			try {
				// TODO: Maybe delete this
				console.log('[DB] Trying seeds...');
				await this.db.seed.run();
				console.log('[DB] Seeds done.');
			} catch (err) {
				console.warn('[DB] Seeds failed');
			}
		}
		// await this.db('users').first();
	}

	async initializeSequelize() {
		console.log(`[Sequelize] initializing sequelize`);
		const sequelize = new Sequelize({
			dialect: 'postgres',
			host: process.env.DATABASE_HOST,
			port: process.env.DATABASE_PORT,
			username: process.env.DATABASE_USER,
			password: process.env.DATABASE_PASSWORD,
			database: process.env.DATABASE_DB,
			logging: false
		});
		await sequelize.authenticate();
		console.log(`[Sequelize] sequelize initialized`)
		console.log(`[Sequelize] Initializing models...`)
		this.sequelize = sequelize;
		const models = require('./database/models')(this);
		this.models = models;
		console.log(`[Sequelize] models initialized`)
	}

	async initializeControllers() {
		const firebase = require('firebase-admin');
		/**
		* Server Utils
		*
		* @typedef {object} Utils
		* @property {AuthController} Utils.auth
		* @property {UserController} Utils.users
		* @property {ClientController} Utils.clients
		* @property {AddressController} Utils.addresses
		* @property {RoleController} Utils.roles
		* @property {CategoryController} Utils.categories
		* @property {ProductController} Utils.products
		* @property {DeliveryController} Utils.deliveries
		* @property {ClientController} Utils.clients
		* @property {OrderController} Utils.orders
		* @property {MercadoPagoController} Utils.mercadopago
		* @property {MailController} Utils.mailController
		* @property {firebase} Utils.firebase
		*/

		/** @type {Utils} Server Utils */
		this.utils = {
			auth: new AuthController(this),
			users: new UserController(this),
			addresses: new AddressController(this),
			roles: new RoleController(this),
			categories: new CategoryController(this),
			products: new ProductController(this),
			deliveries: new DeliveryController(this),
			clients: new ClientController(this),
			orders: new OrderController(this),
			logger: logger,
			mercadopago: new MercadoPagoController(this),
			mailController: new MailController(this),
			firebase
		}
		try {
			this.initializeFirebase();
		} catch (err) {
			console.warn('[DB] Failed to initialize Firebase \n', err);
		}

		logger.info('Server running');
		const admins = await this.db('users').where({ isAdmin: true }).first();
	}
	initializeFirebase() {
		const serviceAccount = {
			'type': 'service_account',
			'project_id': process.env.FIREBASE_PID,
			'private_key_id': process.env.FIREBASE_PKID,
			'private_key': (process.env.FIREBASE_PK || '').replace(/\\n/g, '\n'),
			'client_email': process.env.FIREBASE_EMAIL,
			'client_id': process.env.FIREBASE_CID,
			'auth_uri': 'https://accounts.google.com/o/oauth2/auth',
			'token_uri': 'https://oauth2.googleapis.com/token',
			'auth_provider_x509_cert_url': process.env.FIREBASE_AUTHCERT,
			'client_x509_cert_url': process.env.FIREBASE_CLIENTCER
		};

		this.utils.firebase.initializeApp({
			credential: this.utils.firebase.credential.cert(serviceAccount)
		});
	}

	seed(){
		console.log('[Knex seed] - Running seed');
		console.log('[Knex seed] - Creating categories');

		//create categories
		this.utils.categories.createCategory({ name: 'Categoria 1' });
		this.utils.categories.createCategory({ name: 'Categoria 2' });
		this.utils.categories.createCategory({ name: 'Categoria 3' });

		console.log('[Knex seed] - Creating products');
		//create products
		this.utils.products.createProduct({ idCategory: 1, name: 'Producto 1', imageUrl: ''
			, description: 'Descripcion producto 1', price: 100, variants: {}, pointsPrice: 100, grantablePoints: 100 });
		this.utils.products.createProduct({ idCategory: 1, name: 'Producto 2', imageUrl: ''
			, description: 'Descripcion producto 2', price: 100, variants: {}, pointsPrice: 100, grantablePoints: 100 });
		this.utils.products.createProduct({ idCategory: 1, name: 'Producto 3', imageUrl: ''
			, description: 'Descripcion producto 3', price: 100, variants: {}, pointsPrice: 100, grantablePoints: 100 });
		this.utils.products.createProduct({ idCategory: 2, name: 'Producto 4', imageUrl: ''
			, description: 'Descripcion producto 4', price: 100, variants: {}, pointsPrice: 100, grantablePoints: 100 });
		this.utils.products.createProduct({ idCategory: 2, name: 'Producto 5', imageUrl: ''
			, description: 'Descripcion producto 5', price: 100, variants: {}, pointsPrice: 100, grantablePoints: 100 });
		this.utils.products.createProduct({ idCategory: 2, name: 'Producto 6', imageUrl: ''
			, description: 'Descripcion producto 6', price: 100, variants: {}, pointsPrice: 100, grantablePoints: 100 });
		this.utils.products.createProduct({ idCategory: 3, name: 'Producto 7', imageUrl: ''
			, description: 'Descripcion producto 7', price: 100, variants: {}, pointsPrice: 100, grantablePoints: 100 });
		this.utils.products.createProduct({ idCategory: 3, name: 'Producto 8', imageUrl: ''
			, description: 'Descripcion producto 8', price: 100, variants: {}, pointsPrice: 100, grantablePoints: 100 });
		this.utils.products.createProduct({ idCategory: 3, name: 'Producto 9', imageUrl: ''
			, description: 'Descripcion producto 9', price: 100, variants: {}, pointsPrice: 100, grantablePoints: 100 });

		console.log('[Knex seed] - Seed run successfully');
	}
};
