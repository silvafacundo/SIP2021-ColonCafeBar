<template>
	<div>
		<header>
			<router-link :to="{ path: '/' }">
				<img
					src="@/assets/images/logo.png"
					alt="Logo Colón Café Bar"
				>
			</router-link>
			<div class="cart-wrapper">
				<b-button class="cart-button"
					type="is-text"
					@click="goToCart">
					<BadgeIcon icon="shopping-cart" :value="cartItems" />
				</b-button>
				<div class="cart-container">
					<cart v-model="cartActive" />
				</div>
			</div>
			<a role="button"
				class="navbar-burger burger"
				:class="{'is-active': isMenuOpen }"
				@click="() => isMenuOpen = !isMenuOpen">
				<span aria-hidden="true" />
				<span aria-hidden="true" />
				<span aria-hidden="true" />
			</a>
		</header>
		<b-sidebar v-model="isMenuOpen"
			class="sidebar"
			type="is-white"
			fullheight
			overlay>
			<b-menu>
				<b-menu-list label="menú">
					<b-menu-item icon="home"
						tag="router-link"
						to="/"
						label="Inicio" />
					<b-menu-item v-if="!user"
						style="font-size: 0.8rem"
						icon="user"
						tag="router-link"
						to="/login"
						label="Iniciar Sesión/Registrarse" />
					<b-menu-item v-else
						icon="user"
						tag="router-link"
						to="/me"
						label="Mi Cuenta" />
				</b-menu-list>
			</b-menu>
		</b-sidebar>
		<router-view />
	</div>
</template>

<script>
import BadgeIcon from '../components/BadgeIcon';
import Cart from '../components/Cart';
export default {
	name: 'Home',
	components: {
		BadgeIcon,
		Cart
	},
	data: () => ({
		isMenuOpen: false,
		cartActive: false,
	}),
	computed: {
		user() {
			return this.$store.getters['Auth/clientUser'];
		},
		cartItems() {
			return this.$store.getters['Cart/items'];
		}
	},
	methods: {
		goToCart() {
			this.cartActive = !this.cartActive;
			// this.$router.push({ name: 'cart' })
		}
	}
}
</script>

<style scoped lang="scss">

	header {
		width: 100%;
		top: 0;
		position: sticky;
		height: 60px;
		background-color: white;
		padding: 0 1rem;
		display: flex;
		gap: 1rem;
		z-index: 1000;
		margin-bottom: 1rem;
		img {
			height: 100%;
			padding: 5px;
		}
		.cart-wrapper {
			margin-left: auto;
			align-self: center;
			justify-content: flex-end;
			position: relative;
		}
		.navbar-burger {
			align-self: center;
			display: block!important;
			margin-left: 0;
		}
	}
	.sidebar ::v-deep .sidebar-content {
		padding: 1rem;
		padding-top: 80px;
	}
</style>