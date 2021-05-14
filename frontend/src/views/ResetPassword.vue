<template>
	<div>
		<div class="form-div">
			<h3>Restablecer contraseña</h3>
			<img src="../assets/images/logo.png" alt="logo">
			<form v-if="!success" @submit.prevent="resetPassword">
				<input v-model="password"
					placeholder="Nueva contraseña"
					type="password">
				<input v-model="repassword"
					placeholder="Repetir contraseña"
					type="password">
				<button>Restablecer</button>
			</form>
			<div v-else>
				<h2 class="my-3">Contraseña restablecida correctamente!</h2>
				<router-link :to="{ name:'login' }">Iniciar sesión</router-link>
			</div>
			<p class="error">{{ error && 'Error: ' + error }}</p>
		</div>
	</div>
</template>

<script>
export default {
	name: 'ResetPassword',
	props: {
		token: {
			type: String,
			required: true
		}
	},
	data: () => ({
		password: '',
		repassword: '',
		success: false,
		error: ''
	}),
	methods: {
		async resetPassword() {
			this.error = '';
			if (this.password !== this.repassword) {
				this.error = 'Las contraseñas no coinciden';
				return;
			}
			if (this.password.length < 4) {
				this.error = 'La contraseña es muy corta';
				return;
			}
			try {
				this.isLoading = true;
				const token = this.token;
				const password = this.password;
				const { message } = await this.$store.dispatch('Auth/resetPassword', { password, token })
				this.success = true;
			} catch (err) {
				if (err.response && err.response.data) this.error = err.response.data.message;
				else this.error = 'Ocurrió un error inesperado';
			}
			this.isLoading = false;
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
	height: 55vh;
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