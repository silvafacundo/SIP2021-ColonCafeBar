<template>
	<div class="container">
		<h3>Tienda</h3>
		<div class="store-container">
			<b-field label="Precio mínimo del delivery">
				<b-input v-model="store.minDeliveryPrice" type="number" />
			</b-field>
			<b-field label="Precio máximo del delivery">
				<b-input v-model="store.maxDeliveryPrice" type="number" />
			</b-field>
			<b-field label="Precio del delivery por Kilómetro">
				<b-input v-model="store.deliveryPricePerKm" type="number" />
			</b-field>
			<b-field label="Distancia máxima de delivery (Kilómetros)">
				<b-input v-model="store.maxDeliveryKm" type="number" />
			</b-field>
			<b-field label="Tiempo de expiracion de las ordenes (Minutos)">
				<b-input v-model="store.orderTimeoutMinutes" type="number" />
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
				outlined
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
		}
	},
	computed: {
		store() {
			return { ...this.$store.getters['Store/config'] };
		},
	},
	mounted() {
		this.fetchStoreConfig();
	},
	methods: {
		async fetchStoreConfig() {
			this.isLoading = true;
			try {
				await this.$store.dispatch('Store/fetchConfig');
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
			console.log(this.store);
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