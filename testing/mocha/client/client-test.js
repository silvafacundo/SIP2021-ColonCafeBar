const assert = require('chai').assert;
const config = require('../../../backend/knexfile');
const knex = require('knex')(config);

const Server = require('../../../backend/src/Server');
const server = new Server();

let firstName = null;
let email = null;
let password = null;
let client = null;

describe('Client-test', () => {
	before(async () => {
		// initialize data base and connections
		await server.initializeDatabase();
		await server.initializeSequelize();
		await server.initializeControllers();
	})

	it('Creates a client', async () => {
		let clientsCount = await server.db('clients').select(server.db.raw('count(*)')).first();
		clientsCount = clientsCount.count;

		firstName = `Cliente${clientsCount}`;
		email = `client${clientsCount}@test.com`;
		password = `Hola123456`;

		client = await server.utils.clients.createClient({ email, password, firstName });
		assert.exists(client);
	})

	it('Checking Login/Hashing', async () => {
		// Checking hashing with the correct password
		const hashCompareTrue = await server.utils.auth.compareHash(password, client.password);
		assert.isTrue(hashCompareTrue);
		
		// Checking hashing with the incorrect password
		const hashCompareFalse = await server.utils.auth.compareHash('ContraseñaFalsa123', client.password);
		assert.isFalse(hashCompareFalse);
	})
	
	it('Updating Client', async () => {
		await server.utils.clients.updateClient({ clientId: client.id, phoneNumber: '654321987'});
		const updatedClient = await server.utils.clients.getClient({ userId: client.id });

		assert.equal('654321987', updatedClient.phoneNumber);
	})
	
	it('Deleting Client', async () => {
		await server.db('clients').where({ id: client.id }).del();
	})

});
