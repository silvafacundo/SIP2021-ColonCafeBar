<template>
	<div class="container">
		<h3>Usuarios</h3>
		<b-table :data="users">
			<b-table-column v-slot="props" label="#">
				{{ props.row.id }}
			</b-table-column>
			<b-table-column v-slot="props" label="Usuario">
				{{ props.row.username }}
			</b-table-column>
			<b-table-column v-slot="props" label="Nombre">
				{{ props.row.name }}
			</b-table-column>
			<b-table-column v-slot="props" label="Roles">
				<UserRoles :value="props.row.roles"
					:roles="roles"
					@add="role => addRole(props.row.id, role)"
					@remove="role => removeRole(props.row.id, role)" />
			</b-table-column>
			<b-table-column v-slot="props" label="Root">
				<b-checkbox :value="props.row.isAdmin" disabled />
			</b-table-column>
			<b-table-column v-slot="props" label="Habilitado">
				<b-checkbox :native-value="props.row.isActive || props.row.isAdmin"
					:value="props.row.isActive || props.row.isAdmin"
					:disabled="props.row.isAdmin"
					@click.native.prevent="() => !props.row.isAdmin && changeActive(props.row.id, !props.row.isActive)" />
			</b-table-column>
		</b-table>
		<b-button
			label="Crear usuario"
			type="is-success"
			size="default"
			class="register-button"
			@click="() => registerModalActive = true" />
		<b-modal v-model="registerModalActive" has-modal-card>
			<div class="modal-card" style="margin: auto">
				<header class="modal-card-head">
					<p class="modal-card-title">Registrar Usuario</p>
				</header>
				<section class="modal-card-body">
					<form @submit.prevent="register">
						<b-field label="Username">
							<b-input v-model="username"
								type="text"
								placeholder="Username" />
						</b-field>
						<b-field label="Nombre">
							<b-input v-model="name"
								type="text"
								placeholder="Nombre" />
						</b-field>
						<b-field label="Contraseña">
							<b-input v-model="password"
								type="password"
								placeholder="Contraseña" />
						</b-field>
						<p class="error my-1 has-text-centered">{{ error && 'Error: ' + error }}</p>
						<button>Crear usuario</button>
					</form>
				</section>
			</div>
		</b-modal>
	</div>
</template>

<script>
import UserRoles from '../../components/admin/UserRoles';
export default {
	components: {
		UserRoles
	},
	data() {
		return {
			registerModalActive: false,
			username: '',
			name: '',
			password: '',
			error: '',
		}
	},
	computed: {
		users() {
			return this.$store.getters['User/users'];
		},
		roles() {
			return this.$store.getters['User/roles'];
		}
	},
	mounted() {
		this.fetchUsers();
	},
	methods: {
		async fetchUsers() {
			this.isLoading = true;
			try {
				await this.$store.dispatch('User/fetchUsers');
				await this.$store.dispatch('User/fetchRoles');
			} catch (err) {
				this.$showToast('Error al cargar los usuarios', true);
			}
			this.isLoading = false;
		},
		async addRole(userId, role) {
			try {
				const roleId = role.id;
				await this.$store.dispatch('User/addRoleToUser', { roleId, userId })
			} catch (err) {
				this.$showToast(`Error al agregar el rol ${role.name} al usuario.`, true);
			}
		},
		async changeActive(userId, value) {
			if (value) return this._changeActive(userId, value);
			this.$buefy.dialog.confirm({
				title: 'Deshabilitado un usuario',
				message: '<b>¿Seguro que desea deshabilitar a este usuario?</b><br>Al deshabilitar el usuario este perderá acceso el acceso',
				confirmText: 'Sí',
				cancelText: 'Cancelar',
				type: 'is-danger',
				hasIcon: true,
				onConfirm: () => this._changeActive(userId, value),
				onCancel: () => this.fetchUsers()
			});
		},
		async _changeActive(userId, value) {
			try {
				await this.$store.dispatch('User/updateUser', { userId, isActive: value });
			} catch (err) {
				this.$showToast('Error al cambiar el estado del usuario', true);
			}
		},
		async removeRole(userId, role) {
			try {
				const roleId = role.id;
				await this.$store.dispatch('User/deleteRoleFromUser', { roleId, userId })
			} catch (err) {
				this.$showToast('Error al eliminar el rol del usuario', true);
			}
		},
		async register() {
			this.error = '';
			try {
				await this.$store.dispatch('Auth/registerAdmin', { username: this.username, name: this.name, password: this.password });
				this.registerModalActive = false;
				await this.fetchUsers();

				// RESET FIELDS
				this.username = '';
				this.name = '';
				this.password = '';
			} catch (err) {
				console.error('Failed to register', err);
				if (err && err.response && err.response.data) this.error = err.response.data.message;
				else this.error = 'Ocurrió un error';
			}
		}
	}
}
</script>

<style scoped lang="scss">
.register-button {
	display: flex;
	margin-left: auto;
	margin-top: .5rem;
}
.error{
	color:#ea2a3d;
}
.modal-card{
	border-radius:5px;
}

.modal-card-body form {
	display: flex;
	flex-direction: column;
}

.modal-card-body > form > input{
	border:none;
	border-bottom: 1px solid #ea2a3d;
	background-color: var(--blanco);
	user-select: none;
}
.modal-card-body > form > button{
	background-color: #ea2a3d;
	text-transform: uppercase;
	color:var(--blanco);
	margin-top: 1em;
	border-radius: 8px;
}

.modal-card-body > form > button:hover{
	cursor:pointer;
	background-color: #c0392b;
}
.modal-card-body > a{
	color: #3498db;
}
.modal-card-body > form > input, form > button{
	display:block;
	padding:1em;
}

</style>