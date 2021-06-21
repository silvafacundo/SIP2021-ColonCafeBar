<template>
	<div class="card selected-product">
		<div v-if="product.imageUrl" class="image-container">
			<img :src="product.imageUrl" :alt="product.name">
		</div>
		<h3>{{ product.name }}</h3>
		<p class="description">{{ product.description }}</p>
		<p class="price">${{ product.price }}</p>
		<p class="price points">Precio en puntos: {{ product.pointsPrice }}</p>
		<b-field v-for="(variant, variantName) of product.variants"
			:key="variantName"
			:label="variantName + (variant.required ? '': ' (Opcional)')">
			<b-dropdown :value="productConfiguration[variantName]" @input="value => selectVariant(variantName, value)">
				<b-button slot="trigger"
					icon-right="caret-down">
					{{ productConfiguration[variantName] ? productConfiguration[variantName] :'Seleccione una opcion' }}
				</b-button>
				<b-dropdown-item v-if="!variant.required" :value="null">Ninguna</b-dropdown-item>
				<b-dropdown-item v-for="(value, index) of variant.values"
					:key="index"
					:value="value">
					{{ value }}
				</b-dropdown-item>
			</b-dropdown>
		</b-field>
		<b-field label="Unidades">
			<b-numberinput :min="1"
				controls-rounded
				controls-position="compact"
				:value="productConfiguration.amount"
				@input="updateAmount"
				@input.native="({ target })=> updateAmount(target.value)" />
		</b-field>
		<footer>
			<b-button type="is-danger" @click="cancel">Cancelar</b-button>
			<b-button type="is-success" @click="addToCart">Agregar al Carrito</b-button>
		</footer>
	</div>
</template>

<script>
export default {
	name: 'ProductSelector',
	props: {
		product: {
			type: Object,
			required: true
		}
	},
	data: () => ({
		productConfiguration: {
			amount: 1
		}
	}),
	computed: {
		hasValidVariants() {
			for (const variantName in this.product.variants || {}) {
				const variant = this.product.variants[variantName]
				const selected = this.productConfiguration[variantName];

				if (!selected && variant.required) return false;
				else if (!selected) continue;

				if (!variant.values.includes(selected)) return false;
			}
			return true;
		}
	},
	mounted() {
		this.productConfiguration.productId = this.product.id
	},
	methods: {
		updateConfig(key, value) {
			const newProductConfig = { ...this.productConfiguration };
			newProductConfig[key] = value;
			if (value === null || typeof value === 'undefined')
				delete newProductConfig[key];
			this.productConfiguration = newProductConfig;
		},
		selectVariant(variantName, value) {
			this.updateConfig(variantName, value);
		},
		updateAmount(value) {
			value = parseInt(value, 10) || 1;
			let newValue = value;
			if (value < 1) newValue = 1;
			this.updateConfig('amount', newValue);
		},
		cancel() {
			this.$emit('cancel');
		},
		addToCart() {
			if (!this.hasValidVariants) {
				this.$showToast('Por favor seleccione las opciones obligatorias', true);
				return;
			}

			const { productId, amount, ...variants } = this.productConfiguration;
			this.$store.commit('Cart/addToCart', { productId, amount, variants });
			const message = this.productConfiguration.amount > 1 ? 'Producto agregado al carrito': 'Productos agregado al carrito';
			this.$showToast(message);
			this.$emit('addToCart', this.productConfiguration);

		},
	}


}
</script>

<style scoped lang="scss">
	.selected-product {
		padding: 20px;
		display:grid;
		gap: .3rem;
		h3 {
			color: black;
		}
		.image-container {
			text-align: center;
			background-color: rgba(0,0,0,.1);
			img {
				object-fit: cover;
				width: auto;
				height: 250px;
			}
		}
		.description {
			font-size: 14px;
			font-weight: 400;
			text-align: left;
			line-height: 18px;
			color: rgb(88, 80, 101);
			margin-top: 10px;
		}
		.price {
			font-size: 18px;
			font-weight: 700;
			margin-top: 8px;
		}
		.points {
			font-size: 12px;
			margin-bottom: 8px;
		}
	}
</style>