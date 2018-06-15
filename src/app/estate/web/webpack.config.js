const webpack = require('webpack')
const path = require('path')

const appDirectory = path.resolve(__dirname, '../')
const {BASE_URL_PROXY,UPLOAD_URL_PROXY} = require('./../src/common/constant/server-config.proxy.web')
var ___SERVER = BASE_URL_PROXY;
var ___SERVER_UP = UPLOAD_URL_PROXY;
var utils = require('./utils');
var PORT = 8099;
var HOST = utils.getIP();
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
                [
                    "transform-runtime",
                    {
                      "helpers": false,
                      "polyfill": false,
                      "regenerator": true,
                      "moduleName": "babel-runtime"
                    }
                ],
                'react-native-web',
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
            name: '[name].[ext]',
            limit:1,
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
    },
}
var config = {
    entry: path.resolve(appDirectory, 'index.web.js'),
    devtool: 'eval-source-map',
    output: {
        filename: 'bundle.web.js',
        path: path.resolve(appDirectory, './dist'),
    },

    devServer: {
        contentBase: './dist',
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
            __DEV__: process.env.NODE_ENV === 'production' || true,
        }),
        new webpack.HotModuleReplacementPlugin(),
    ],

    resolve: {
        extensions: ['.web.js', '.js'],
    },
}
module.exports = config;