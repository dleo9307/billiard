var db=require('../config/db');
var sql=require('../config/sql');

module.exports=function(router,passport){

    //각각의 경로에대해  보여줄 ejs파일을 선택    
    router.all('/',function(req,res){
        res.redirect('/home');
    });

    router.all('/home',function(req,res){
        res.render('home');
    });

    router.all('/3cushion',function(req,res){
        res.render('3cushion');
    });

    router.all('/4ball',function(req,res){
        res.render('4ball');
    });


    router.all('/carom',function(req,res){
        res.render('carom');
    });


    router.all('/history',function(req,res){
        res.render('history');
    });

    router.all('/login',function(req,res){
        res.render('login',{message : req.flash('failure')});
    });


    router.all('/regist',function(req,res){
        res.render('regist');
    });


    router.all('/profile',function(req,res){
        res.render('profile');
    });

    router.all('/withdraw',function(req,res){
        res.render('withdraw');
    });

    router.all('/modify',function(req,res){
        res.render('modify');
    });

    router.all('/logout',function(req,res){
        req.logout();
        res.send("<script>alert('로그아웃 되었습니다.');location.href='/home'</script>");
    })


    //로그인 프로세스
    router.route('/process/login').post(passport.authenticate('login',{	
        failureRedirect: '/login',
        failureFlash: true
    }),function(req,res){
        console.log('/process/login 호출됨');  
        res.send("<script>alert('로그인 되었습니다.');location.href='/home'</script>");
        }
    );


    //회원가입 요청시 처리하는 프로세스
    router.route('/process/regist').post(function(req,res){
        console.log('/process/regist 호출됨');
    
        var newId=req.body.reg_id;
        var newPass=req.body.reg_password;
        var newName=req.body.reg_name;
        var newAge=req.body.reg_age;
        var newGender=req.body.reg_gender;

        addUser(newId,newPass,newName,newAge,newGender,function(err,result){
            
            if (err) {
                console.error('사용자 추가 중 에러 발생 : ' + err.stack);
                
                res.writeHead('400', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>사용자 추가 중 에러 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();
                return;
                    }
                    
            else if(result){
                addRank(newId,function(err,result){
                    if(err){
                        console.log("등급 추가 실패");
                    }else{
                        console.log("등급 추가 성공");
                    }
                })
                
                res.send("<script>alert('회원가입 완료되었습니다.');location.href='/login'</script>");
                console.log('유저 추가완료.');	
            }		
        });

    });

    //아이디 삭제
    router.route('/process/withdraw').post(function(req,res){
        console.log('/process/withdraw 호출됨');
        
        var userId=req.body.id;
        var userPass=req.body.password;

        checkUser(userId,userPass,function(err,result){
            
            if (err) {
                console.error('사용자 삭제 중 에러 발생 : ' + err.stack);
                
                res.writeHead('400', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>사용자 삭제 중 에러 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();
                return;
                    }
            else if(result){
                delUser(userId,function(err,result){
                    if(err){
                        console.log("탈퇴 중 에러 발생");
                    }else{
                        console.log("탈퇴 완료");
                    }
                })
                res.send("<script>alert('회원탈퇴가 완료되었습니다.');location.href='/logout'</script>");
                console.log('회원 탈퇴 완료.');	
            }			
        });
    });


    //회원정보수정
    router.route('/process/modify').post(function(req,res){
        console.log('/process/modify 호출됨');

        var id=req.body.id;
        var pass=req.body.password;
        var name=req.body.name;
        var age=req.body.age;
        var gender=req.body.gender;

        modifyUser(id,pass,name,age,gender,function(err,result){
            
            if (err) {
                console.error('사용자 수정 중 에러 발생 : ' + err.stack);
                
                res.writeHead('400', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>사용자 수정 중 에러 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();
                return;
                    }
            else if(result){
                res.send("<script>alert('회원 수정이 완료되었습니다.');location.href='/'</script>");
                console.log('회원 수정 완료.');	
            }			
        });
    });


    //회원추가 쿼리
    function addUser(id,pass,name,age,gender,callback){
        console.log("addUser 호출됨");
        
        db.get().query(sql.insertMem,[id,pass,name,age,gender], function(err,result){
            
            if(err) { 
                console.log('사용자 추가중 에러발생');
                callback(err,null);
                return;
            }

            else{
                console.log('사용자 데이터 추가완료');
                callback(null,result);
            }
        });
        
    }


    //사용자 등급을 추가하는 함수
    function addRank(id,callback){
        console.log("addRank 호출됨")

        db.get().query(sql.insertRank,[id],function(err,result){
            if(err)
                callback(err,null);
            else{
                callback(null,result);
            }
        });
    }

    //사용자 정보를 조회하는 함수
    function checkUser(id,password ,callback){
        console.log("checkUser 호출됨");

        db.get().query(sql.checkIdPass,[id],function(err,result){
            var user=result[0];
            if(err) { 
                console.log('사용자 조회중 에러발생');
                callback(err,null);
                return;
            }
            else if(!user){
                console.log('입력하신 아이디는 없는 아이디 입니다.');
                callback(null,req.flash('failure','입력하신 아이디는 없는 아이디 입니다.'));
                return;
            }
            else if(user.user_pass != password){	
                callback(null,req.flash('failure','비밀번호가 틀립니다.'));
                return;
            }else{
                return callback(null,user);
            }
        });
    }

    //사용자를 삭제하는 함수
    function delUser(id,callback){
        console.log("delUser 호출됨");
        
        db.get().query(sql.deleteMem,id,function(err,result){
            if(err){
                console.log('사용자 삭제중 에러발생');
                callback(err,null);
                return;
            }

            else{
                console.log('사용자 탈퇴 완료');
                callback(null,result);
            }
        });
    }

    //사용자 정보를 수정하는 함수
    function modifyUser(id,pass,name,age,sex,callback){
        console.log('modifyUser 호출됨');

        db.get().query(sql.modifyMem,[pass,name,age,sex,id],function(err,result){
            if(err){
                console.log('사용자 수정중 에러발생')
                callback(err,null);
                return;
            }else{
                console.log('사용자 수정 완료!!!')
                callback(null,result);
                return;
            }
        })
    }



    //아이디 중복확인 ajax
    router.all("/checkId",function(req,res){
        var checked;
        
        var id=req.body.id;
        db.get().query(sql.selectId,id, function(err,result){

            if(err) {
                console.log("아이디조회 오류");
                throw err;
            }	

            if(result[0].cnt==1)
            checked="NO";

            else
            checked="YES";
        
            res.send({result:checked});
        });
    });





}
