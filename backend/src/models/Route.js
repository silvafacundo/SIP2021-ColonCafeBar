const JWT = require('jsonwebtoken');

class Route {
	constructor(path, method, config) {
		this.path = path;
		this._method = method;

		const isAdmin = !!path.match(/^\/admin/);

		// Force to be a private route
		if (config && typeof config === 'object' && isAdmin) config.isPublic = false;

		this.config = {
			isPublic: !isAdmin,
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

	initialize(db, server) {
		this.db = db;
		this.server = server;
	}

	async auth(req, res) {
		if (this.config.isPublic) return await this.run(req, res);
		const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
		if (!token) return res.status(401).json({ message: 'No authorization header provided' });
		try {
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
				user = await this.utils.client.getClient({ userId: id });
			if (!user) return res.status(401).json({ message: 'Invalid authorization token' });

			// TODO: Validate iat

			return await this.run(req, res, user);
		} catch (err) {
			console.error('Failed to run endpoint', err);
			return res.status(500).json({ message: 'Unexpected error' });
		}
	}

	error(res, error) {
		console.error(error);
		return res.status(500).json({ message: 'Something went wrong' });
	}

	// eslint-disable-next-line no-unused-vars
	run(req, res, db, user) {
		// Overload!!
		return null;
	}
}

module.exports = Route;
