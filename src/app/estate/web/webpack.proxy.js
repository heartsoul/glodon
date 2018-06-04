var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');
var utils = require('./utils');

var PORT = 8099;
var HOST = utils.getIP();
// HOST = '127.0.0.1';
var args = process.argv;

var hot = args.indexOf('--hot') > -1;
var deploy = args.indexOf('deploy') > -1;


// 本地环境静态资源路径
// var localPublicPath = 'http://' + HOST + ':' + PORT + '/';

// config.output.publicPath = localPublicPath;

// if (config.entry.index) {
//     config.entry.index.unshift('webpack-dev-server/client?' + localPublicPath);
//     //config.entry.index.unshift("mocha!../scr/pages/test.js");
//     // 开启热替换相关设置
//     if (hot === true) {
//         config.entry.index.unshift('webpack/hot/only-dev-server');
//         // 注意这里 loaders[0] 是处理 .js 文件的 loader
//         //config.module.loaders[0].loaders.unshift('react-hot');
//         config.plugins.push(new webpack.HotModuleReplacementPlugin());
//     }
// }

// // see http://webpack.github.io/docs/build-performance.html#sourcemaps
// config.devtool = '#eval-cheap-module-source-map';

// 本地联调common 模块参数
// var frame = args.join("\n").split('frame=')[1];
// frame = frame ? frame.split('\n')[0] : frame;
// var frameUrl = frame ? frame.replace('\'', '').replace('\'', '') : 'http://10.1.83.30';
// var common = args.join("\n").split('common=')[1];
// var commonUrl = common ? common.replace('\'', '').replace('\'', '') : 'http://10.1.83.30';


// 获取代理服务器的数据
var proxy = args.join("\n").split('proxy=')[1];
if (proxy) {
    proxy = proxy.split("\n")[0].replace(/["']/gi, "");
}
var ip = args[args.length - 1];
if (proxy && ip.match(/^(\d+\.)+\d+$/)) {
    var count = ip.split(".").length;
    switch (count) {
        case 4:
            proxy = proxy.replace(/(.+\/)(\d+\.\d+\.\d+\.\d+)(\:.+)/gi, "$1" + ip + "$3");
            break;
        case 3:
            proxy = proxy.replace(/(.+\.)(\d+\.\d+\.\d+)(\:.+)/gi, "$1" + ip + "$3");
            break;
        default:
            proxy = proxy.replace(/(.+\.)(\d+\.\d+)(\:.+)/gi, "$1" + ip + "$3");
            break;
    }
    console.error("using proxy: " + proxy);
}
new WebpackDevServer(webpack(config), {
    hot: hot,
    inline: true,
    compress: true,
    disableHostCheck: true,
    open: true,
    contentBase: './dist',
    progress: true,
   
    // stats: {
    //     chunks: false,
    //     children: false,
    //     colors: true
    // },
    // Set this as true if you want to access dev server from arbitrary url.
    // This is handy if you are using a html5 router.
    historyApiFallback: true,
}).listen(PORT, HOST, function(err) {

});