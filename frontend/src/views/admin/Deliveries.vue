<template>
	<div class="container">
		<h3>Deliveries</h3>
		<b-table :data="deliveries">
			<b-table-column v-slot="props" label="#">
				{{ props.row.id }}
			</b-table-column>
			<b-table-column v-slot="props" label="Nombre">
				<EditableText
					:value="props.row.name"
					placeholder="Nombre"
					tag="label"
					type="text"
					:can-edit="true"
					@change="editFirstName(props.row.id, $event)" />
			</b-table-column>
			<b-table-column v-slot="props" label="Apellido">
				<EditableText
					:value="props.row.lastName"
					placeholder="Apellido"
					tag="label"
					type="text"
					:can-edit="true"
					@change="editLastName(props.row.id, $event)" />
			</b-table-column>
			<b-table-column v-slot="props" label="Teléfono">
				<EditableText
					:value="props.row.phoneNumber"
					placeholder="Número de teléfono"
					tag="label"
					type="text"
					:can-edit="true"
					@change="editPhoneNumber(props.row.id, $event)" />
			</b-table-column>
			<b-table-column v-slot="props">
				<b-button type="is-danger"
					size="is-small"
					@click="() => deleteDelivery(props.row.id)">
					Eliminar
				</b-button>
			</b-table-column>
		</b-table>
		<b-button
			label="Crear delivery"
			type="is-success"
			size="default"
			class="register-button"
			@click="() => registerModalActive = true" />
		<b-modal v-model="registerModalActive" has-modal-card>
			<div class="modal-card" style="margin: auto">
				<header class="modal-card-head">
					<p class="modal-card-title">Registrar Delivery</p>
				</header>
				<section class="modal-card-body">
					<form @submit.prevent="register">
						<b-field label="Nombre">
							<b-input v-model="firstName"
								type="text"
								placeholder="Nombre" />
						</b-field>
						<b-field label="Apellido">
							<b-input v-model="lastName"
								type="text"
								placeholder="Nombre" />
						</b-field>
						<b-field label="Teléfono">
							<b-input v-model="phoneNumber"
								type="text"
								placeholder="Número de teléfono" />
						</b-field>
						<p class="error my-1 has-text-centered">{{ error && 'Error: ' + error }}</p>
						<button>Crear delivery</button>
					</form>
				</section>
			</div>
		</b-modal>
	</div>
</template>

<script>
import EditableText from '../../components/EditableText';
export default {
	components: {
		EditableText,
	},
	data() {
		return {
			registerModalActive: false,
			firstName: '',
			lastName: '',
			phoneNumber: '',
			error: '',
		}
	},
	computed: {
		deliveries() {
			return this.$store.getters['Delivery/deliveries'];
		},
	},
	mounted() {
		this.fetchDeliveries();
	},
	methods: {
		async fetchDeliveries() {
			this.isLoading = true;
			try {
				await this.$store.dispatch('Delivery/fetchDeliveries');
			} catch (err) {
				this.$showToast('Error al cargar los usuarios', true);
			}
			this.isLoading = false;
		},
		async editFirstName(id, firstName) {
			try {
				await this.$store.dispatch('Delivery/updateDelivery', { id, name: firstName });
				this.$showToast('Nombre modificado con éxito');
			} catch (err) {
				this.$showToast('Error al cambiar el nombre del delivery', true);
			}
		},
		async editLastName(id, lastName) {
			try {
				await this.$store.dispatch('Delivery/updateDelivery', { id, lastName });
				this.$showToast('Apellido modificado con éxito');
			} catch (err) {
				this.$showToast('Error al cambiar el apellido del delivery', true);
			}
		},
		async editPhoneNumber(id, phoneNumber) {
			try {
				await this.$store.dispatch('Delivery/updateDelivery', { id, phoneNumber });
				this.$showToast('Número de teléfono modificado con éxito');
			} catch (err) {
				this.$showToast('Error al cambiar el apellido del delivery', true);
			}
		},
		async deleteDelivery(id) {
			this.$buefy.dialog.confirm({
				title: 'Deshabilitando un delivery',
				message: '<b>¿Seguro que desea deshabilitar a este delivery?</b><br>Al deshabilitar el delivery este dejará de aparecer como opción en las ordenes',
				confirmText: 'Sí',
				cancelText: 'Cancelar',
				type: 'is-danger',
				hasIcon: true,
				onConfirm: () => this._deleteDelivery(id),
			});
		},
		async _deleteDelivery(id) {
			try {
				await this.$store.dispatch('Delivery/deleteDelivery', { id });
			} catch (err) {
				this.$showToast('Error al eliminar el delivery', true);
			}
		},
		async register() {
			this.error = '';
			const firstName = this.firstName;
			const lastName = this.lastName;
			const phoneNumber= this.phoneNumber;
			// RESET FIELDS
			this.firstName = '';
			this.lastName = '';
			this.phoneNumber = '';
			try {
				await this.$store.dispatch('Delivery/createDelivery', { name: firstName, lastName, phoneNumber });
				this.registerModalActive = false;
				await this.fetchDeliveries();
				this.$showToast('Delivery creado con éxito');
			} catch (err) {
				console.error('Failed to register', err);
				if (err && err.response && err.response.data) this.error = err.response.data.message;
				else this.error = 'Ocurrió un error';
			}
		},
	}
}
</script>

<style scoped lang="scss">
.register-button {
	display: flex;
	margin-left: auto;
	margin-top: .5rem;
}
.error{
	color:#ea2a3d;
}
.modal-card{
	border-radius:5px;
}

.modal-card-body form {
	display: flex;
	flex-direction: column;
}

.modal-card-body > form > input{
	border:none;
	border-bottom: 1px solid #ea2a3d;
	background-color: var(--blanco);
	user-select: none;
}
.modal-card-body > form > button{
	background-color: #ea2a3d;
	text-transform: uppercase;
	color:var(--blanco);
	margin-top: 1em;
	border-radius: 8px;
}

.modal-card-body > form > button:hover{
	cursor:pointer;
	background-color: #c0392b;
}
.modal-card-body > a{
	color: #3498db;
}
.modal-card-body > form > input, form > button{
	display:block;
	padding:1em;
}

@media (max-width: 900px){
		div.container{
			padding: 0;
			width: 95%;
		}
	}

</style>