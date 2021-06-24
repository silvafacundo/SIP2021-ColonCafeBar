<template>
	<div class="help-container">
		<h2>Ayuda</h2>
		<div class="question-container">
		<b-collapse class="card card-container" animation="slide" aria-id="contentIdForA11y3"
			v-for="(item, key) in items"
			:key="key" >
				<template #trigger="props">
					<div
						class="card-header"
						role="button"
						aria-controls="contentIdForA11y3">
						<p class="card-header-title">
							{{ item.question }}
						</p>
						<a class="card-header-icon">
							<b-icon
								:icon="props.open ? 'caret-down' : 'caret-up'">
							</b-icon>
						</a>
					</div>
				</template>

			<div class="card-content">
				<div class="content">
					{{ item.answer }}
				</div>
			</div>
		</b-collapse>
		</div>
	</div>
</template>

<script>
import data from '../assets/utils/questions.js';

export default {
	name: 'Help',

	computed: {
		items(){
			return data.map((item) => {
				return item
			})
		}
	}
}
</script>

<style scoped lang="scss">
.help-container{
	width: 90vw;
	margin:auto;

	h2{
		color:white;
		text-align: center;
		text-transform: uppercase;
	}
	.question-container{
		margin-top:2em;
	}

	.card-container{
		margin-top:1em;
		user-select: none;
	}
	.question{
		font-size: 1.2em;
		color:white;
	}

	.answer{
		color:white;
	}
}
</style>
