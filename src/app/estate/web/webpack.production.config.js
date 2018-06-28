const webpack = require('webpack')
const path = require('path')
// const hwp = require('html-webpack-plugin')
// const ExtractTextPlugin = require('extract-text-webpack-plugin')
const appDirectory = path.resolve(__dirname, '../')

// This is needed for webpack to compile JavaScript.
// Many OSS React Native packages are not compiled to ES5 before being
// published. If you depend on uncompiled packages they may cause webpack build
// errors. To fix this webpack can be configured to compile to the necessary
const babelLoaderConfiguration = {
    test: /(\.jsx|\.js)$/,
    include: [
        path.resolve(appDirectory, 'node_modules/react-native-safe-area-view'),
        path.resolve(appDirectory, 'node_modules/react-navigation'),
        path.resolve(appDirectory, 'node_modules/antd-mobile'),
        // path.resolve(appDirectory, 'node_modules/react-native-image-zoom-viewer')
        path.resolve(appDirectory, 'src'),
        path.resolve(appDirectory, 'index.web.js'),
    ],
    use: {
        loader: 'babel-loader',
        options: {
            cacheDirectory: false,
            plugins: [
                'react-native-web',
                ['import', { style: 'css', libraryName: 'antd-mobile' }],
                [
                    "transform-runtime",
                    {
                      "helpers": false,
                      "polyfill": false,
                      "regenerator": true,
                      "moduleName": "babel-runtime"
                    }
                ],
            ],
            presets: ['react-native'],
        },
    },
}
const imageLoaderConfiguration = {
    test: /\.(gif|jpe?g|png|svg)$/,
    use: {
        loader: 'url-loader',
        options: {
            limit:1,
            name: '/imgs/[name].[ext]',
        },
    },
}

const cssLoaderConfiguration = {
    test: /\.css$/,
    use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
}

const urlLoaderConfiguration = {
    loader: 'url-loader',
    options: {
        mimetype: 'image/png',
        limit:1,
        name: '/imgs/[name].[ext]',
    },
}
var config = {
    mode: 'production',
    // devtool: 'cheap-module-source-map',//source-map
    // mode: 'development',
    // devtool: 'source-map',
    entry: path.resolve(appDirectory, 'index.web.js'),
    
    output: {
        // filename: 'bundle.web.js',
        filename: '[name].bundle.js',
        chunkFilename: '[name].bundle.js',
        path: path.resolve(appDirectory, './dist/product'),
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                myVendor: { 
                    test: /src\/node_modules\//,
                    name: 'myVendor',
                    priority: 10,
                    enforce: true,
                    chunks: 'all',
                },
                andtMobile: { 
                    test: /[\\/]node_modules\/antd-mobile[\\/]/,
                    name: 'andtMobile',
                    priority: 9,
                    enforce: true,
                    chunks: 'all',
                },
                reactNativeWeb: { 
                    test: /[\\/]node_modules\/react-native-web[\\/]/,
                    name: 'reactNativeWeb',
                    priority: 9,
                    enforce: true,
                    chunks: 'all',
                },
                vendor: { 
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    priority: 1,
                    enforce: true,
                    chunks: 'all',
                },
            }
        },
        runtimeChunk: {
            name: 'manifest'
        }
    },
    // devServer: {
    //     contentBase: './dist',
    //     historyApiFallback: true,
    //     inline: true,
    //     hot: true,
    //     progress: true,
    // },

    module: {
        rules: [
            babelLoaderConfiguration,
            cssLoaderConfiguration,
            imageLoaderConfiguration,
            // urlLoaderConfiguration,
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(
                process.env.NODE_ENV || 'production'
            ),
            __DEV__: process.env.NODE_ENV === 'development' || false,
        }),
        // new webpack.optimize.LimitChunkCountPlugin({
        //     maxChunks: 5, // Must be greater than or equal to one
        //     minChunkSize: 100
        //   }),
        // new hwp(),
        // new ExtractTextPlugin("styles.css"),
    ],
    
    resolve: {
        extensions: ['.web.js', '.js'],
    },
};
module.exports = config;