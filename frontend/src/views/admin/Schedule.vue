<template>
	<div class="schedule-container">
		<h3>Horarios</h3>
		<b-table>
			<b-table-column label="#">
				asd
			</b-table-column>
			<b-table-column label="Horario de apertura">
				asd
			</b-table-column>
			<b-table-column label="Horario de cierre">
				asd
			</b-table-column>
			<b-table-column label="Dia de la semana">
				eh
			</b-table-column>
			<b-table-column>
				<b-button type="is-danger"
					size="is-small">
					Eliminar
				</b-button>
			</b-table-column>
		</b-table>
		<b-button
			label="Crear horario"
			type="is-success"
			size="default"
			class="register-button"
			@click="() => createModalActive = true" />
		<b-modal v-model="createModalActive" has-modal-card>
			<div class="modal-card" style="margin: auto">
				<header class="modal-card-head">
					<p class="modal-card-title">Registrar Horario</p>
				</header>
				<section class="modal-card-body">
					<form @submit.prevent="createSchedule">
						<section>
							<b-field label="Alias">
								<b-input :value="value.alias" />
							</b-field>
						</section>
						<section>
							<b-field label="Horario apertura">
								<b-clockpicker
									rounded
									placeholder="Click para seleccionar"
									icon="clock"
									:hour-format="format"
									v-model="openingTime"
								/>
									:hour-format="format" />
							</b-field>
						</section>
						<section>
							<b-field label="Horario cierre">
								<b-clockpicker
									rounded
									placeholder="Click para seleccionar"
									icon="clock"
									v-model="closingTime"
									:hour-format="format"
									:closingTime="closingTime"
									>
								</b-clockpicker>
									:hour-format="format" />
							</b-field>
						</section>
						<b-field label="Día de la semana">
							<b-select placeholder="Seleccionar día de semana"
								v-model="dayOfWeek">
								<option
									v-for="day in days"
									:key="day.id"
									:value="day.id"
									>
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
export default {
	name: 'Schedules',
	components: {

	},
	data() {
		return {
			createModalActive: false,
			openingTime: '',
			closingTime: '',
			dayOfWeek: 1,
			error: '',
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
		schedules() {
			return this.$store.getters['Schedules/schedules'];
		},
		format() {
			return this.isAmPm ? '12' : '24'
		},
	},
	mounted() {
		this.fetchAdminSchedules();
	},
	methods: {
		async fetchAdminSchedules() {
			try {
				await this.$store.dispatch('Schedules/fetchAdminSchedules');
			} catch (err) {
				this.$showToast('Error al cargar los horarios', true);
			}
		},
		async createSchedule() {
			this.error = '';
			const openingTime = this.openingTime.toString().split(' ')[4];
			const closingTime = this.closingTime.toString().split(' ')[4];
			const dayOfWeek= this.dayOfWeek;
			this.openingTime = '';
			this.closingTime = '';
			this.dayOfWeek = 1;
			try {
				await this.$store.dispatch('Schedules/createSchedule', { openingTime, closingTime, dayOfWeek });
				this.createModalActive = false;
				await this.fetchAdminSchedules();
				this.$showToast('Horario creado con éxito');
			} catch (err) {
				console.error('Failed to register', err);
				if (err && err.response && err.response.data) this.error = err.response.data.message;
				else this.error = 'Ocurrió un error';
			}
		},
		async updateSchedule(){
			this.error = '';
			const id = 1;
			const openingTime = this.openingTime.toString().split(' ')[4];
			const closingTime = this.closingTime.toString().split(' ')[4];
			const dayOfWeek= this.selected;
			this.openingTime = '';
			this.closingTime = '';
			this.dayOfWeek = 1;
			try {
				await this.$store.dispatch('Schedules/updateSchedule', { id, openingTime, closingTime, dayOfWeek });
				this.createModalActive = false;
				await this.fetchSchedule();
				this.$showToast('Horario actualizado con éxito');
			} catch (err) {
				console.error('Failed to update', err);
				if (err && err.response && err.response.data) this.error = err.response.data.message;
				else this.error = 'Ocurrió un error';
			}
		},
		async deleteSchedule(){
			this.$buefy.dialog.confirm({
				title: 'Eliminado un horario',
				message: '<b>¿Seguro que desea eliminar a este horario?</b>',
				confirmText: 'Sí',
				cancelText: 'Cancelar',
				type: 'is-danger',
				hasIcon: true,
				onConfirm: () => this._deleteCategory(),
			});
		},
		async _deleteSchedule(){
			this.error = '';
			try {
				const id=1;
				await this.$store.dispatch(`Schedules/deleteSchedule?id=${id}`);
				await this.fetchSchedule();
				this.$showToast('Horario eliminado con éxito');
			} catch (err) {
				console.error('Failed to delete', err);
				if (err && err.response && err.response.data) this.error = err.response.data.message;
				else this.error = 'Ocurrió un error';
			}
		}
	}
}
</script>

<style>

</style>