<template>
	<div>
		<div class="form-div">
			<h3>Bienvenido</h3>
			<form @submit.prevent="register">
				<img src="../assets/images/logo.png" alt="logo">
				<input v-model="email"
					type="email"
					placeholder="Email">
				<br>
				<input v-model="firstName"
					type="text"
					placeholder="Nombre">
				<br>
				<input v-model="password"
					type="password"
					placeholder="Contraseña">
				<br>
				<button>Crear cuenta</button>
			</form>
			<p class="error">{{ error && 'Error: ' + error }}</p>
			<router-link to="/login">Ingresar</router-link>
		</div>
	</div>
</template>

<script>
export default {
	data: () => ({
		email: '',
		firstName: '',
		password: '',
		error: ''
	}),
	methods: {
		async register() {
			this.error = '';
			try {
				await this.$store.dispatch('Auth/registerClient', { email: this.email, firstName: this.firstName, password: this.password });
				this.$router.push({ name: 'login' });
			} catch (err) {
				console.error('Failed to register', err);
				if (err && err.response && err.response.data) this.error = err.response.data.message;
				else this.error = 'Ocurrió un error'
			}
		}
	}

}
</script>

<style scoped>
h3{
	text-transform: uppercase;
}

.error{
	color:#ea2a3d;
}

.form-div{
	width: 55vw;
	min-height: 55vh;
	margin:auto;
	padding:3em;
	border: 1px solid black;
	border-radius: 3em;
	background-color: #fafafa;
	text-align: center;
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
	user-select: none;
}
.form-div > form > button{
	background-color: #ea2a3d;
	text-transform: uppercase;
	color:#fafafa;
	margin-bottom: 1em;
	border-radius: 3em;
}

.form-div > form > button:hover{
	cursor:pointer;
	background-color: #c0392b;
}

.form-div > a{
	color: #3498db;
}

.form-div > a:hover{
	color:#ea2a3d;
}
</style>