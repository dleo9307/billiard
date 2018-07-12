var sql=require('./sql');
var db=require('./db');
var LocalStrategy = require('passport-local').Strategy
var flash = require('connect-flash');

module.exports = function(passport) {

    //처음에 세션을 잡아준다.
    passport.serializeUser(function (user, callback) {
        console.log('serializeUser 호출됨');
        callback(null, user);
    });
      
    //페이지 이동할 때 로그인(세션) 여부확인      
    passport.deserializeUser(function (user, callback) { 
        console.log('deserializeUser 호출됨');
        db.get().query('select * from biliard.user_info, biliard.user_rank where user_info.user_id=? and user_rank.user_id = ?;', [user.user_id, user.user_id], function(err,result){
            var user=result[0];
            callback(null,user);
        });
    });

    passport.use('login',new LocalStrategy({
        usernameField: 'id',
        passwordField: 'password',
        passReqToCallback: true
    },function (req, id, password, done) {
        
        console.log('passport로 체크함.');
            db.get().query(sql.checkIdPass,id, function(err,result){
                var user=result[0];
                if(err){
                    return done(err,false,req.flash('failure','로그인중 에러 발생.'));
                }
                if(!user){
                    return done(null,false,req.flash('failure','입력하신 아이디는 없는 아이디 입니다.'));
                }
                else if(user.user_pass != password){	
                    return done(null,false,req.flash('failure','비밀번호가 틀립니다.'));
                }else{
                    checkStatus(id,function(err,result){
                        var status=result[0];

                        if(status.user_status==1){
                            return done(null,user);
                        }
                        else{
                            return done(null,false,req.flash('failure','탈퇴 처리된 회원입니다.'));
                        }
                    })
                  
                }
        });
    })); 
}

function checkStatus(id,callback){
	console.log("checkStatus 호출됨");
	
	db.get().query(sql.checkStatus,[id], function(err,result){
		
		if(err) { 
			console.log('사용자 조회중 에러발생');
			callback(err,null);
			return;
		}

		else{
			console.log('사용자 데이터 추가완료');
			callback(null,result);
		}
	});	
}
