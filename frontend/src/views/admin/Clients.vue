<template>
	<div class="container">
		<h3>Clientes</h3>
		<b-input placeholder="Search..."
			:value="filters.query"
			type="search"
			icon="search"
			:loading="isLoading"
			@input="handleSearch" />
		<div class="client-container">
			<Client v-for="(client, index) in clients"
				:key="index"
				:client="client"
				@revokeToken="revokeToken"
				@updatePoints="updatePoints"
				@updateClient="updateClient" />
			<h4 v-if="!isLoading && clients.length <= 0">No se han encontrado resultados...</h4>
		</div>
	</div>
</template>

<script>
import Client from '../../components/admin/Client';
export default {
	name: 'Clients',
	components: {
		Client
	},
	data: () =>({
		clients: [],
		isLoading: false,
		pagination: {
			page: 1,
			perPage: 50
		},
		filters: {
			query: ''
		}
	}),
	computed: {
		filterQuery() {
			return this.filters.query;
		}
	},
	watch: {
		filterQuery(newVal) {
			if (this.$route.query && this.$route.query.search === newVal) return;
			this.$router.replace({ ...this.$route, query: { search: newVal || undefined } });
		}
	},
	mounted() {
		this.filters.query = (this.$route.query && this.$route.query.search) || ''
		this.fetchClients();
		window.addEventListener('scroll', this.handleScroll.bind(this));
	},
	beforeDestroy() {
		window.removeEventListener('scroll', this.handleScroll.bind(this));
	},
	methods: {
		async fetchClients(fromFilters){
			this.isLoading = true;
			try {
				if (fromFilters) {
					this.pagination = {
						...this.pagination,
						page: 1
					}
					this.clients = [];
				}
				const { clients = [], pagination = {} } = await this.$store.dispatch('Client/fetchClients', { ...this.pagination, filters: this.filters });

				this.clients = [...this.clients, ...clients];
				this.pagination = { ...this.pagination, ...pagination, lastPage: clients.length };
			} catch (err) {
				console.log(err);
				this.$showToast('Error al cargar los clientes', true);
			}
			this.isLoading = false;
		},
		async handleSearch(val) {
			this.filters.query = val;
			this.isLoading = true;
			clearTimeout(this.searchTimeout);
			this.searchTimeout = setTimeout(() => {
				this.fetchClients(true);
			}, 500)
		},
		revokeToken(client) {
			this.$buefy.dialog.confirm({
				message: 'Al realizar esta acción dejaras sin uso todos los tokens de acceso hasta el momento de este usuario. ¿Desa continuar?',
				onConfirm: () => this._revokeToken(client.id)
			})
		},
		async _revokeToken(clientId) {
			try {
				await this.$store.dispatch('Client/revokeTokenAccess', { clientId });
				this.$showToast('Tokens revocados correctamente')
			} catch (err) {
				this.$showToast('Error al revocar los tokens de acceso', true)
			}
		},
		updatePoints(client, points) {
			this.$buefy.dialog.confirm({
				message: `Los puntos de ${client.email} serán: ${points}. ¿Desea continuar?`,
				onConfirm: () => this._updatePoints(client.id, points)
			})
		},
		async _updatePoints(clientId, points) {
			try {
				await this.$store.dispatch('Client/updatePoints', { clientId, points });
				this.$showToast('Puntos actualizados correctamente')
			} catch (err) {
				this.$showToast('Error al actualizar los puntos', true)
			}
		},
		updateClient({ client, isActive }) {
			if (!isActive) this.deleteClient(client);
			else this.activateClient(client);
		},
		deleteClient(client) {
			this.$buefy.dialog.confirm({
				message: `Al realizar esta acción estarás dando de baja al cliente y no podrá volver a iniciar sesión. ¿Desea continuar?`,
				onConfirm: () => this._deleteClient(client.id)
			})
		},
		async _deleteClient(clientId) {
			try {
				await this.$store.dispatch('Client/adminUpdateClient', { clientId, isActive: false });
				this.fetchClients(true);
				this.$showToast('Cliente dado de baja con éxito');
			} catch (err) {
				this.$showToast('Error al eliminar el cliente', true);
			}
		},
		activateClient(client) {
			this.$buefy.dialog.confirm({
				message: `Al realizar esta acción estarás dando de alta al cliente. ¿Desea continuar?`,
				onConfirm: () => this._activateClient(client.id)
			})
		},
		async _activateClient(clientId) {
			try {
				await this.$store.dispatch('Client/adminUpdateClient', { clientId, isActive: true });
				this.fetchClients(true);
				this.$showToast('Cliente dado de alta con éxito');
			} catch (err) {
				this.$showToast('Error al dar de alta al cliente', true);
			}
		},
		handleScroll() {
			const element = this.$el;
			const isLastPage = this.page >= Math.ceil(this.pagination.total / this.pagination.perPage);
			if (this.pagination.lastPage < this.pagination.perPage || isLastPage) return;
			if ( Math.floor(element.getBoundingClientRect().bottom) <= window.innerHeight && !this.isLoading) {
				this.pagination = { ...this.pagination, page: this.pagination.page + 1 };
				this.fetchClients()
			}
		}

	}
}
</script>

<style>

</style>