<template>
	<div class="container">
		<h3>Mi Cuenta</h3>
		<div class="main-info">
			<p class="name">{{ fullName }}</p>
			<p class="email">{{ user.email }}</p>
		</div>
		<b-collapse class="card"
			animation="slide">
			<template #trigger="props">
				<div
					class="card-header"
					role="button">
					<p class="card-header-title">
						Información
					</p>
					<a class="card-header-icon">
						<b-icon
							:icon="props.open ? 'caret-down' : 'caret-up'" />
					</a>
				</div>
			</template>

			<div class="card-content">
				<div class="content">
					<b-field label="Nombre">
						<b-input v-model="user.firstName" />
					</b-field>
					<b-field label="Apellido">
						<b-input v-model="user.lastName" />
					</b-field>
					<b-field label="Teléfono">
						<b-input v-model="user.phoneNumber" />
					</b-field>
				</div>
				<footer class="card-footer">
					<b-button type="is-success"
						outlined
						@click="updateProfile">
						Guardar
					</b-button>
				</footer>
			</div>
		</b-collapse>
		<b-collapse class="card"
			:open="false"
			animation="slide">
			<template #trigger="props">
				<div
					class="card-header"
					role="button">
					<p class="card-header-title">
						Direcciones
					</p>
					<a class="card-header-icon">
						<b-icon
							:icon="props.open ? 'caret-down' : 'caret-up'" />
					</a>
				</div>
			</template>

			<div class="card-content">
				<div class="content">
					<Address v-for="(address, index ) in user.addresses"
						:key="index"
						:address="address"
						@click="() => selectedAddress = { ...address }" />
					<b-button type="is-ghost"
						expanded
						icon-left="plus"
						@click="newAddress">
						Nueva Direccion
					</b-button>
				</div>
			</div>
		</b-collapse>

		<b-modal :active="!!selectedAddress" @close="closeModal">
			<div v-if="selectedAddress" class="card selected-address">
				<b-steps
					:has-navigation="hasAddressData"
					@input="stepHandler">
					<b-step-item
						value="1">
						<b-field label="Alias">
							<b-input v-model="selectedAddress.alias" />
						</b-field>
						<b-field label="Calle*">
							<b-input v-model="selectedAddress.street" />
						</b-field>
						<b-field label="Número*">
							<b-input v-model="selectedAddress.number" />
						</b-field>
						<b-field label="Localidad*">
							<b-input v-model="selectedAddress.neighborhood" />
						</b-field>
						<b-field label="Piso">
							<b-input v-model="selectedAddress.floor" />
						</b-field>
						<b-field label="Entre Calles*">
							<b-input v-model="selectedAddress.corner" />
						</b-field>
						<b-button v-if="selectedAddress.id"
							type="is-ghost"
							:disabled="isLoading"
							expanded
							@click="deleteAddress">
							Eliminar dirección
						</b-button>
					</b-step-item>
					<b-step-item
						value="2">
						<b-field v-if="hasAddressData && hasAddresPosition" class="map-container">
							<GmapMap
								:center="addresPosition"
								:zoom="15"
								map-type-id="terrain"
								style="width: 500px; height: 300px">
								<GmapMarker
									:position="addresPosition"
									:clickable="true"
									:draggable="false"
									title="Colón Café Bar"
									@click="clickedMarker(m)"
								/>
							</GmapMap>
						</b-field>
						<footer>
							<b-button type="is-danger"
								:disabled="isLoading"
								@click="closeModal">
								Cancelar
							</b-button>
							<b-button type="is-success"
								:loading="isLoading"
								@click="saveAddress">
								Guardar
							</b-button>
						</footer>
					</b-step-item>
				</b-steps>
			</div>
		</b-modal>
		<b-button type="is-ghost"
			size="is-small"
			class="logout"
			@click="logOut">
			Cerrar Sesión
		</b-button>
	</div>
</template>

