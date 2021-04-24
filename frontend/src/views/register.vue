<template>
	<div>
		<h3>Register</h3>
		<input type="email" placeholder="Email" v-model="email">
		<input type="text" placeholder="Nombre" v-model="firstName">
		<input type="password" placeholder="Contraseña" v-model="password">
		<button @click="register">Register</button>
		<p>{{error}}</p>
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
				alert('Te registraste!');
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