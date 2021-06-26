<template>
	<div v-if="value" class="card selected-address">
		<b-steps
			v-model="addressStep"
			:has-navigation="false">
			<b-step-item icon="address-card">
				<b-field label="Alias">
					<b-input :value="value.alias" @input="value => updateField('alias', value)" />
				</b-field>
				<b-field label="Calle*">
					<b-input :value="value.street" @input="value => updateField('street', value)" />
				</b-field>
				<b-field label="Número*">
					<b-input :value="value.number" @input="value => updateField('number', value)" />
				</b-field>
				<b-field label="Localidad*">
					<b-input :value="value.neighborhood" @input="value => updateField('neighborhood', value)" />
				</b-field>
				<b-field label="Piso">
					<b-input :value="value.floor" @input="value => updateField('floor', value)" />
				</b-field>
				<b-field label="Entre Calles*">
					<b-input :value="value.corner" @input="value => updateField('corner', value)" />
				</b-field>
				<b-button v-if="value.id"
					type="is-ghost"
					:disabled="isLoading"
					expanded
					@click="deleteAddress">
					Eliminar dirección
				</b-button>
			</b-step-item>
			<b-step-item icon="map-marker">
				<b-field v-if="canContinue && hasPosition"
					class="map-container"
					label="Confirme la ubicación de la dirección:">
					<GmapMap
						:center="initialCenter"
						:zoom="15"
						:options="{ streetViewControl: false }"
						map-type-id="terrain"
						style="width: 500px; height: 300px"
						@click="handleMapClick">
						<GmapMarker
							:position="position"
							:clickable="true"
							:draggable="false"
							:title="value.alias"
						/>
					</GmapMap>
				</b-field>
			</b-step-item>
		</b-steps>
		<footer>
			<b-button type="is-danger"
				:disabled="isLoading"
				@click="prevStep">
				{{ cancelStepText }}
			</b-button>
			<b-button type="is-success"
				:loading="isLoading"
				:disabled="!canContinue || isLoading"
				@click="nextStep">
				{{ stepText }}
			</b-button>
		</footer>
	</div>
</template>

<script>
export default {
	name: 'CreateAddress',
	props: {
		value: {
			type: Object,
			required: false,
			default: () => ({})
		},
		loading: {
			type: Boolean,
			required: false,
			default: false
		}
	},
	data: ()=> ({
		addressStep: 0,
		initialCenter: { lat: 0, lng: 0 }
	}),
	computed: {
		isLoading() {
			return this.loading;
		},
		canContinue() {
			return !!(this.value && this.value.street && this.value.number && this.value.neighborhood && this.value.corner);
		},
		hasPosition() {
			return !!(this.value && this.value.coordinates);
		},
		position() {
			if (!this.value || !this.value.coordinates) return null;
			const [lat, lng] = this.value.coordinates.split(';');
			return { lat: Number(lat), lng: Number(lng) };
		},
		cancelStepText() {
			switch (this.addressStep) {
				case 0:
					return 'Cancelar'
				default:
					return 'Volver'
			}
		},
		stepText() {
			switch (this.addressStep) {
				case 1:
					return 'Guardar'
				default:
					return 'Continuar'
			}
		}
	},
	methods: {
		handleMapClick(e) {
			const lat = e.latLng.lat();
			const lng = e.latLng.lng();
			const coordinates = `${lat};${lng}`;
			this.updateField('coordinates', coordinates);
		},
		async convertAddresPosition() {
			const address = `${this.value.street}+${this.value.number}+${this.value.neighborhood}+${this.value.city}`;
			const axios = this.axios.create();
			delete axios.defaults.headers.common['Authorization'];

			const { data } = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address.replace(' ', '')},+AR&key=${process.env.VUE_APP_MAPS_APIKEY}`);
			if (!data || !data.results) return;
			const { results } = data;
			if (results && Array.isArray(results) && results.length > 0 && results[0] && results[0].geometry && results[0].geometry.location);

			const { lat, lng } = results[0].geometry.location;
			const coordinates = `${lat};${lng}`;
			this.updateField('coordinates', coordinates);
		},
		async nextStep() {
			this.$emit('loading', true);
			switch (this.addressStep) {
				case 0:
					if (!this.value.coordinates) {
						await this.convertAddresPosition();
					}
					this.initialCenter = this.position;
					break;
				case 1:
					await this.saveAddress()
					break;
				default:
					break;
			}
			this.$emit('loading', false);
			this.addressStep++;
		},
		async prevStep() {
			if (this.addressStep <= 0) this.closeModal();
			else this.addressStep--;
		},
		updateField(field, value) {
			const newVal = { ...this.value };
			newVal[field] = value;
			this.$emit('input', newVal);
		},
		async deleteAddress() {
			if (this.$listeners && typeof this.$listeners.delete === 'function') {
				await Promise.resolve(this.$listeners.delete())
			} else
				this.$emit('delete');
		},
		async saveAddress() {
			if (this.$listeners && typeof this.$listeners.save === 'function')
				await Promise.resolve(this.$listeners.save());
			else
				this.$emit('save');
		}
	}
}
</script>

<style scoped lang="scss">
	.selected-address {
		padding: 20px;
		footer {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			gap: 1rem;
			button:last-child {
				margin-left: auto;
			}
		}
	}
	.map-container {
		width: 100%;
		flex-flow: column;
		display: flex;
		align-items: center;
	}
</style>