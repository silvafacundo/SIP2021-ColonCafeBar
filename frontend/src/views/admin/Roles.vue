<template>
	<div class="container">
		<h3>Roles</h3>
		<b-modal :active="!!selectedRole"
			has-modal-card
			@close="() => selectedRole = null">
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
			<b-table-column v-slot="props" label="#">
				{{ props.row.id }}
			</b-table-column>
			<b-table-column v-slot="props" label="Nombre">
				<EditableText
					:value="props.row.name"
					placeholder="Nombre"
					tag="label"
					type="text"
					:can-edit="true"
					@change="updateRole({ id: props.row.id, name: $event })" />
			</b-table-column>
			<b-table-column v-slot="props" label="Descripción">
				<EditableText
					:value="props.row.description"
					placeholder="Descripción"
					tag="label"
					type="text"
					:can-edit="true"
					@change="updateRole({ id: props.row.id, description: $event })" />
			</b-table-column>
			<b-table-column v-slot="props" label="Acciones">
				<b-button @click="() => selectedRole = props.row"> Editar permisos</b-button>
			</b-table-column>
			<b-table-column v-slot="props">
				<b-button type="is-danger" @click="() => deleteRole(props.row.id)"> Eliminar </b-button>
			</b-table-column>
		</b-table>
		<div class="newRole">
			<h3>Crear nuevo rol</h3>
			<form @submit.prevent="createRole">
				<label for="roleName">Nombre:</label>
				<input id="roleName"
					v-model="newRoleName"
					type="text"
					name="roleName"
					required>
				<label for="roleDescription">Descripción: </label>
				<input id="roleDescription"
					v-model="newRoleDescription"
					name="roleDescription"
					type="text"
					required>
				<input type="submit" value="Crear">
			</form>
		</div>
	</div>
</template>

<script>
import PermissionList from '../../components/admin/PermissionList.vue';
import EditableText from '../../components/EditableText';
export default {
	name: 'Roles',
	components: {
		PermissionList,
		EditableText,
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
				this.$showToast('Error al obtener los roles', true);
			}
			this.isLoading = false;
		},
		async deleteRole(roleId) {
			this.$buefy.dialog.confirm({
				title: 'Eliminar rol',
				message: '<b>¿Seguro que desea eliminar este rol?</b><br>Esta acción es irreversible',
				confirmText: 'Sí',
				cancelText: 'Cancelar',
				type: 'is-danger',
				hasIcon: true,
				onConfirm: () => this._deleteRole(roleId)
			});
		},
		async _deleteRole(roleId) {
			try {
				await this.$store.dispatch('User/deleteRole', { roleId });
			} catch (err) {
				this.$showToast('Error al eliminar el rol', true);
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
				this.$showToast('Error al crear el rol', true)
			}
			this.isLoading = false;
		},
		async updateRole({ id, name, description }) {
			try {
				await this.$store.dispatch('User/updateRole', { roleId: id, name, description });
			} catch (err) {
				this.$showToast('Error al modificar el rol', true);
			}
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
				this.$showToast('Error al cambiar los permisos del rol', true);
			}
		}
	}
}
</script>

<style scoped lang="scss">
.newRole{
	margin-top: 2em;
}

form{
	display: block;
	padding: 1em;
	background-color: var(--blanco);
	border-top: 2px solid var(--negro);
	border-radius: 5px;

	input[type=text] ,label{
		margin-left:1em;
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