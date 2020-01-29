const path = require('path')
const webpack = require('webpack')
const HtmlWebPackPlugin = require("html-webpack-plugin")
const Geonames = require('geonames.js')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const WorkboxPlugin = require('workbox-webpack-plugin')


module.exports = {
    entry: './src/client/index.js',
    mode: 'production',
    optimization:{
        minimizer:[new TerserPlugin({}), new OptimizeCSSAssetsPlugin({})],
    },
    module: {
        rules: [
            {
                test: '/\.js$/',
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.(ttf|eot|svg|png|jpg|gif|ico)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader'
              },
            {
                test: /\.scss$/,
                use: [ MiniCSSExtractPlugin.loader ,"css-loader" , "sass-loader" ]
        }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/client/views/index.html",
            filename: "./index.html",
        }),
        new MiniCSSExtractPlugin({filename: '[name].css'}),
        new WorkboxPlugin.GenerateSW()
    ]
}
