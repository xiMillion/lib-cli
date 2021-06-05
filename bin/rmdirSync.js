const fs = require( 'fs' );
module.exports = function(url){
    var del = function (url){
        var files = [];
            files = fs.readdirSync(url);
            for (var i = 0; i < files.length; i++) {
                var path = url + '/' + files[i];
                if (fs.statSync(path).isFile()) {
                    fs.unlinkSync(path);
                } else {
                    del(path);
                }
            }
            fs.rmdirSync(url);
    };
    del(url)
}