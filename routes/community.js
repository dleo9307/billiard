var db = require('../config/db');
var sql = require('../config/sql');

module.exports = function (router) {
    //게시물리스트
    router.all('/community', function (req, res) {
        db.get().query(sql.selectAllBoard, function (err, result) {
            if (err) {
                console.error('게시판 불러오기 중 에러 발생 : ' + err.stack);
                res.writeHead('400', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h2>게시판 불러오기 중 에러 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();
                return;
            }
            else {
                res.render('community', { boardInfo: result });
            }
        });
    });

    //게시물 상세내용
    router.all('/view_community', function (req, res) {
        //게시물 번호를 get방식으로 받음
        var num = req.param('num');

        db.get().query(sql.updateClickView, num,function(err,result){
            if(err){
                console.error('게시판 조회 중 에러 발생 : ' + err.stack);
                res.writeHead('400', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h2>게시판 조회 중 에러 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();
                return;
            }
            else return;
        });

        db.get().query(sql.selectBoard, num, function (err, result) {
            if (err) {
                console.error('게시판 읽기 중 에러 발생 : ' + err.stack);

                res.writeHead('400', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h2>게시판 읽기 중 에러 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();
                return;
            }
            else if (result) {
                db.get().query(sql.selectBoardComment, num, function (err2, result2) {
                    if (err2) {
                        console.error('댓글 불러오기 중 에러 발생 : ' + err2.stack);
                        res.writeHead('400', { 'Content-Type': 'text/html;charset=utf8' });
                        res.write('<h2>댓글 불러오기 중 에러 발생</h2>');
                        res.write('<p>' + err2.stack + '</p>');
                        res.end();
                        return;
                    }
                    else {
                        res.render('view_community', { boardInfo: result, comment: result2 });
                    }

                });
            }
        });
    });

    //게시물 쓰기 화면
    router.post('/write_community', function (req, res) {
        res.render('write_community');
    });

    router.post('/modify_community', function (req, res) {
        var num = req.body.num;

        db.get().query(sql.selectBoard, num, function (err, result) {
            if (err) {
                console.error('게시물 불러오기중 에러 발생 : ' + err.stack);
                res.writeHead('400', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h2>게시물 불러오기중 에러 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();
                return;
            }
            else
                res.render('modify_community', { boardInfo: result,num: num});
        });
    });


    router.route('/process/write_community').post(function (req, res) {
        console.log('/process/write_community 호출됨');

        var title = req.body.community_title;
        var content = req.body.community_contents;
        var id = req.user.user_id;

        db.get().query(sql.insertCommunity, [title, content, id], function (err, result) {
            if (err) {
                console.error('게시물 추가 중 에러 발생 : ' + err.stack);
                res.writeHead('400', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h2>게시물 추가 중 에러 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();
                return;
            }
            else {
                res.send("<script>alert('게시물추가가 완료되었습니다.');location.href='/community'</script>");
                console.log('게시물 추가완료.');
            }
        });
    });


    router.route('/process/community_comment').post(function (req, res) {
        console.log('/process/community_comment 호출됨');

        var num = req.body.num;
        var content = req.body.community_comment;
        var id = req.user.user_id;

        db.get().query(sql.insertCommunityComment, [id, content, num], function (err, result) {
            if (err) {
                console.error('댓글 추가 중 에러 발생 : ' + err.stack);
                res.writeHead('400', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h2>댓글 추가 중 에러 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();
                return;
            }
            else {
                res.send("<script>alert('댓글추가가 완료되었습니다.');" + "location.href='/view_community?num=" + num + "'</script>");
                console.log('댓글 추가완료.');
            }
        });
    });

    router.route('/process/deleteBoard').post(function (req, res) {
        var num = req.param('num');

        db.get().query(sql.deleteBoard, num, function (err, result) {
            if (err) {
                console.error('게시물 삭제 중 에러 발생 : ' + err.stack);
                res.writeHead('400', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h2>게시물 삭제 중 에러 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();
                return;
            }
            else {
                res.send("<script>alert('게시물이 삭제되었습니다.');location.href='/community'</script>");
                console.log('게시물 삭제완료.');
            }
        });
    });

    router.route('/process/del_community_comment').post(function (req, res) {

        var num = req.param('num');
        var page = req.param('page');

        db.get().query(sql.deleteBoardComment, num, function (err, result) {
            if (err) {
                console.error('댓글 삭제 중 에러 발생 : ' + err.stack);
                res.writeHead('400', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h2>댓글 삭제 중 에러 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();
                return;
            }
            else {
                res.send("<script>alert('댓글이 삭제되었습니다.');" + "location.href='/view_community?num=" + page + "'</script>");
                console.log('댓글 삭제완료.');
            }
        });
    });

    router.route('/process/modify_community').post(function (req, res) {
        console.log('/process/modify_community 호출됨');

        var num = req.body.num
        var title = req.body.community_title;
        var content = req.body.community_contents;
     

        db.get().query(sql.modifyBoard, [title, content,num], function (err, result) {
            if (err) {
                console.error('게시물 추가 중 에러 발생 : ' + err.stack);
                res.writeHead('400', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h2>게시물 추가 중 에러 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();
                return;
            }
            else {
                res.send("<script>alert('게시물수정 완료');location.href='/community'</script>");
                console.log('게시물 추가완료.');
            }
        });
    });

    /*function addboard(title, content, id, callback) {
        console.log("addboard 호출됨");

        db.get().query(sql.insertCommunity, [title, content, id], function (err, result) {
            if (err) {
                console.log('게시물 추가중 에러발생');
                callback(err, null);
                return;
            }
            else {
                console.log('게시물 추가완료');
                callback(null, result);
            }
        });
    }*/
}