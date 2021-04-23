const Route = require('../../models/Route');

module.exports = class LoginPOST extends Route {
	constructor() {
		super('/auth/login', 'post');
	}

	async run(req, res) {
		const { email, password } = req.body;
		if (!email) return res.status(400).json({ message: 'email is required!' }); 
		if (!password) return res.status(400).json({ message: 'password is required!' }); 

		try {
			const user = await this.utils.users.getUser({ email });
			if (!user) return res.status(400).json({ message: 'User not registered' });
	
			const samePassword = await this.utils.users.compareHash(password, user.password);
			if (!samePassword) return res.status(401).json({ message: 'Invalid password' });
	
			const jwt = await this.utils.users.generateJWT(user);
			
			return res.json({ message: 'Successfully logged in', payload: jwt });
		} catch (error) {
			return super.error(res, error);
		}
	}
};
