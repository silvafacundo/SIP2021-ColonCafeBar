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
				await this.$store.dispatch('Auth/register', { email: this.email, firstName: this.firstName, password: this.password });
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

<style>

</style>