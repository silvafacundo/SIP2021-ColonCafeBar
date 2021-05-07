<template>
	<div class="user-container">
		<label>{{ user.name }}</label>
		<ul class="roles">
			<li v-for="(role, index) of user.roles" :key="index">
				<p class="role-name">{{ role }}</p>
			</li>
		</ul>
		<button class="add-role">+</button>
	</div>
</template>


<script>

export default {
	components: {

	},
	props: {
		user: {
			type: Object,
			required: true,
		}
	},
	data() {
	},
}

</script>

<style scoped lang="scss">
	div.user-container {
		display: flex;
		background-color: var(--blanco);

        label {
            font-size:1.2em;
        }
		ul {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;

			.roles {
				border: 2px solid var(--rojo);
				padding: 0.6rem 2rem;
				border-radius: 5px;
			}
		}
		.add-role{
			padding: 1em;
			background-color: var(--rojo);
			border-radius:5px;
		}
	}

</style>

