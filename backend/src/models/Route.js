const JWT = require('jsonwebtoken');

class Route {
	constructor(path, method, config) {
		this.path = path;
		this._method = method;
		this.config = {
			isPublic: true,
			...config
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

			const user = await this.utils.users.getUser({ userId: id });
			if (!user) return res.status(401).json({ message: 'Invalid authorization token' });

			// TODO: Validate iat

			await this.run(req, res, user);
		} catch (err) {
			console.error('Failed to run endpoint', err);
			return res.status(500).json({ message: 'Unexpected error' });
		}
		return this.run(req, res);
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
