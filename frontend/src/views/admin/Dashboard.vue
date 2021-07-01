<template>
	<div>
		<header>
			<router-link :to="{ path: '/admin' }">
				<img
					src="@/assets/images/logo.png"
					alt="Logo Colón Café Bar"
				>
			</router-link>
			<a role="button"
				class="navbar-burger burger"
				:class="{'is-active': isMenuOpen }"
				@click="() => isMenuOpen = !isMenuOpen">
				<span aria-hidden="true" />
				<span aria-hidden="true" />
				<span aria-hidden="true" />
			</a>
		</header>
		<router-view />
		<b-sidebar v-model="isMenuOpen"
			class="sidebar"
			type="is-white"
			fullheight
			overlay>
			<b-menu>
				<b-menu-list label="BAR">
					<b-menu-item icon="home"
						tag="router-link"
						to="/admin"
						label="Home" />

					<b-menu-item icon="store-alt"
						tag="router-link"
						to="/admin/store"
						label="Configuración" />

					<b-menu-item icon="clock"
						tag="router-link"
						to="/admin/schedules"
						label="Horarios" />

					<b-menu-item icon="clipboard-list"
						tag="router-link"
						to="/admin/orders"
						label="Ordenes" />

					<b-menu-item icon="user"
						tag="router-link"
						to="/admin/clients"
						label="Clientes"
					/>
				</b-menu-list>

				<b-menu-list label="Productos">
					<b-menu-item icon="hamburger"
						tag="router-link"
						to="/admin/products"
						label="Productos" />

					<b-menu-item icon="tags"
						tag="router-link"
						to="/admin/categories"
						label="Categorias" />
				</b-menu-list>

				<b-menu-list label="Administración">
					<b-menu-item icon="user"
						tag="router-link"
						to="/admin/users"
						label="Usuarios" />

					<b-menu-item icon="motorcycle"
						tag="router-link"
						to="/admin/deliveries"
						label="Delivery" />

					<b-menu-item icon="user-tag"
						tag="router-link"
						to="/admin/roles"
						label="Roles" />

					<b-menu-item icon="exclamation-triangle"
						tag="router-link"
						to="/admin/permissions"
						label="Permisos" />
				</b-menu-list>
				<b-menu-list label="Acciones">
					<b-menu-item icon="sign-out-alt"
						label="Cerrar sesión"
						class="logout"
						@click="logout" />
				</b-menu-list>
			</b-menu>
		</b-sidebar>
	</div>
</template>

<script>
export default {
	data: () =>({
		isMenuOpen: false,
	}),
	computed: {
		username() {
			const user = this.$store.getters['Auth/adminUser'];
			if (!user) return '';
			return user.username;
		},
		route() {
			return this.$route.path;
		}
	},
	watch: {
		route() {
			this.isMenuOpen = false;
		}
	},
	methods: {
		logout(){
			this.$store.dispatch('Auth/logOut', { admin: true });
		}
	}
}
</script>

<style scoped lang="scss">
	header {
		width: 100vw;
		top: 0;
		position: sticky;
		height: 4em;
		background-color: white;
		padding: 0 1rem;
		display: flex;
		gap: 1rem;
		z-index: 39;
		margin-bottom: 1rem;
		img {
			height: 100%;
			padding: 5px;
		}
		> *:nth-child(2){
			margin-left: auto;
		}
		.navbar-burger {
			align-self: center;
			display: block!important;
		}
	}

.sidebar ::v-deep .sidebar-background {
	z-index: 30;
}
.sidebar ::v-deep .sidebar-content {
	padding: 1rem;
	padding: 1rem;
	padding-top: 80px;
	height: 100%;
	overflow-y: hidden;
	z-index: 35;
	.menu{
		height: 100%;
		display: flex;
		flex-flow: column;

		> .menu-label:nth-last-child(2) {
			margin-top: auto;
		}
		.menu-list {
			display:flex;
			flex-flow: column;
		}
	}
}


</style>