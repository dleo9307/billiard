var db = require('../config/db');
var sql = require('../config/sql');
var multer = require('multer');
var storage = multer.diskStorage({
    destination: './public/photo/gallery/',
    filename: function (req, file, callback) {
        var name = Date.now() + '-' + file.originalname;
        callback(null, name);
    }
});
var upload = multer({ storage: storage });
var fs = require('fs');

module.exports = function (router) {
    
    router.all('/gallery', function (req, res) {
        if (!req.isAuthenticated()) {
            console.log("Guest 유저 입니다.");
            res.send("<script>alert('로그인을 해주세요.');location.href='/login'</script>");
            return;
        }
        console.log("gallery 호출");
        viewGallery(function (err, result) {
            if (err) {
                console.error('DB 연결 에러 : ' + err.stack);
                res.writeHead('400', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h2>DB 연결 중 에러 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();
                return;
            }
            else if (result) {
                console.log('DB 연결 완료');
                res.render('gallery', { galleryinfo: result });
            }
        });
    });

    router.all('/view_gallery', function (req, res) {
        if (!req.isAuthenticated()) {
            console.log("Guest 유저 입니다.");
            res.send("<script>alert('로그인을 해주세요.');location.href='/login'</script>");
            return;
        }
        var num = req.query.num;
        selectGallery(num, function (err, result) {
            if (err) {
                console.error('select 중 에러 : ' + err.stack);
                res.writeHead('400', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h2>select 중 에러 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();
                return;
            }
            else if(result){
                console.log("select 성공");
                console.dir(result);
                db.get().query(sql.selsectcom, [num], function (err, result2) {
                    if (err) {
                        console.error('댓글 select 중 에러 : ' + err.stack);
                        res.writeHead('400', { 'Content-Type': 'text/html;charset=utf8' });
                        res.write('<h2>댓글 select 중 에러 발생</h2>');
                        res.write('<p>' + err.stack + '</p>');
                        res.end();
                        return;
                    }
                    else if (result2) {
                        console.log('댓글 select 성공');
                        res.render('view_gallery', { viewinfo: result, commentinfo: result2 });
                    }
                });
            }
        });
    });

    router.post('/write_gallery', function (req, res) {
        if (!req.isAuthenticated()) {
            console.log("Guest 유저 입니다.");
            res.send("<script>alert('로그인을 해주세요.');location.href='/login'</script>");
            return;
        }
        console.log("write_gallery 호출");
        res.render('write_gallery');
    });

    router.all('/delete_gallery', function (req, res) {
        if (!req.isAuthenticated()) {
            console.log("Guest 유저 입니다.");
            res.send("<script>alert('로그인을 해주세요.');location.href='/login'</script>");
            return;
        }
        var num = req.query.num;
        var path = req.query.path;
        console.log("delete_gallery 호출");

        db.get().query(sql.delgall, [num], function (err, result) {
            if (err) {
                console.error('gallery 삭제 중 에러발생 : ' + err.stack);
                res.writeHead('400', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h2>gallery 삭제 중 에러 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();
                return;
            }
            else if (result) {
                console.log("gallery 삭제 완료");
                fs.unlink(path);
                res.send("<script>location.href='/gallery'</script>");
            }
        });
    });

    router.all('/regist_comment', function (req, res) {
        if (!req.isAuthenticated()) {
            console.log("Guest 유저 입니다.");
            res.send("<script>alert('로그인을 해주세요.');location.href='/login'</script>");
            return;
        }
        console.log('/regist_comment 호출');

        var name = res.locals.currentUser.user_id;
        var comment = req.body.gallery_comment;
        var num = req.query.num;

        db.get().query(sql.reg_comment, [name, comment, num], function (err, result) {
            if (err) {
                console.error('댓글 추가 중 에러발생 : ' + err.stack);
                res.writeHead('400', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h2>댓글 추가 중 에러 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();
                return;
            }
            else if (result) {
                console.log("댓글 추가 완료");
                res.send("<script>location.href='/gallery'</script>");
            }
        });
    });

    router.all('/delete_comment', function (req, res) {
        if (!req.isAuthenticated()) {
            console.log("Guest 유저 입니다.");
            res.send("<script>alert('로그인을 해주세요.');location.href='/login'</script>");
            return;
        }
        var num = req.query.num;

        console.log("delete_comment 호출");

        db.get().query(sql.delgcom, [num], function (err, result) {
            if (err) {
                console.error('댓글 삭제 중 에러발생 : ' + err.stack);
                res.writeHead('400', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h2>댓글 삭제 중 에러 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();
                return;
            }
            else if (result) {
                console.log("댓글 삭제 완료");
                res.send("<script>location.href='/gallery'</script>");
            }
        });
    });

    router.route('/process/reg').post(upload.array('photo', 1), function (req, res) {
        if (!req.isAuthenticated()) {
            console.log("Guest 유저 입니다.");
            res.send("<script>alert('로그인을 해주세요.');location.href='/login'</script>");
            return;
        }
        console.log('/process/reg 호출됨');

        var newtitle = req.body.photo_title;
        var newname = req.body.fileName;
        try {
            var files = req.files;

            console.dir('#===== 업로드된 첫번째 파일 정보 =====#')
            console.dir(req.files[0]);
            console.dir('#=====#')
            
            var originalname = '',
                filename = '',
                mimetype = '',
                size = 0;

            if (Array.isArray(files)) {
                console.log("배열에 들어있는 파일 갯수 : %d", files.length);

                for (var index = 0; index < files.length; index++) {
                    originalname = files[index].originalname;
                    filename = files[index].filename;
                    mimetype = files[index].mimetype;
                    size = files[index].size;
                }

            } else { 
                console.log("파일 갯수 : 1");

                originalname = files[index].originalname;
                filename = files[index].name;
                mimetype = files[index].mimetype;
                size = files[index].size;
            }

            console.log('현재 파일 정보 : ' + originalname + ', ' + filename + ', ' + mimetype + ', ' + size);
            addGallery(newtitle, filename, function (err, result) {
                if (err) {
                    console.error('DB 추가중 에러발생 : ' + err.stack);
                    res.writeHead('400', { 'Content-Type': 'text/html;charset=utf8' });
                    res.write('<h2>DB 추가 중 에러 발생</h2>');
                    res.write('<p>' + err.stack + '</p>');
                    res.end();
                    return;
                }
                else if (result) {
                    res.send("<script>location.href='/gallery'</script>");
                    console.log('등록완료.');
                }
            });

        } catch (err) {
            console.dir(err.stack);
        }
    });


    function addGallery(title, name, callback) {
        console.log("addGallery 호출됨");
        pathname = "public/photo/gallery/" + name
        db.get().query(sql.insertgall, [pathname, title], function (err, result) {
            if (err) {
                callback(err, null);
                return;
            }
            else {
                callback(null, result);
            }
        });
    };

    function addGallery(title, name, callback) {
        console.log("addGallery 호출됨");
        pathname = "public/photo/gallery/" + name
        db.get().query(sql.insertgall, [pathname, title], function (err, result) {
            if (err) {
                callback(err, null);
                return;
            }
            else {
                callback(null, result);
            }
        });
    };

    function viewGallery(callback) {
        console.log("viewGallery 호출됨");

        db.get().query(sql.viewgall, function (err, result) {
            if (err) {
                callback(err, null);
                return;
            }
            else {
                callback(null, result);
            }
        });
    };

    function selectGallery(num, callback) {
        console.log("selectGallery 호출됨");
        db.get().query(sql.selectgall, [num], function (err, result) {
            if (err) {
                callback(err, null);
                return;
            }
            else {
                callback(null, result);
            }
        });
    };
}