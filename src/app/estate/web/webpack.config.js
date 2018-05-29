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
    path.resolve(appDirectory, 'index.web.js'),
    path.resolve(appDirectory, 'src'),
    // path.resolve(appDirectory, 'node_modules/react-navigation'),
    path.resolve(appDirectory, 'node_modules/antd-mobile'),
    // path.resolve(appDirectory, 'node_modules/react-native-image-zoom-viewer')
  ],
  use: {
    loader: 'babel-loader',
    options: {
      cacheDirectory: false,
      plugins: [
        // ["transform-runtime"],
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
module.exports = {
  entry: path.resolve(appDirectory, 'index.web.js'),

  output: {
    filename: 'bundle.web.js',
    path: path.resolve(appDirectory, './dist'),
  },

  devServer: {
    contentBase: './dist',
    historyApiFallback: true,
    inline: true,
    hot: true,
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
