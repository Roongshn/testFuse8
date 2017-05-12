const NODE_ENV = process.env.NODE_ENV || 'development';

var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    watch: NODE_ENV === 'development',
    watchOptions: {
        aggregateTimeout: 100,
    },

    context: __dirname,

    entry: {
        index: ['babel-polyfill', './js/index.js'],
        styles: './css/styles.less',
    },

    output: {
        filename: '[name].js',
        path: "./public",
        library: '[name]',
    },
    resolve: {
        extensions: ['', '.js'],
    },
    cache: true,
    devtool: (NODE_ENV === 'development') ? 'cheap-module-source-map' : null,
    module: {
        loaders: [
            {
                test: /.+(?:js)+.+\.js$/,
                loader: 'babel',
                exclude: /(node_modules|bower_components)/,
                query: {
                    presets: ["es2015", "stage-0"],
                },
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract(
                    "style-loader",
                    (NODE_ENV === 'development') ? "css!less" : "css?!autoprefixer?browsers=last 30 version!less"
                )
            },
            {
                test: /\.(svg|ttf|eot|woff|woff2)$/,
                loader: 'file?name=fonts/[name]/[name].[ext]?[hash]',
            },
            {
                test: /\.(jpg|png)$/,
                loader: 'file?name=i/[name].[ext]?[hash]',
            },
        ],
    },
    plugins: [
        new ExtractTextPlugin('styles.css'),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './index.html',
            inject: false,
            hash: true,
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
        }),
    ],
};
