<template>
	<div class="schedule-container">
		<h3>Horarios</h3>
		<!-- <b-table :data="schedules">
			<b-table-column v-slot="props" label="#">
				{{ props.row.id }}
			</b-table-column>
			<b-table-column v-slot="props" label="Horario de apertura">
				<EditableText
					:value="props.row.openingTime"
					placeholder="Horario apertura"
					tag="label"
					type="text"
					:can-edit="true"
					@change="editOpeningTime(props.row.id, $event)" />
			</b-table-column>
			<b-table-column v-slot="props" label="Horario de cierre">
				<EditableText
					:value="props.row.closingTime"
					placeholder="Horario de cierre"
					tag="label"
					type="text"
					:can-edit="true"
					@change="editClosingTime(props.row.id, $event)" />
			</b-table-column>
			<b-table-column v-slot="props" label="Dia de la semana">
				<EditableText
					:value="props.row.dayOfWeek"
					placeholder="Día de la semana"
					tag="label"
					type="number"
					:can-edit="true"
					@change="editPhoneNumber(props.row.id, $event)" />
			</b-table-column>
			<b-table-column v-slot="props">
				<b-button type="is-danger"
					size="is-small"
					@click="() => deleteSchedule(props.row.id)">
					Eliminar
				</b-button>
			</b-table-column>
		</b-table> -->
		<b-button
			label="Crear horario"
			type="is-success"
			size="default"
			class="register-button"
			@click="() => registerModalActive = true" />
		<b-modal v-model="registerModalActive" has-modal-card>
			<div class="modal-card" style="margin: auto">
				<header class="modal-card-head">
					<p class="modal-card-title">Registrar Horario</p>
				</header>
				<section class="modal-card-body">
					<form @submit.prevent="register">
						<section>
							<b-field>
								<b-switch v-model="isAmPmOpening">AM/PM</b-switch>
							</b-field>
							<b-field label="Horario apertura">
								<b-clockpicker
									rounded
									placeholder="Click para seleccionar"
									icon="clock"
									:hour-format="format" />
							</b-field>
						</section>
						<section>
							<b-field>
								<b-switch v-model="isAmPmClosing">AM/PM</b-switch>
							</b-field>
							<b-field label="Horario cierre">
								<b-clockpicker
									rounded
									placeholder="Click para seleccionar"
									icon="clock"
									:hour-format="format" />
							</b-field>
						</section>
						<b-field label="Día de la semana">
							<b-select placeholder="Seleccionar día de semana">
								<option
									v-for="day in days"
									:key="day.id"
									:value="day.id">
									{{ day.name }}
								</option>
							</b-select>
						</b-field>
						<p class="error my-1 has-text-centered">{{ error && 'Error: ' + error }}</p>
						<button>Crear horario</button>
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
			openingTime: '',
			closingTime: '',
			dayOfWeek: '',
			error: '',
			isAmPmOpening: false,
			isAmPmClosing: false,
			days: [
				{ id: 1, name: 'Lunes' },
				{ id: 2, name: 'Martes' },
				{ id: 3, name: 'Miercoles' },
				{ id: 4, name: 'Jueves' },
				{ id: 5, name: 'Viernes' },
				{ id: 6, name: 'Sabado' },
				{ id: 7, name: 'Domingo' }
			],
		}
	},
	computed: {
		fetchSchedules() {
			return this.$store.getters['Schedule/schedules'];
		},
		format() {
			return this.isAmPm ? '12' : '24'
		},
	},
	mounted() {
		this.fetchSchedules();
	},
	methods: {
		async register() {
			this.error = '';
			const openingTime = this.openingTime;
			const closingTime = this.closingTime;
			const dayOfWeek= this.dayOfWeek;
			// RESET FIELDS
			this.firstName = '';
			this.lastName = '';
			this.phoneNumber = '';
			try {
				await this.$store.dispatch('Schedule/createSchedule', { openingTime, closingTime, dayOfWeek });
				this.registerModalActive = false;
				await this.fetchSchedule();
				this.$showToast('Schedule creado con éxito');
			} catch (err) {
				console.error('Failed to register', err);
				if (err && err.response && err.response.data) this.error = err.response.data.message;
				else this.error = 'Ocurrió un error';
			}
		},
	}
}
</script>

<style>

</style>