<script>
import Address from '../components/Address';
export default {
	components: {
		Address
	},
	data: () => ({
		isLoading: false,
		selectedAddress: null,
	}),
	computed: {
		fullName() {
			let result = this.user.firstName;
			if (this.user.lastName) result += ` ${this.user.lastName}`;
			return result;
		},
		user() {
			return { ...this.$store.getters['Auth/clientUser'] };
		},
		hasAddressData() {
			return !!(this.selectedAddress
				&& this.selectedAddress.street
				&& this.selectedAddress.number);
		},
		hasAddresPosition() {
			return !!(this.selectedAddress && this.selectedAddress.coordinates);
		},
		addresPosition() {
			return this.selectedAddress.coordinates;
		}
	},
	methods: {
		closeModal() {
			this.selectedAddress = null;
		},
		newAddress() {
			this.selectedAddress = {
				city: 'Buenos Aires',
				neighborhood: 'Chivilcoy',
				postalCode: 6620
			};
		},
		stepHandler(step) {
			if (step == 2) {
				this.convertAddresPosition();
			}
		},
		async convertAddresPosition() {
			const address = `${this.selectedAddress.street}+${this.selectedAddress.number}+${this.selectedAddress.neighborhood}+${this.selectedAddress.city}`;
			const axios = this.axios.create();
			delete axios.defaults.headers.common['Authorization'];

			const { data } = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address.replace(' ', '')},+AR&key=${process.env.VUE_APP_MAPS_APIKEY}`);
			if (!data || !data.results) return;
			const { results } = data;
			if (results && Array.isArray(results) && results.length > 0 && results[0] && results[0].geometry && results[0].geometry.location);

			const newSelectedAddress = { ...this.selectedAddress };
			newSelectedAddress.coordinates = results[0].geometry.location;
			this.selectedAddress = newSelectedAddress;
		},
		async updateProfile() {
			try {
				const data = {
					firstName: this.user.firstName,
					lastName: this.user.lastName,
					phoneNumber: this.user.phoneNumber
				};
				await this.$store.dispatch('Client/updateClient', data);
				this.$showToast('Datos actualizados correctamente');
			} catch (err) {
				this.$showToast('Error al actualizar los datos', true);
			}
		},
		async saveAddress() {

			try {

				if (this.selectedAddress.id)
					await this.$store.dispatch('Client/updateAddress', { addressId: this.selectedAddress.id, ...this.selectedAddress });
				else
					await this.$store.dispatch('Client/createAddress', { ...this.selectedAddress });
				this.closeModal();
				this.$showToast('Dirección guardada correctamente');
			} catch (err) {
				let errMessage = err && err.response && err.response.data.message;
				if (errMessage)  errMessage = `Error: ${errMessage}`;
				else errMessage = ''
				this.$showToast('Ocurrió un error al guardar la dirección' + errMessage, true);
			}
		},
		async deleteAddress() {
			try {
				await this.$store.dispatch('Client/deleteAddress', { addressId: this.selectedAddress.id });
				this.closeModal();
				this.$showToast('Dirección eliminada correctamente');
			} catch (err) {
				this.$showToast('Ocurrió un error al eliminar la dirección', true);
			}
		},
		async logOut() {
			await this.$store.dispatch('Auth/logOut', { client: true });
		}
	}
}
</script>

<style lang="scss" scoped>
	.container {
		display: grid;
		gap: 1rem;
		.logout {
			color: white;
		}
		.main-info {
			text-align: center;
			color: white;
			p {
				margin: .5rem 0;
				&.name {
					font-weight: bold;
					font-size:1.5rem;
				}
				&.email {
					font-size: .8rem;
				}
			}
		}
		.card-footer {
			::v-deep button {
				margin-top: 1rem;
				margin-left: auto;
			}
		}
	}
	.selected-address {
		padding: 20px;
		footer {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			gap: 1rem;
		}
	}
	.map-container {
		display: flex;
		justify-content: center;
	}
</style>