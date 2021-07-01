<template>
	<div class="stat" :class="{ 'standalone-stat': isStandalone }">
		<div class="stat-header">
			<h4 class="stat-name">{{ name }}</h4>

			<span class="stat-icon" :style="`background-color: ${color};`">
				<b-tooltip class="tooltip-metric"
					multilined
					animated
					:type="type"
					:label="label"
					:active="active"
					:position="tooltipPosition">
					<b-icon v-if="icon"
						:icon="`${icon}`"
						:pack="`${pack}`" />
				</b-tooltip>
			</span>
		</div>

		<div v-if="isLoading" class=" pt-3">
			<b-skeleton width="80%" :active="isLoading" />
			<b-skeleton width="40%" :active="isLoading" />
		</div>

		<span class="stat-body">
			<h4 v-if="!isLoading" class="stat-value">{{ niceValue }}  <span v-if="!isNaN(valuePercent)" class="stat-comment">({{ niceValuePercent }})</span> </h4>

		</span>
		<span v-if="!isLoading && hasVariation"
			:class="getFooterClass"
			class="stat-footer">{{ renderPercentage }}</span>
	</div>
</template>

<script>
export default {
	name: 'MetricStat',
	props: {
		isLoading: {
			type: Boolean,
			required: true,
			default: true
		},
		name: {
			type: String,
			default: 'Improvement'
		},
		currentValue: {
			type: Number,
			required: false,
			default: 0
		},
		currentStringValue: {
			type: String,
			required: false,
			default: ''
		},
		previousValue: {
			type: Number,
			required: false
		},
		isPercent: {
			type: Boolean,
			required: false
		},
		isStandalone: {
			type: Boolean,
			default: false
		},
		isString: {
			type: Boolean,
			default: false
		},
		color: {
			type: String,
			default: 'none'
		},
		label: {
			type: String,
			default: 'none'
		},
		type: {
			type: String,
			default: 'none'
		},
		active: {
			type: Boolean,
			default: false
		},
		icon: {
			type: String,
			default: 'none'
		},
		pack: {
			type: String,
			default: 'none'
		},
		valuePercent: {
			type: Number,
			required: false
		},
		isCurrency: {
			type: Boolean,
			default: false
		},
		currencyType: {
			type: String,
			default: 'USD'
		},
		tooltipPosition: {
			type: String,
			default: 'is-left'
		},
		hasVariation: {
			type: Boolean,
			default: true
		}
	},
	data: () => ({
	}),
	computed: {
		niceValue() {
			if (this.isCurrency) {
				return this.currentValue.toLocaleString('en-US', {
					style: 'currency',
					currency: this.currencyType
				});
			}

			if (this.isString) {
				return this.currentStringValue;
			}

			const formatter = new Intl.NumberFormat('en-US', {
				minimumFractionDigits: 0,
				maximumFractionDigits: 2,
			});

			const formatted = formatter.format(this.currentValue);

			if (this.isPercent) return `${formatted}%`;
			return formatted;
		},
		percentage() {
			if (isNaN(this.previousValue)) return null;

			if (this.currentValue === this.previousValue) return 0;
			if (this.currentValue > 0 && this.previousValue === 0) return 100;

			return Math.round((this.currentValue / this.previousValue) * 100) - 100;
		},
		getFooterClass() {
			if (this.percentage > 0) return 'stat-positive';
			if (this.percentage < 0) return 'stat-negative';
			return 'stat-neutral';
		},
		renderPercentage() {
			if (isNaN(this.percentage) || this.percentage === 0) return '%0';

			const num = Math.abs(this.percentage);

			if (this.percentage < 0) return `-%${num}`;
			return `%${num}`;
		},
		niceValuePercent() {
			const formatter = new Intl.NumberFormat('en-US', {
				minimumFractionDigits: 0,
				maximumFractionDigits: 2,
			});

			const formatted = formatter.format(this.valuePercent);

			return `${formatted}%`;
		}
	},
	methods: {
	}
};
</script>

<style lang="scss" scoped>
	.stat {
		// align-items: center;
		//margin: 0 1rem;
		display: flex;
		flex-direction: column;
		.stat-header{
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			//font-size: 0.8em;
			.stat-icon{
				width:50px;
				height:50px;
				padding: 13px;
				font-size: 20px;
				margin-left: 5px;
				//text-align: center;
			}
		}


		.stat-body{
			font-size: 1.2em;
			//margin: 10px 0px;
		}

		.stat-footer{
			//font-size: 12px;
			//font-family: CircularStd-Bold;

			&::before{
				content: '→';
				margin-right: 3px;
				width: 5px;
			}
		}

		.stat-comment {
			margin-left: 0.25rem;
			font-size: 70%;
		}

		&.standalone-stat {
			background-color: white;
			-webkit-box-shadow: 0 0px 6px 1.5px rgba(10, 10, 10, 0.02), 0 0px 0 1px rgba(10, 10, 10, 0.05);
			box-shadow: 0 0px 6px 1.5px rgba(10, 10, 10, 0.02), 0 0px 0 1px rgba(10, 10, 10, 0.05);

			display: block;
			padding: 1.25rem;

			background-color: white;
			height: 100%;
			border-radius: 0.25rem;
			//border-left: 6px solid;

			.stat-body {
				//font-size: 2rem;
				.stat-value{margin:0px;}
			}
		}
	}

	.tooltip-metric {
		//width: 10px;
		//align-self: flex-end;
		margin-bottom: -15.56px;
		width: 100%;
		height: 100%;
		.icon{
			margin: auto;
		}
		&::after {
			text-align: left;
		}
	}
</style>
