<template>
	<div class="container">
		<h3>Usuarios</h3>
		<ul>
			<li v-for="(user, index) of users" :key="index">
				<User :user="user" />
			</li>
		</ul>
		<b-button
			label="Crear usuario"
			type="is-danger"
			size="is-small"
			class="register-button"
			@click="registerModalActive = true" />
		<b-modal :active="registerModalActive" @close="() => registerModalActive = false">
			<div class="modal-card" style="margin: auto">
				<header class="modal-card-head">
					<p class="modal-card-title">Registrar Usuario</p>
				</header>
				<section class="modal-card-body">
					<form @submit.prevent="register">
						<input v-model="username"
							type="text"
							placeholder="Username">
						<br>
						<input v-model="name"
							type="text"
							placeholder="Nombre">
						<br>
						<input v-model="password"
							type="password"
							placeholder="Contraseña">
						<br>
						<button>Crear usuario</button>
					</form>
					<p class="error">{{ error && 'Error: ' + error }}</p>
				</section>
			</div>
		</b-modal>
	</div>
</template>

<script>
import User from '../../components/admin/user';
export default {
	components: {
		User
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
				console.error('toda la mala', err)
				// TODO: Mostrar que falló
			}
			this.isLoading = false;
		},
		async register() {
			this.error = '';
			try {
				await this.$store.dispatch('Auth/register', { username: this.username, name: this.name, password: this.password });
				this.registerModalActive = false;
				await this.fetchUsers();
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

.modal-card-body form {
	display: flex;
	flex-direction: column;
}

.modal-card-body > form > input{
	border:none;
	border-bottom: 1px solid #ea2a3d;
	background-color: #fafafa;
	user-select: none;
}
.modal-card-body > form > button{
	background-color: #ea2a3d;
	text-transform: uppercase;
	color:#fafafa;
	margin-bottom: 1em;
	border-radius: 3em;
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