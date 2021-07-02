const PublicError = require('../../errors/PublicError');
const Server = require('../../Server');

const { Op } = require('sequelize');
module.exports = class ClientController {
	/**
	 *Creates an instance of ClientController.
	 * @param {Server} server
	 */
	constructor(server) {
		this.server = server;
	}

	get db() {
		return this.server.db;
	}

	get models() {
		return this.server.models;
	}

	get utils() {
		return this.server.utils;
	}

	async createClient({ email, password, firstName, lastName, phoneNumber }) {
		if (!email) throw new PublicError('email is required!');
		if (!password) throw new PublicError('password is required!');
		if (!firstName) throw new PublicError('email is required!');

		const { status, message } = this.utils.auth.isSafePassword(password);
		if (!status) throw new PublicError(message);

		if (lastName && typeof lastName !== 'string') throw new PublicError('lastName must be a string!');
		if (phoneNumber && typeof phoneNumber !== 'string') throw new PublicError('phoneNumber must be a string!');

		const hash = await this.utils.auth.encryptPassword(password);

		const user = await this.models.Client.create({
			email,
			password: hash,
			firstName,
			lastName,
			phoneNumber
		})
		return user;
	}

	async getClient({ userId, email, onlyPublic = true }) {
		const where = {};
		if (typeof userId !== 'undefined' && userId !== null) where.id = userId;
		if (typeof email !== 'undefined' && email !== null) where.email = email;

		if (Object.keys(where).length <= 0) throw new Error('At least one parameter is required');

		const scopes = ['defaultScope'];
		if (!onlyPublic) scopes.push('sensitive');

		const user = await this.models.Client.scope(scopes).findOne({
			where,
		});
		return user;
	}

	async updateClient({ clientId, email, firstName, lastName, phoneNumber, password, isActive }) {
		if (!clientId) throw Error('clientId is required!');

		const client = await this.getClient({ userId: clientId });
		if (!client) throw Error('client not found!');

		if (password) {
			const { status, message } = this.utils.auth.isSafePassword(password);
			if (!status) throw new Error(message);
		}

		const toUpdate = {};
		if (email) toUpdate.email = email;
		if (firstName) toUpdate.firstName = firstName;
		if (lastName) toUpdate.lastName = lastName;
		if (phoneNumber) toUpdate.phoneNumber = phoneNumber;
		if (password) toUpdate.password = await this.utils.auth.encryptPassword(password);
		if (password) toUpdate.sessionValidDate = new Date();
		if (typeof isActive === 'boolean') toUpdate.isActive = isActive;

		if (Object.keys(toUpdate).length < 1) throw new PublicError('At least one param is required!');

		for (const key in toUpdate) {
			client[key] = toUpdate[key];
		}
		await client.save();
		return client;
	}

	async invalidateTokens(clientId) {
		const client = await this.getClient({ userId: clientId });
		if (!client) throw new PublicError('Client doesn\'t exists');

		client.sessionValidDate = new Date();
		await client.save();
	}

	async getClients({ page = 1, perPage = 20, filters = {}, orderBy = {} } = {}) {
		if (isNaN(page)) throw new PublicError('page should be a number');
		if (isNaN(perPage)) throw new PublicError('perPage should be a number');

		const order = [];
		order.push(['createdAt', orderBy.createdAt === 'asc' ? 'ASC' : 'DESC']);

		const Sequelize = this.server.sequelize.Sequelize;

		let { query } = filters;
		const whereAnd = [];
		if (query) {
			query = `%${query.toLowerCase()}%`;
			whereAnd.push({
				[Op.or]: [
					{ 'email': { [Op.iLike]: query } },
					{ 'phoneNumber': { [Op.iLike]: query } },
					Sequelize.where(Sequelize.literal(`"firstName" || ' ' ||"lastName"`), { [Op.iLike]: query })
				]
			});
		}
		const { count: total, rows: clients } = await this.models.Client.findAndCountAll({
			where: {
				[Op.and]: whereAnd
			},
			order,
			offset: (page - 1) * perPage,
			limit: perPage
		});

		return { clients, pagination: { page, perPage, total } };
	}

	async addPoints(clientId, pointsToAdd) {
		const client = await this.getClient({ userId: Number(clientId) });
		client.availablePoints = client.availablePoints + Number(pointsToAdd);
		await client.save();
	}

	async discountPoints(clientId, pointsToDiscount) {
		const client = await this.getClient({ userId: clientId });
		client.availablePoints = client.availablePoints - pointsToDiscount;
		await client.save();
	}

	async setPoints(clientId, points) {
		const client = await this.getClient({ userId: clientId });
		if (!client) throw new PublicError('Client doesn\'t exists');
		if (typeof points !== 'number' || isNaN(points) || points < 0 || points % 1 !== 0) throw new PublicError('points should be a positive integer');
		client.availablePoints = Number(points);
		await client.save();
	}

	async getClientHashPassword(userId) {
		const client = await this.db('clients').where('id', userId).first();
		return client.password;
	}

	async getClientLogin({ email, password }) {
		const user = await this.db('clients').where({ email, password }).first();
		return user;
	}
};