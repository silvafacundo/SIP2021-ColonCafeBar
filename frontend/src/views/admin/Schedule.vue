<template>
	<div class="container schedule-container">
		<h3>Horarios</h3>
		<b-table :data="schedules">
			<template #empty>
				<div class="empty">
					<h4>No hay horarios</h4>
					<b-button type="is-success" @click="newSchedule">Agregar Horario</b-button>
				</div>
			</template>
			<b-table-column v-slot="props" label="Día de la semana">
				{{ days[props.row.dayOfWeek - 1] }}
			</b-table-column>
			<b-table-column v-slot="props" label="Horario de apertura">
				{{ props.row.openingTime }}
			</b-table-column>
			<b-table-column v-slot="props" label="Horario de cierre">
				{{ props.row.closingTime }}
			</b-table-column>
			<b-table-column v-slot="props">
				<b-button size="is-small" @click="() => selectedSchedule = { ...props.row }">Modificar</b-button>
				<b-button type="is-danger"
					size="is-small"
					@click="() => deleteSchedule(props.row.id)">
					Eliminar
				</b-button>
			</b-table-column>
		</b-table>
		<b-button
			v-if="schedules.length > 0"
			label="Crear horario"
			type="is-success"
			size="default"
			class="register-button"
			@click="newSchedule" />
		<b-modal :active="!!selectedSchedule"
			has-modal-card
			@close="closeModal">
			<div v-if="selectedSchedule"
				class="modal-card"
				style="margin: auto">
				<header class="modal-card-head">
					<p class="modal-card-title">Registrar Horario</p>
				</header>
				<section class="modal-card-body">
					<b-field label="Dia de la semana">
						<b-select v-model="selectedSchedule.dayOfWeek">
							<option v-for="(day, index) in days"
								:key="index"
								:value="index + 1">
								{{ day }}
							</option>
						</b-select>
					</b-field>
					<b-field label="Horario de Apertura" :type="isValid ? '' : 'is-danger'">
						<b-input v-model="selectedSchedule.openingTime" type="time" />
					</b-field>
					<b-field label="Horario de cierre" :type="isValid ? '' : 'is-danger'">
						<b-input v-model="selectedSchedule.closingTime" type="time" />
					</b-field>
					<p v-if="!isValid" class="my-5 has-text-centered has-text-danger">El horario de apertura debe ser menor al de cierre</p>
					<footer class="card-footer">
						<b-button type="is-danger" @click="closeModal">Cancelar</b-button>
						<b-button type="is-success"
							:disabled="!isValid"
							@click="saveSchedule">
							Guardar
						</b-button>
					</footer>
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
			selectedSchedule: null,
			error: '',
			days: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']
		}
	},
	computed: {
		schedules() {
			return this.$store.getters['Schedules/schedules'];
		},
		isValid() {
			if (!this.selectedSchedule) return false;
			const { openingTime, closingTime } = this.selectedSchedule;
			const openingMinutes = this.timeToMinutes(openingTime);
			const closingMinutes = this.timeToMinutes(closingTime);
			return openingMinutes < closingMinutes;
		}
	},
	mounted() {
		this.fetchAdminSchedules();
	},
	methods: {
		timeToMinutes(time) {
			let [hs, mins] = time.split(':');
			hs = Number(hs);
			mins = Number(mins);
			return (hs * 60) + mins;
		},
		async fetchAdminSchedules() {
			try {
				await this.$store.dispatch('Schedules/fetchAdminSchedules');
			} catch (err) {
				this.$showToast('Error al cargar los horarios', true);
			}
		},
		async saveSchedule() {
			try {
				if (this.selectedSchedule.id)
					await this.$store.dispatch('Schedules/updateSchedule', { ...this.selectedSchedule });
				else
					await this.$store.dispatch('Schedules/createSchedule', { ...this.selectedSchedule });
				await this.fetchAdminSchedules();
				this.closeModal();
				this.$showToast('Horario creado con éxito');
			} catch (err) {
				console.error('Failed to register', err);
				if (err && err.response && err.response.data) this.error = err.response.data.message;
				else this.error = 'Ocurrió un error';
				this.$showToast(this.error, true);
			}
		},
		async newSchedule() {
			this.selectedSchedule = {
				dayOfWeek: 1,
				openingTime: '08:00',
				closingTime: '12:00'
			}
		},
		async closeModal() {
			this.selectedSchedule = null
		},
		async deleteSchedule(scheduleId){
			this.$buefy.dialog.confirm({
				title: 'Eliminado un horario',
				message: '<b>¿Seguro que desea eliminar a este horario?</b>',
				confirmText: 'Sí',
				cancelText: 'Cancelar',
				type: 'is-danger',
				hasIcon: true,
				onConfirm: () => this._deleteSchedule(scheduleId),
			});
		},
		async _deleteSchedule(scheduleId){
			try {
				await this.$store.dispatch(`Schedules/deleteSchedule`, { scheduleId });
				await this.fetchSchedule();
				this.$showToast('Horario eliminado con éxito');
			} catch (err) {
				this.$showToast('Error al eliminar el horario');
			}
		}
	}
}
</script>

<style lang="scss" scoped>
	.modal-card-body footer {
		padding: .5rem;
		padding-bottom: 0;
		display: flex;
		justify-content: space-between;
	}
	.empty {
		display: flex;
		padding: 1rem;
		flex-flow:column;
		gap: .5rem;
		justify-content: center;
		align-items: center;
	}
</style>