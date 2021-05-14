const Route = require('../../models/Route');

module.exports = class PermissionsPUT extends Route {
	constructor() {
		super('admin/permissions/update', 'put');
	}

	async run(req, res) {
		const { permissionId, name, isActive } = req.body;
		// Check if body parameters are valid
		if (!permissionId) return res.status(400).json({ message: 'id is required!' });
		if (!name && typeof name !== 'string') return res.status(400).json({ message: 'name is required!' });
		if (!isActive && typeof isActive !== 'boolean') return res.status(400).json({ message: 'isActive is required!' });

		try {
			const permission = await this.utils.roles.getPermission({ permissionId });
			//if permission doesn't exists, display a error message
			if (!permission){
				res.json('There are no permission with that id!');
			} else {
				await this.utils.roles.updatePermission({ permissionId, name, isActive });
           		return res.json({ message: 'Permission successfully updated!' });
			}
		} catch (error) {
			return super.error(res, error);
		}
	}
}