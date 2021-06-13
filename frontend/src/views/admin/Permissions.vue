<template>
	<div class="container">
		<h3>Permisos</h3>
		<b-table :data="permissions">
			<b-table-column v-slot="props" label="#">
				{{ props.row.id }}
			</b-table-column>
			<b-table-column v-slot="props" label="Permiso">
				{{ props.row.key }}
			</b-table-column>
			<b-table-column v-slot="props" label="Descripción">
				<EditableText
					:value="props.row.name"
					placeholder="Descripción"
					tag="label"
					type="text"
					:can-edit="true"
					@change="updatePermission({ id: props.row.id, name: $event })" />
				<!--{{ props.row.name }}-->
			</b-table-column>
			<b-table-column v-slot="props">
				<b-button type="is-danger" @click="() => deletePermission(props.row.id)"> Eliminar </b-button>
			</b-table-column>
		</b-table>
		<div class="newPermission">
			<h3>Agregar nuevo permiso</h3>
			<form @submit.prevent="createPermission">
				<label for="permissionKey"> Permiso: </label>
				<input id="permissionKey"
					v-model="newPermissionKey"
					type="text"
					name="permissionKey">
				<label for="permissionName"> Descripción: </label>
				<input id="permissionName"
					v-model="newPermissionName"
					name="permissionName"
					type="text">
				<input type="submit" value="Crear">
			</form>
		</div>
	</div>
</template>

<script>
import EditableText from '../../components/EditableText';
export default {
	name: 'Permissions',
	components: {
		EditableText,
	},
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
				this.$showToast('Error al intentar obtener los permisos', true);
			}
			this.isLoading = false;
		},
		async deletePermission(permissionId) {
			this.$buefy.dialog.confirm({
				title: 'Eliminar Permiso',
				message: '<b>¿Seguro que desea eliminar este permiso?</b><br>Esta acción es irreversible',
				confirmText: 'Sí',
				cancelText: 'Cancelar',
				type: 'is-danger',
				hasIcon: true,
				onConfirm: () => this._deletePermission(permissionId)
			});
		},
		async _deletePermission(permissionId) {
			try {
				await this.$store.dispatch('User/deletePermission', { permissionId })
			} catch (err) {
				this.$showToast('Error al eliminar el permiso', true);
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
				this.$showToast('Error al crear el permiso', true);
			}
			this.isLoading = false;
		},
		async updatePermission({ id, name }) {
			try {
				await this.$store.dispatch('User/updatePermission', { permissionId: id, name })
			} catch (err) {
				this.$showToast('Error al editar el permiso', true);
			}
		}
	}
}
</script>

<style scoped lang="scss">
	.newPermission{
		margin-top:2em;
	}

	form{
		padding: 1em;
		background-color: var(--blanco);
		border-top: 2px solid var(--negro);
		border-radius: 5px;
		gap:3em;

		input[type=text] ,label{
			margin-left: 1em;
		}

		input[type=submit]{
			margin-left: 2em;
			padding:.2em 1.5em;
			background-color: var(--verde-ok);
			border-radius:5px;
			color:var(--blanco);
			font-size: 1em;
		}

		input[type=submit]:hover{
			background-color:var(--verde-oscuro);
			cursor:pointer;
		}
	}

	@media (max-width: 900px){
		div.container{
			padding: 0;
			width: 95%;
		}
	}
</style>