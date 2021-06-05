const fs = require( 'fs' );
const path = require('path');

// 复制文件
function copyFile(srcPath, tarPath, cb) {
    var rs = fs.createReadStream(srcPath)
    rs.on('error', function (err) {
        if (err) {
            console.log('read error', srcPath)
        }
        cb && cb(err)
    })
 
    var ws = fs.createWriteStream(tarPath)
    ws.on('error', function (err) {
        if (err) {
            console.log('write error', tarPath)
        }
        cb && cb(err)
    })
 
    ws.on('close', function (ex) {
        cb && cb(ex)
    })
 
    rs.pipe(ws)
    console.log("extract---", srcPath)
}

// 复制文件夹所有
function copyDir(srcDir, tarDir, cb) {
    if (fs.existsSync(tarDir)) {
        fs.readdir(srcDir, function (err, files) {

            var count = 0
            var checkEnd = function () {
               // console.log("进度", count)
                ++count == files.length && cb && cb()
            }
 
            if (err) {
                checkEnd()
                return
            }
 
            files.forEach(function (file) {
                var srcPath = path.join(srcDir, file)
                var tarPath = path.join(tarDir, file)
 
                fs.stat(srcPath, function (err, stats) {
                    if (stats.isDirectory()) {
                        fs.mkdir(tarPath, function (err) {
                            if (err) {
                                console.log(err)
                                return
                            }
 
                            copyDir(srcPath, tarPath, checkEnd)
                            console.log("extract---", srcPath)
                        })
                    } else {
                        copyFile(srcPath, tarPath, checkEnd)
                        console.log("extract---", srcPath)
                    }
                })
            })
 
            //为空时直接回调
            files.length === 0 && cb && cb()
        })
 
    } else {
        fs.mkdir(tarDir, function (err) {
            if (err) {
                console.log(err)
                return
            }
            copyDir(srcDir, tarDir, cb)
        })
    }
 
}

module.exports = copyDir;