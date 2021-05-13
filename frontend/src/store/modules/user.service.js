import Vue from 'vue';
import router from '../../router';

const state = () => ({
	users: [],
	roles: [],
	permissions: [],
});

const getters = {
	users: state => state.users,
	roles: state => state.roles,
	permissions: state => state.permissions
};
const mutations = {
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