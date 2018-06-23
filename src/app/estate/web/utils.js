var glob = require('glob');
var path = require('path');

/*
pickFiles({
  id: /([^\/]+).js$/,
  pattern: './src/base/*.js',
});
*/
exports.pickFiles = function(options) {
    var files = glob.sync(options.pattern);
    return files.reduce(function(data, filename) {
        var matched = filename.match(options.id);
        var name = matched[1];
        data[name] = path.resolve(__dirname, filename);
        return data;
    }, {});
};

exports.fullPath = function(dir) {
    return path.resolve(__dirname, dir);
};

exports.getIP = function() {
    let os = require('os');
    let IPv4 = '127.0.0.1';
    let find = false;
    let interfaces = os.networkInterfaces();
    for (let key in interfaces) {
        interfaces[key].some(function(details) {
            if (details.family == 'IPv4' && !details.internal) {
                if(find) return false;
                find = true
                IPv4 = details.address;
                console.log(IPv4);
                return false;
            }
        });
    }
    return IPv4;
    // return 'zjb.glodon.com';
}