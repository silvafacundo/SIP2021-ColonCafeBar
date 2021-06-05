<template>
	<div class="cart">
		<h3>Checkout</h3>
		<b-table :data="parsedCart">
			<b-table-column v-slot="props" label="Item">
				{{ props.row.name }}
			</b-table-column>
			<b-table-column v-slot="props" label="Precio">
				{{ props.row.price }}
			</b-table-column>
			<b-table-column v-slot="props" label="Cantidad">
				{{ props.row.amount }}
			</b-table-column>
			<b-table-column v-slot="props">
				<b-button type="is-text"
					:disabled="isLoading"
					icon-left="times"
					@click="()=>deleteProduct(props.row.index)" />
			</b-table-column>
		</b-table>
		<h4>Subtotal: ${{ totalPrice }}</h4>
		<b-field>
			<b-checkbox v-model="takeAway">TakeAway</b-checkbox>
		</b-field>
		<div v-if="!takeAway" class="delivery">
			<Address v-if="selectedAddress"
				:address="selectedAddress"
				@click="openSelectAddress" />
			<b-button v-else @click="openSelectAddress">Seleccionar Dirección</b-button>
			<p>Envio: $0</p>
		</div>
		<h4>Total: ${{ totalPrice }}</h4>
		<b-field>
			<b-checkbox v-model="payWithCash">Pago en efectivo</b-checkbox>
		</b-field>
		<b-button :disabled="!canCreateOrder"
			class="create-order"
			:loading="isLoading"
			type="is-success"
			@click="createOrder">
			Finalizar Compra
		</b-button>
		<b-modal v-model="selectingAddress">
			<div class="card address-selector">
				<h2>Mis direcciones</h2>
				<Address v-for="(address, index) in userAddresses"
					:key="index"
					:selected="selectedAddress && address.id === selectedAddress.id"
					:address="address"
					@click="() => selectAddress(address)" />
			</div>
		</b-modal>
	</div>
</template>

<script>
import Address from '../components/Address.vue';
export default {
	name: 'Checkout',
	components: { Address },
	data: () => ({
		isLoading: false,
		order: null,
		interval: null,
		takeAway: false,
		selectedAddress: null,
		selectingAddress: false,
		payWithCash: false,
	}),
	computed: {
		products() {
			return this.$store.getters['Products/products'] || [];
		},
		cart() {
			return this.$store.getters['Cart/cart'];
		},
		parsedCart() {
			const cartArray = [];
			for (const index in this.cart) {
				const cartProduct = this.cart[index];
				const amount = cartProduct.amount;
				const product = this.products.find( p => p.id === cartProduct.productId);
				cartArray.push({
					index,
					...product,
					variants: cartProduct.variants,
					amount
				});
			}
			return cartArray;
		},
		canCreateOrder() {
			if (this.parsedCart.length <= 0) return false;
			if (!this.takeAway && !this.selectAddress) return false;
			return true;
		},
		totalPrice() {
			return this.parsedCart.reduce((prevValue, product) => prevValue + (product.price * product.amount), 0);
		},
		user() {
			return this.$store.getters['Auth/clientUser']
		},
		userAddresses() {
			if (!this.user) return [];
			return this.user.addresses
		}
	},
	mounted() {
		if (this.products.length <= 0)
			this.$store.dispatch('Products/fetchProducts');
		if (this.userAddresses.length > 0)
			this.selectedAddress = this.userAddresses[0];
	},
	methods: {
		updateCart(productId, newAmount) {
			newAmount = parseInt(newAmount);
			const oldAmount = this.cart[productId];
			const diff = oldAmount - newAmount;
			this.$store.commit('Cart/addToCart', { productId, amount: -diff })
		},
		async createOrder() {
			try {
				this.isLoading = true;
				const products = this.parsedCart.map(product => ({ id: product.id, variants: product.variants, amount: product.amount }));
				if (!this.takeAway && !this.selectedAddress) {
					this.$showToast('Selecciona una dirección para realizar el delivery', true);
					return;
				}
				const paymentMethod = this.payWithCash ? 'cash' : 'online';
				const addressId = !this.takeAway ? this.selectedAddress.id : null
				const order = await this.$store.dispatch('Orders/createOrder', {
					paymentMethod: paymentMethod,
					withDelivery: !this.takeAway,
					addressId: addressId,
					products
				});
				this.$store.commit('Cart/emptyCart');
				this.$router.push({ name: 'order', params: { orderId: order.id } });
			} catch (err) {
				this.$showToast('Error al crear la orden', true);
			}
			this.isLoading = false;
		},
		async deleteProduct(index) {
			this.$store.commit('Cart/deleteIndex', index);
		},
		openSelectAddress(){
			this.selectingAddress = true;
		},
		selectAddress(address){
			this.selectedAddress = address;
			this.selectingAddress = false;
		}
	}
}
</script>

<style scoped lang="scss">
	.cart {
		max-width: 55vw;
		min-height: 55vh;
		margin:auto;
		padding:3em;
		border: 1px solid black;
		border-radius: 3em;
		background-color: #fafafa;
		text-align: left;
		display: flex;
		flex-flow: column;
		gap: .5rem;
		::v-deep table tr td {
			vertical-align: middle;
		}
		::v-deep .modal-content {
			max-width: 55vw!important;
		}
		.address-selector {
			margin: auto;
			padding:1rem 0;
			h2 {
				padding: 1rem;
				padding-top:0;
			}
		}
		h3 {
			color: black;
			text-align: center;
		}
		p, h4 {
			margin: 1rem 0;
		}
		.create-order {
			align-self: flex-end;
		}
	}
</style>