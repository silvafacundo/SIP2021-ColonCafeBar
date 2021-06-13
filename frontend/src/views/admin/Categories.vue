<template>
	<div class="container">
		<h3>Categorías</h3>
		<b-table :data="categories">
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
					@change="editName(props.row.id, $event)" />
			</b-table-column>
			<b-table-column v-slot="props" label="Acciones">
				<b-button type="is-danger"
					size="is-small"
					@click="() => deleteCategory(props.row.id)">
					Eliminar
				</b-button>
			</b-table-column>
		</b-table>
		<div class="new-category">
			<h3>Agregar nueva categoría</h3>
			<form @submit.prevent="createCategory">
				<div>
					<label for="permissionKey"> Nombre: </label>
					<input id="permissionKey"
						v-model="name"
						type="text"
						name="permissionKey">
				</div>
				<input type="submit" value="Crear">
			</form>
		</div>
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
			name: '',
			error: '',
		}
	},
	computed: {
		categories() {
			return this.$store.getters['Products/categories'];
		},
	},
	mounted() {
		this.fetchCategories();
	},
	methods: {
		async fetchCategories() {
			this.isLoading = true;
			try {
				await this.$store.dispatch('Products/fetchCategories');
			} catch (err) {
				this.$showToast('Error al cargar los usuarios', true);
			}
			this.isLoading = false;
		},
		async editName(id, name) {
			try {
				await this.$store.dispatch('Products/updateCategory', { categoryId: id, name });
			} catch (err) {
				this.$showToast('Error al cambiar el nombre de la categoría', true);
			}
			this.$showToast('Nombre modificado con éxito');
		},
		async deleteCategory(id) {
			this.$buefy.dialog.confirm({
				title: 'Deshabilitando una categoría',
				message: '<b>¿Seguro que desea deshabilitar a este categoría?</b><br><b>Recuerda que solo las categorías que no tienen asociado ningún producto pueden ser deshabilitadas</b>',
				confirmText: 'Sí',
				cancelText: 'Cancelar',
				type: 'is-danger',
				hasIcon: true,
				onConfirm: () => this._deleteCategory(id),
			});
		},
		async _deleteCategory(id) {
			try {
				await this.$store.dispatch('Products/deleteCategory', { categoryId: id });
			} catch (err) {
				this.$showToast('Error al eliminar la categoría', true);
			}
		},
		async createCategory() {
			this.isLoading = true;
			const name = this.name;
			this.name = '';

			try {
				await this.$store.dispatch('Products/createCategory', { name })
			} catch (err) {
				this.$showToast('Error al crear la categoría', true);
			}
			this.isLoading = false;
		},
	}
}
</script>

<style scoped lang="scss">
	h3{
		font-size: 1em;
		margin-top:1em;
	}
	.new-category{
		margin-top:2em;

		h3{
			margin-top: 0em;
		}
	}

	form{
		padding: 1em;
		background-color: var(--blanco);
		border-top: 2px solid var(--negro);
		border-radius: 5px;
		display: flex;
		align-items: center;

		div{
			width:80%;

			input[type=text] ,label{
				margin-left: 1em;
			}

			input[type=text]{
				width:80%;
			}
		}
		input[type=submit]{
			padding:.2em 1.5em;
			background-color: var(--verde-ok);
			border-radius:5px;
			color:var(--blanco);
			font-size: 1em;
			width:20%;
		}

		input[type=submit]:hover{
			background-color:var(--verde-oscuro);
			cursor:pointer;
		}
	}

	@media (max-width: 900px){
		div.container{
			padding: 0;
			width: 95%;
		}
		form{
			display: block;

			div{
				display: flex;
				width: 100%;
				align-items: center;

				input[type=text] ,label{
					margin: 0em;
				}
				input[type=text]{
					margin-left: 1em;
				}
			}
			input[type=submit]{
				margin: 0em;
				margin-top:1em;
				width: 100%;
			}
		}
	}
</style>