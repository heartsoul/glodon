const webpack = require('webpack')
const path = require('path')

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
        path: path.resolve(appDirectory, './dist'),
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                myVendor: { // split `node_modules`目录下被打包的代码到 `page/vendor.js && .css` 没找到可打包文件的话，则没有。css需要依赖 `ExtractTextPlugin`
                    test: /src\/node_modules\//,
                    name: 'myVendor',
                    priority: 10,
                    enforce: true,
                    chunks: 'all',
                },
                andtMobile: { // split `node_modules`目录下被打包的代码到 `page/vendor.js && .css` 没找到可打包文件的话，则没有。css需要依赖 `ExtractTextPlugin`
                    test: /[\\/]node_modules\/antd-mobile[\\/]/,
                    name: 'andtMobile',
                    priority: 9,
                    enforce: true,
                    chunks: 'all',
                },
                reactNativeWeb: { // split `node_modules`目录下被打包的代码到 `page/vendor.js && .css` 没找到可打包文件的话，则没有。css需要依赖 `ExtractTextPlugin`
                    test: /[\\/]node_modules\/react-native-web[\\/]/,
                    name: 'reactNativeWeb',
                    priority: 9,
                    enforce: true,
                    chunks: 'all',
                },
                vendor: { // split `node_modules`目录下被打包的代码到 `page/vendor.js && .css` 没找到可打包文件的话，则没有。css需要依赖 `ExtractTextPlugin`
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
                process.env.NODE_ENV || 'development'
            ),
            __DEV__: process.env.NODE_ENV === 'development' || false,
        }),
        // new webpack.optimize.LimitChunkCountPlugin({
        //     maxChunks: 5, // Must be greater than or equal to one
        //     minChunkSize: 100
        //   }),
    ],
    
    resolve: {
        extensions: ['.web.js', '.js'],
    },
}
module.exports = config;