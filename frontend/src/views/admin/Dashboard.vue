<template>
	<div>
		<b-navbar>
			<template #brand>
				<b-navbar-item tag="router-link" :to="{ path: '/admin' }">
					<img
						src="@/assets/images/logo.png"
						alt="Logo Colón Café Bar"
					>
				</b-navbar-item>
			</template>
			<template #start class="nav-container">
				<router-link class="b-navbar-item" :to="{ name: 'adminUsers' }">Usuarios</router-link>
				<router-link class="b-navbar-item" :to="{ name: 'adminRoles' }">Roles</router-link>
				<router-link class="b-navbar-item" :to="{ name: 'adminPermissions' }">Permisos</router-link>
				<!-- <router-link class="b-navbar-item" :to="{ name: 'adminUsers' }">Categorías</router-link>
				<router-link class="b-navbar-item" :to="{ name: 'adminUsers' }">Productos</router-link> -->
				<router-link class="b-navbar-item" :to="{ name: 'adminOrders' }">Ordenes</router-link>
				<router-link class="b-navbar-item" :to="{ name: 'adminDeliveries' }">Deliveries</router-link>
				<router-link class="b-navbar-item" :to="{ name: 'adminCategories' }">Categorías</router-link>
				<router-link class="b-navbar-item" :to="{ name: 'adminProducts' }">Productos</router-link>
			</template>

			<template #end>
				<b-navbar-dropdown right
					boxed
					:label="username">
					<b-navbar-item @click="logout">
						Cerrar sesión
					</b-navbar-item>
				</b-navbar-dropdown>
			</template>
		</b-navbar>
		<router-view />
	</div>
</template>

<script>
export default {
	computed: {
		username() {
			const user = this.$store.getters['Auth/adminUser'];
			if (!user) return '';
			return user.username;
		}
	},
	methods: {
		logout(){
			this.$store.dispatch('Auth/logOut', { admin: true });
		}
	}
}
</script>

<style scoped>
.navbar-item img{
	max-height: 3.75rem;
}

.navbar-item:hover{
	color:var(--rojo);
}
/*.nav-container {
	display: flex;
	gap: 3rem;
}*/
.b-navbar-item {
	display: flex;
	align-items: center;
	padding: 0 1rem;
	padding: .5em;
	margin-bottom:.2em;

}
.b-navbar-item:hover {
	background-color: var(--gris);
}
</style>