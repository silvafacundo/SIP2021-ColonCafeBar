<template>
	<div>
		<div class="form-div">
			<h3>Bienvenido</h3>
			<form @submit.prevent="register">
				<img src="../assets/images/logo.png" alt="logo">
				<input type="email" placeholder="Email" v-model="email">
				<br>
				<input type="text" placeholder="Nombre" v-model="firstName">
				<br>
				<input type="password" placeholder="Contraseña" v-model="password">
				<br>
				<button>Crear cuenta</button>
			</form>
		<p class="error">{{error && 'Error: ' + error}}</p>
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
				await this.$store.dispatch('User/register', { email: this.email, firstName: this.firstName, password: this.password });
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