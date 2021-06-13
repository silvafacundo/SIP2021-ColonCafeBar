<template>
	<div>
		<div class="form-div">
			<form @submit.prevent="login">
				<img src="@/assets/images/logo.png" alt="logo">
				<input v-model="username"
					type="username"
					name="username"
					placeholder="Username"
					title="Ingrese username">
				<br>
				<input v-model="password"
					type="password"
					name="password"
					placeholder="Contraseña"
					title="Ingrese contraseña">
				<br>
				<button>Ingresar</button>
			</form>
			<!-- <router-link to="/register" title="Crear una cuenta">¿No tenes cuenta? ¡Regístrese haciendo click aquí!</router-link> -->
		</div>
	</div>
</template>

<script>
export default {
	data: () => ({
		username: '',
		password: ''
	}),
	mounted() {
	},
	methods: {
		async login() {
			try {
				await this.$store.dispatch('Auth/adminLogin', { username: this.username, password: this.password });
				await this.$router.push({ name: 'adminDashboard' });
			} catch (err) {
				console.error('Failed to log in', err);
				this.danger();
			}
		},
		danger() {
			this.$buefy.toast.open({
				duration: 5000,
				message: `Usuario o contraseña incorrecto`,
				position: 'is-bottom',
				type: 'is-danger'
			})
		}
	}
}
</script>

<style scoped>
div:nth-child(1){
	margin-top:5em;
	max-width: 100vw;
}
.form-div{
	padding:3em;
	width:70%;
	border-radius: 10px;
	margin:auto;
	background-color: #fafafa;
	text-align: center;
	color: black;
}

.form-div > form > input, form > button{
	display:block;
	width:40vw;
	margin:auto;
	padding:1em;
}
.form-div > form > img{
	margin-bottom: 2em;
	width:8em;
}

.form-div > form > input{
	border:none;
	border-bottom: 1px solid #ea2a3d;
	background-color: #fafafa;
}
.form-div > form > button{
	background-color: #ea2a3d;
	text-transform: uppercase;
	color:#fafafa;
	margin-bottom: 1em;
	border-radius: 10px;
}

.form-div > form > button:hover{
	cursor:pointer;
	background-color: #c0392b;
}

.form-div > a{
	display: block;
	font-size: 1em;
	widows: 100%;
	color: #3498db;
}

.form-div > a:hover{
	color:#ea2a3d;
}

@media (max-width: 900px){
	div:nth-child(1){
		margin-top:3em;
	}
	.form-div{
		width: 100vw;
	}
	.form-div > form > input, form > button{
		display:block;
		width:90%;
		margin:auto;
		padding:1em;
	}
}
</style>