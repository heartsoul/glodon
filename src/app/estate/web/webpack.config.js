const webpack = require('webpack')
const path = require('path')
// const hwp = require('html-webpack-plugin')
// const etwp = require('extract-text-webpack-plugin')
// const vConsolePlugin = require('vconsole-webpack-plugin');
const appDirectory = path.resolve(__dirname, '../')
const {BASE_URL_PROXY,UPLOAD_URL_PROXY} = require('./../src/common/constant/server-config.proxy.web')
var ___SERVER = BASE_URL_PROXY;
var ___SERVER_UP = UPLOAD_URL_PROXY;
var utils = require('./utils');
var HOST = utils.getIP();

// This is needed for webpack to compile JavaScript.
// Many OSS React Native packages are not compiled to ES5 before being
// published. If you depend on uncompiled packages they may cause webpack build
// errors. To fix this webpack can be configured to compile to the necessary
const babelLoaderConfiguration = {
    test: /(\.jsx|\.js)$/,
    include: [
        path.resolve(appDirectory, 'node_modules/react-native-safe-area-view'),
        path.resolve(appDirectory, 'node_modules/teaset'),
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
                [
                    "transform-runtime",
                    {
                      "helpers": false,
                      "polyfill": false,
                      "regenerator": true,
                      "moduleName": "babel-runtime"
                    }
                ],
                ['import', { style: 'css', libraryName: 'antd-mobile' }],
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
    // mode: 'production',
    mode: 'development',
    entry: path.resolve(appDirectory, 'index.web.js'),
    // devtool: 'eval-source-map',//source-map
 
    output: {
        // filename: 'bundle.web.js',
        filename: '[name].bundle.js',
        chunkFilename: '[name].bundle.js',
        path: path.resolve(appDirectory, './dist/dev'),
    },
    optimization: {
        splitChunks: {
            chunks: 'all', // 只对入口文件处理
            cacheGroups: {
                myVendor: { //
                    test: /src\/node_modules\//,
                    name: 'myVendor',
                    priority: 8,
                    enforce: true,
                    chunks: 'all',
                },
                andtMobile: { // 
                    test: /[\\/]node_modules\/antd-mobile[\\/]/,
                    name: 'andtMobile',
                    priority: 9,
                    enforce: true,
                    chunks: 'all',
                },
                reactNativeWeb: { // 
                    test: /[\\/]node_modules\/react-native-web[\\/]/,
                    name: 'reactNativeWeb',
                    priority: 10,
                    enforce: true
                },
                vendor: { // 
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    priority: -10,
                    enforce: true,
                    chunks: 'all',
                },
            }
        },
        runtimeChunk: {
            name: 'manifest'
        }
    },
    devServer: {
        contentBase: './dist/dev',
        historyApiFallback: true,
        inline: true,
        hot: true,
        progress: true,
        host:HOST,
        proxy: {
            '/uaa': {
                target: ___SERVER,
                changeOrigin: true,
                secure: false
            },
            '/uaa/*': {
                target: ___SERVER,
                changeOrigin: true,
                secure: false
            },
            '/pmbasic/*': {
                target: ___SERVER,
                changeOrigin: true,
                secure: false
            },
            '/quality/*': {
                target: ___SERVER,
                changeOrigin: true,
                secure: false
            },
            '/admin/*': {
                target: ___SERVER,
                changeOrigin: true,
                secure: false
            },
            '/backend/*': {
                target: ___SERVER,
                changeOrigin: true,
                secure: false
            },
            '/user/*': {
                target: ___SERVER,
                changeOrigin: true,
                secure: false
            },
            '/model/*': {
                target: ___SERVER,
                changeOrigin: true,
                secure: false
            },
            '/bimpm/*': {
                target: ___SERVER,
                changeOrigin: true,
                secure: false
            },
            '/v1/*': {
                target: ___SERVER_UP,
                changeOrigin: true,
                secure: false
            }, 
        }
    },

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
                process.env.NODE_ENV || 'development'
            ),
            __DEV__: process.env.NODE_ENV === 'development' || true,
        }),
        new webpack.HotModuleReplacementPlugin(),
        // new vConsolePlugin({
        //     filter: [],  // 需要过滤的入口文件
        //     enable: false // 发布代码前记得改回 false
        // }),
    ],
    
    resolve: {
        extensions: ['.web.js', '.js'],
    },
}
module.exports = config;