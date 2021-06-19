<template>
	<div class="cart">
		<h3>Checkout</h3>
		<b-steps v-model="step" :has-navigation="false">
			<b-step-item icon="clipboard-list">
				<CartProduct v-for="(product, index) of parsedCart"
					:key="index"
					:product="product"
					@delete="e => deleteProduct(index)" />
				<h4>Subtotal: ${{ totalPrice }}</h4>
			</b-step-item>
			<b-step-item icon="bicycle">
				<h4>¿Cómo quieres que sea la entrega?</h4>
				<b-field>
					<b-checkbox v-model="takeAway">Take Away</b-checkbox>
				</b-field>
				<div v-if="!takeAway" class="delivery">
					<h4>Dirección de la entrega:</h4>
					<Address v-if="selectedAddress"
						:address="selectedAddress"
						@click="openSelectAddress" />
					<b-button v-else @click="openSelectAddress">Seleccionar Dirección</b-button>
					<p>Envio: $0</p>
				</div>
				<h4>Subtotal: ${{ totalPrice }}</h4>
			</b-step-item>
			<b-step-item icon="clipboard-check">
				<b-field label="Método de pago:" class="mb-2">
					<b-select v-model="paymentMethod" placeholder="Método de pago">
						<option value="cash">Efectivo</option>
						<option value="online">Mercadopago</option>
					</b-select>
				</b-field>
				<p v-if="takeAway">Retiro del pedido por el local</p>
				<p>Su pedido será entregado en <span class="has-text-weight-bold">{{ addressText }}</span>.</p>
				<h4>Total: ${{ totalPrice }}</h4>
			</b-step-item>
		</b-steps>
		<footer>
			<b-button v-if="step > 0"
				icon-left="angle-left"
				type="is-danger"
				:disabled="isLoading"
				:loading="isLoading"
				@click="prevStep">
				Volver
			</b-button>
			<b-button type="is-success"
				icon-right="angle-right"
				:loading="isLoading"
				:disabled="!canContinue || isLoading"
				@click="nextStep">
				{{ nextStepButtonText }}
			</b-button>
		</footer>
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
import CartProduct from '../components/CartProduct.vue';
export default {
	name: 'Checkout',
	components: {
		Address,
		CartProduct
	},
	data: () => ({
		isLoading: false,
		order: null,
		interval: null,
		takeAway: false,
		selectedAddress: null,
		selectingAddress: false,
		payWithCash: false,
		paymentMethod: 'cash',
		step: 0,
	}),
	computed: {
		products() {
			return this.$store.getters['Products/products'] || [];
		},
		nextStepButtonText() {
			switch (this.step) {
				case 0: return 'Entrega';
				case 1: return 'Continuar';
				default: return 'Finalizar Compra'
			}
		},
		addressText() {
			const { street, number, floor } = this.selectedAddress;
			let text = `${street} ${number}`;

			if (typeof floor !== 'undefined' && floor !== null) text += ` - ${floor}`;

			return text;
		},
		canContinue() {
			if (this.step >= 1 && !this.takeAway && !this.selectedAddress) return false;
			return true;
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
		prevStep() {
			if (this.step <= 0) this.step = 0;
			else this.step --;
		},
		nextStep() {
			if (this.step >= 2) this.createOrder();
			else this.step++;
		},
		async createOrder() {
			try {
				this.isLoading = true;
				const products = this.parsedCart.map(product => ({ id: product.id, variants: product.variants, amount: product.amount }));
				if (!this.takeAway && !this.selectedAddress) {
					this.$showToast('Selecciona una dirección para realizar el delivery', true);
					this.isLoading = false;
					return;
				}
				const addressId = !this.takeAway ? this.selectedAddress.id : null
				const order = await this.$store.dispatch('Orders/createOrder', {
					paymentMethod: this.paymentMethod,
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
		p,h4 {
			margin: 1rem 0;
		}
		> footer {
			display: flex;
			> *:last-child {
				margin-left: auto;
			}
		}
		.create-order {
			align-self: flex-end;
		}
	}
	@media (max-width: 900px){
		.cart{
			max-width: 100vw;
			border-radius: 0px;
			padding:1em;

			.create-order{
				width:100%;
			}
		}
	}
</style>