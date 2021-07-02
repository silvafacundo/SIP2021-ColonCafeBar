<template>
	<div class="container">
		<h3>Tienda</h3>
		<div class="store-container">
			<b-field label="Precio mínimo del delivery">
				<b-input :value="store.minDeliveryPrice"
					type="number"
					min="0"
					@input="val => updateField('minDeliveryPrice',val)" />
			</b-field>
			<b-field label="Precio máximo del delivery">
				<b-input :value="store.maxDeliveryPrice"
					type="number"
					min="0"
					@input="val => updateField('maxDeliveryPrice',val)" />
			</b-field>
			<b-field label="Precio del delivery por Kilómetro">
				<b-input :value="store.deliveryPricePerKm"
					type="number"
					min="0"
					@input="val => updateField('deliveryPricePerKm',val)" />
			</b-field>
			<b-field label="Distancia máxima de delivery (Kilómetros)">
				<b-input :value="store.maxDeliveryKm"
					type="number"
					min="0"
					@input="val => updateField('maxDeliveryKm',val)" />
			</b-field>
			<b-field label="Tiempo de expiracion de las ordenes (Minutos)">
				<b-input :value="store.orderTimeoutMinutes"
					type="number"
					min="0"
					@input="val => updateField('orderTimeoutMinutes',val)" />
			</b-field>
			<b-field label="Dirección">
				<div v-if="storeCoordinates" class="address-container">
					<GmapAutocomplete class="input" @place_changed="addressInput" />
					<GmapMap
						:center="storeCoordinates"
						:zoom="15"
						:options="{ streetViewControl: false }"
						map-type-id="terrain"
						style="width: 100%; height: 50vh; display: flex; margin: auto">
						<GmapMarker
							:position="storeCoordinates"
							:clickable="true"
							:draggable="false"
						/>
					</GmapMap>
				</div>
			</b-field>
			<b-button type="is-success"
				:disabled="!isStoreDataValid"
				@click="updateStoreConfig">
				Guardar
			</b-button>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			isLoading: false,
			storeCoordinates: null,
			store: {}
		}
	},
	computed: {
		isStoreDataValid() {
			return parseInt(this.store.minDeliveryPrice) >= 0
				&& parseInt(this.store.maxDeliveryPrice) >= 0
				&& parseInt(this.store.deliveryPricePerKm) >= 0
				&& parseInt(this.store.maxDeliveryKm) >= 0
				&& parseInt(this.store.orderTimeoutMinutes) >= 0;
		}
	},
	mounted() {
		this.fetchStoreConfig();
	},
	methods: {
		async fetchStoreConfig() {
			this.isLoading = true;
			try {
				this.store = await this.$store.dispatch('Store/fetchConfig');
				this.initializeStoreAddress();
			} catch (err) {
				this.$showToast('Error al cargar la información de la tienda', true);
			}
			this.isLoading = false;
		},
		initializeStoreAddress() {
			const { coordinates } = this.store;
			const [lat, lng] = coordinates.split(';');
			this.storeCoordinates = { lat: Number(lat), lng: Number(lng) };
		},
		async updateStoreConfig() {
			this.isLoading = true;
			try {
				await this.$store.dispatch('Store/updateConfig', {
					...this.store,
					coordinates: `${this.storeCoordinates.lat};${this.storeCoordinates.lng}`
				});
				this.$showToast('Guardado con éxito', false);
			} catch (err) {
				this.$showToast('Error al actualizar la información de la tienda', true);
			}
			this.isLoading = false;
		},
		updateField(key, value) {
			const newStore = { ...this.store };
			newStore[key] = value;
			this.store = newStore;
		},
		addressInput(address) {
			this.storeCoordinates = {
				lat: address.geometry.location.lat(),
				lng: address.geometry.location.lng(),
			}
		},
	}
}

</script>

<style scoped lang="scss">
div.store-container {
	background-color: white;
	display: flex;
	flex-direction: column;
	padding: 1rem;
}
div.address-container {
	display: flex;
	flex-direction: column;
	gap: .5rem;
}
// @media (max-width: 900px){
// 		div.store-container{
// 			padding: 0;
// 			width: 95%;
// 		}
// 	}
</style>