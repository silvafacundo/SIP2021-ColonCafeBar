const JWT = require('jsonwebtoken');
const Server = require('../Server');

class Route {
	constructor(path, method, config) {
		this.path = path;
		this._method = method;

		const isAdmin = !!path.match(/^\/admin/);

		// Force to be a private route
		if (config && typeof config === 'object' && isAdmin) config.isPublic = false;


		this.config = {
			isPublic: false,
			...config,
			isAdminRoute: isAdmin,
		};
	}

	get method() {
		return this._method.toLowerCase();
	}

	get utils() {
		return this.server.utils;
	}

	/**
	 *
	 *
	 * @param {*} db
	 * @param {Server} server
	 * @memberof Route
	 */
	initialize(db, server) {
		this.db = db;
		this.server = server;
	}

	async auth(req, res) {
		try {
			if (this.config.isPublic) return await this.run(req, res);
			const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
			if (!token) return res.status(401).json({ message: 'No authorization header provided' });
			const decoded = JWT.verify(token, process.env.JWT_SECRET);

			const id = decoded ? decoded.sub : '';
			const iat = decoded ? decoded.iat : '';

			const isAdmin = decoded && decoded.isAdmin;

			if ((!isAdmin && this.config.isAdminRoute) || (isAdmin && !this.config.isAdminRoute))
				return res.status(401).json({ message: 'Invalid authorization token' });

			let user = null;
			if (this.config.isAdminRoute)
				user = await this.utils.users.getUser({ userId: id });
			else
				user = await this.utils.clients.getClient({ userId: id });
			if (!user) return res.status(401).json({ message: 'Invalid authorization token' });
			delete user.password;

			let isExpired = isAdmin && (Date.now() - iat) > (30 * 24 * 60 * 60 * 1000) // 30 días
			if ((user.sessionValidDate && new Date(user.sessionValidDate) > iat) || isExpired){
				return res.status(401).json({ message: 'Token expired' });
			}

			// Checks permission
			if (typeof this.config.permissions === 'string') {
				const permissions = this.config.permissions.split(' ');
				const hasPermission = await this.utils.roles.checkUserPermission(user.id, permissions);
				if (!hasPermission) return res.status(403).json({ message: 'You dont hace access to this resource' });
			}
			return await this.run(req, res, user);
		} catch (err) {
			this.error(res, err);
		}
	}

	error(res, err) {
		if (err.isPublic) {
			return res.status(err.code).json({ message: err.message });
		}

		console.error('Failed to run endpoint', err);
		return res.status(500).json({ message: 'Unexpected error' });
	}

	// eslint-disable-next-line no-unused-vars
	run(req, res, db, user) {
		// Overload!!
		return null;
	}
}

module.exports = Route;
