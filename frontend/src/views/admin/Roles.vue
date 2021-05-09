<template>
	<div>
		<h3>Roles</h3>
		<b-modal :active="selectedRole" @close="() => selectedRole = null">
			<div class="modal-card" style="margin: auto">
				<header class="modal-card-head">
					<p class="modal-card-title">Permisos del rol</p>
				</header>
				<section class="modal-card-body">
					<permission-list :permissions="permissions"
						:value="selectedRolePermissions"
						@change="changePermission" />
				</section>
			</div>
		</b-modal>
		<b-table :data="roles">
			<b-table-column v-slot="props" label="Id">
				{{ props.row.id }}
			</b-table-column>
			<b-table-column v-slot="props" label="Nombre">
				{{ props.row.name }}
			</b-table-column>
			<b-table-column v-slot="props" label="Description">
				{{ props.row.description }}
			</b-table-column>
			<b-table-column v-slot="props">
				<b-button @click="() => selectedRole = props.row"> Editar permisos</b-button>
			</b-table-column>
			<b-table-column v-slot="props">
				<b-button type="is-danger" @click="() => deleteRole(props.row.id)"> Eliminar </b-button>
			</b-table-column>
		</b-table>
		<form @submit.prevent="createRole">
			<label for="roleName">name:</label>
			<input id="roleName"
				v-model="newRoleName"
				type="text"
				name="roleName"
				required>
			<label for="roleDescription">descriotion: </label>
			<input id="roleDescription"
				v-model="newRoleDescription"
				name="roleDescription"
				type="text"
				required>
			<input type="submit" value="Crear">
		</form>
	</div>
</template>

<script>
import PermissionList from '../../components/admin/PermissionList.vue';
export default {
	name: 'Roles',
	components: {
		PermissionList
	},
	data: () => ({
		newRoleName: '',
		newRoleDescription: '',
		isLoading: false,
		selectedRole: null
	}),
	computed: {
		roles() {
			return this.$store.getters['User/roles'];
		},
		permissions() {
			return this.$store.getters['User/permissions'];
		},
		selectedRolePermissions() {
			if (!this.selectedRole) return [];
			return this.selectedRole.permissions.map(perm => perm.id);
		}
	},
	mounted() {
		this.fetchRoles();
	},
	methods: {
		async fetchRoles() {
			this.isLoading = true;
			try {
				await this.$store.dispatch('User/fetchRoles');
				await this.$store.dispatch('User/fetchPermissions');
			} catch (err) {
				//TODO: Mostrar que salió algo mas
			}
			this.isLoading = false;
		},
		async deleteRole(roleId) {
			try {
				await this.$store.dispatch('User/deleteRole', { roleId });
			} catch (err) {
				// TODO: Mostrar que algo salió mal
			}
		},
		async createRole() {
			this.isLoading = true;
			const name = this.newRoleName;
			const description = this.newRoleDescription;
			this.newRoleName = '';
			this.newRoleDescription= '';
			try {
				await this.$store.dispatch('User/createRole', { name, description })
			} catch (err) {
				// TODO: Mostrar el error piola
				alert('Algo salió mal');
			}
			this.isLoading = false;
		},
		async changePermission({ permissionId, value }) {
			if (!this.selectedRole) return;
			const roleId = this.selectedRole.id;
			try {
				if (value)
					await this.$store.dispatch('User/addPermissionToRole', { permissionId, roleId })
				else
					await this.$store.dispatch('User/removePermissionFromRole', { permissionId, roleId })
			} catch (err) {
				//TODO: Mostrar q salio mal
				alert('algo salió mal :c ');
			}
		}
	}
}
</script>

<style>

</style>