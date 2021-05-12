module.exports = {
	productionSourceMap: false,
	outputDir: '../backend/public',
	pluginOptions: {
	},
	devServer: {
		port: 8080
	},
	chainWebpack: config => {
		config.plugin('define').tap(definitions => {
			definitions[0] = { ...definitions[0], LAFE_VERSION: JSON.stringify(require('./package.json').version) };

			return definitions;
		});
	},
	css: {
		extract: false
	}
}