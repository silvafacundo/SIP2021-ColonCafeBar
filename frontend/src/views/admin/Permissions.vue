<template>
	<div>
		<h3>Permisos</h3>
		<b-table :data="permissions">
			<b-table-column v-slot="props" label="id">
				{{ props.row.id }}
			</b-table-column>
			<b-table-column v-slot="props" label="key">
				{{ props.row.key }}
			</b-table-column>
			<b-table-column v-slot="props" label="name">
				{{ props.row.name }}
			</b-table-column>
			<b-table-column v-slot="props">
				<b-button type="is-danger" @click="() => deletePermission(props.row.id)"> Eliminar </b-button>
			</b-table-column>
		</b-table>
		<form @submit.prevent="createPermission">
			<label for="permissionKey">Key:</label>
			<input id="permissionKey"
				v-model="newPermissionKey"
				type="text"
				name="permissionKey">
			<label for="permissionName"> NAME: </label>
			<input id="permissionName"
				v-model="newPermissionName"
				name="permissionName"
				type="text">
			<input type="submit" value="Crear">
		</form>
	</div>
</template>

<script>
export default {
	name: 'Permissions',
	data: () => ({
		newPermissionKey: '',
		newPermissionName: '',
		isLoading: false
	}),
	computed: {
		permissions() {
			return this.$store.getters['User/permissions'];
		}
	},
	mounted() {
		this.fetchPermissions();
	},
	methods: {
		async fetchPermissions() {
			this.isLoading = true;
			try {
				await this.$store.dispatch('User/fetchPermissions');
			} catch (err) {
				// TODO: hacer que diga que salió mal algo
			}
			this.isLoading = false;
		},
		async deletePermission(permissionId) {
			try {
				await this.$store.dispatch('User/deletePermission', { permissionId })
			} catch (err) {
				alert('Salió mal');
				// TODO: Mostrar que salió algo mal
			}
		},
		async createPermission() {
			this.isLoading = true;
			const key = this.newPermissionKey;
			const name = this.newPermissionName;
			this.newPermissionKey = '';
			this.newPermissionName = '';
			try {
				await this.$store.dispatch('User/createPermission', { key, name })
			} catch (err) {
				// TODO: Mostrar el error piola
				alert('Algo salió mal');
			}
			this.isLoading = false;
		}
	}
}
</script>

<style>

</style>