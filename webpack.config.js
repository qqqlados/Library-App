const currentTask = process.env.npm_lifecycle_event
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const Dotenv = require('dotenv-webpack')
// const fs = require('fs-extra')

config = {
	entry: {
		bundle: path.resolve(__dirname, 'app/App.js'),
	},
	output: {
		publicPath: '/',
		path: path.resolve(__dirname, 'app'),
		filename: 'bundled.js',
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'Webpack App',
			filename: 'index.html',
			template: 'app/index.html',
		}),
		new Dotenv(),
	],
	mode: 'development',
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							'@babel/preset-react',
							['@babel/preset-env', { targets: { node: '12' } }],
						],
					},
				},
			},
			{ test: /\.css$/i, use: ['style-loader', 'css-loader'] },
			{
				test: /\.s[ac]ss$/i,
				use: ['style-loader', 'css-loader', 'sass-loader'],
			},
			{
				test: /\.(png|jpe?g|gif|svg)$/i,
				type: 'asset/resource',
			},
		],
	},
}

if (currentTask == 'dev') {
	config.devtool = 'source-map'
	config.devServer = {
		port: 3000,
		static: {
			directory: path.join(__dirname, 'app'),
		},
		hot: true,
		liveReload: false,
		historyApiFallback: { index: 'index.html' },
	}
}

if (currentTask == 'build') {
	// fs.writeFileSync(
	// 	'./.env',
	// 	`REACT_APP_CLIENT_ID=${process.env.REACT_APP_CLIENT_ID}\n`
	// )
	config.plugins.push(new CleanWebpackPlugin())
	config.mode = 'production'
	config.output = {
		publicPath: '/',
		path: path.resolve(__dirname, 'docs'),
		filename: '[name].[chunkhash].js',
		chunkFilename: '[name].[chunkhash].js',
		clean: true,
		assetModuleFilename: 'images/[name][hash][ext]',
	}
}

module.exports = config
