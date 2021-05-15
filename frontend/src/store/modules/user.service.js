import Vue from 'vue';
import router from '../../router';



const initialState = () => ({
	users: [],
	roles: [],
	permissions: [],
});

const state = initialState();

const getters = {
	users: state => state.users,
	roles: state => state.roles,
	permissions: state => state.permissions
};
const mutations = {
	RESET(state, payload) {
		const defaultValues = initialState();
		for (const key in state) {
			state[key] = defaultValues[key];
		}
	},
	setUsers(state, payload) {
		state.users = [...payload];
	},
	setRoles(state, payload) {
		state.roles = [...payload];
	},
	setPermissions(state, payload) {
		state.permissions = [...payload];
	}
};
const actions = {
	RESET({ commit }) {
		commit('RESET');
	},
	async fetchUsers({ commit }) {
		try {
			const response = await Vue.axios.get('/admin/users');
			if (response.data.users)
				commit('setUsers', response.data.users);
		} catch (err) {
			console.error('Failed to fetch users', err);
			throw err;
		}
	},
	async updateUser({ dispatch }, { userId, isActive, name }) {
		try {
			const response = await Vue.axios.post(`/admin/user/${userId}`, {
				isActive,
				name
			});
			await dispatch('fetchUsers');
		} catch (err) {
			console.error('Failed to change update user', err);
			throw err;
		}
	},
	async generateResetPasswordToken(_, { userId }) {
		try {
			const response = await Vue.axios.get('/admin/user/reset', { params: { userId } });
			return response.data;
		} catch (err) {
			console.error('Failed to generate token', err);
			throw err;
		}
	},
	async addRoleToUser({ dispatch }, { userId, roleId }) {
		try {
			const reponse = await Vue.axios.put('/admin/role/user', { roleId, userId });
			await dispatch('fetchUsers');
		} catch (err) {
			console.error('Failed to add role to user', err);
			throw err;
		}
	},
	async deleteRoleFromUser({ dispatch }, { userId, roleId }) {
		try {
			const reponse = await Vue.axios.delete('/admin/role/user', {
				params: { roleId, userId }
			});
			await dispatch('fetchUsers');
		} catch (err) {
			console.error('Failed to add role to user', err);
			throw err;
		}
	},
	async fetchRoles({ commit }) {
		try {
			const response = await Vue.axios.get('/admin/roles');
			const { roles } = response.data;
			commit('setRoles', roles);
			return roles;
		} catch (err) {
			console.error('Failed to fetch roles', err);
			throw err;
		}
	},
	async createRole({ dispatch }, { description, name }) {
		try {
			const response = await Vue.axios.post('/admin/role', {
				description,
				name
			});
			await dispatch('fetchRoles');
			return response.data.role;
		} catch (err) {
			console.error('Failed to create role:', err);
			throw err;
		}
	},
	async updateRole({ dispatch }, { roleId, name, description }) {
		try {
			await Vue.axios.put('/admin/role', { roleId, name, description });
			await dispatch('fetchRoles')
		} catch (err) {
			console.error('Failed to update role: ', err);
			throw err;
		}
	},
	async addPermissionToRole({ dispatch }, { roleId, permissionId }) {
		try {
			await Vue.axios.put('/admin/permission/role', { roleId, permissionId });
			await dispatch('fetchRoles');
		} catch (err) {
			console.error('Failed to add permission to role:', err);
			throw err;
		}
	},
	async removePermissionFromRole({ dispatch }, { roleId, permissionId }) {
		try {
			await Vue.axios.delete('/admin/permission/role', {
				params: { roleId, permissionId }
			});
			await dispatch('fetchRoles');
		} catch (err) {
			console.error('Failed to add permission to role:', err);
			throw err;
		}
	},
	async deleteRole({ dispatch }, { roleId }) {
		try {
			const response = await Vue.axios.delete('/admin/role', {
				params: { roleId }
			});
			await dispatch('fetchRoles');
		} catch (err) {
			console.error('Failed to delete role', err);
			throw err;
		}
	},
	async fetchPermissions({ commit }) {
		try {
			const response = await Vue.axios.get('/admin/permissions');
			const { permissions } = response.data;
			commit('setPermissions', permissions);
			return permissions;
		} catch (err) {
			console.error('Failed to fetch permissions', err);
			throw err;
		}
	},
	async createPermission({ dispatch }, { key, name }) {
		try {
			const response = await Vue.axios.post('/admin/permissions', {
				key,
				name
			});
			await dispatch('fetchPermissions');
			return response.data.permission
		} catch (err) {
			console.error('Failed to create permission:', err);
			throw err;
		}
	},
	async updatePermission({ dispatch }, { permissionId, name }) {
		try {
			await Vue.axios.put('/admin/permissions/update', { permissionId, name });
			await dispatch('fetchPermissions');
		} catch (err) {
			console.error('Failed to update permission:', err);
			throw err;
		}
	},
	async deletePermission({ dispatch }, { permissionId }) {
		try {
			const response = await Vue.axios.delete('/admin/permissions', {
				params: { permissionId }
			});
			await dispatch('fetchPermissions');
		} catch (err) {
			console.error('Failed to delete permission:', err);
			throw err;
		}
	}
};


export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions
}