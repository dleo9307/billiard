var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var static = require('serve-static');
var path = require('path');
var passport = require('passport'); 
var session = require('express-session'); 

//플래쉬메세지 사용
var flash = require('connect-flash'); 
//db설정을 불러온다
var db = require('./config/db');
var pool=db.get();

//express 객체 생성
var app = express();


//port라는 속성에 3000이라는 값을 설정
var port = process.env.PORT || 3000;


//ejs를 사용하기위해 view engine에 등록
app.set('view engine','ejs');
//view파일을 include 하기위해 사용
app.set('views', path.join(__dirname, 'views'));

//body본문의 파라미터를 받기위해서 미들웨어에 설정
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());


//public폴더를 서버에서 사용하기 위한 설정
app.use('/public',static(path.join(__dirname,'public')));


//flash메세지를 사용하기위해 미들웨어에 등록
app.use(flash());


//passport를 사용하기위해 세션설정
app.use(session({ 
	secret: 'secret key', 
	resave: false, 
	saveUninitialized: true 
	})); 


//passport 설정 불러오기
require('./config/passport')(passport); 


//passport를 초기화하고 세션으로 사용
app.use(passport.initialize());
app.use(passport.session());

//view 파일에서 사용할수 있도록 변수를 미들웨어에 전달
app.use(function(req,res,next){
	res.locals.isAuthenticated = req.isAuthenticated();
	res.locals.currentUser = req.user;
	next();
});

  
//라우터 설정 불러오기
var router = express.Router();


var userRoute = require('./routes/user');
var galleryRoute = require('./routes/gallery');
var communityRoute = require('./routes/community');

userRoute(router,passport);
communityRoute(router);
galleryRoute(router);

app.use('/',router);

//모든 경로에 대해 잘못된 경로로 접근시 처리
app.all('*', function(req, res) {
	res.status(401).send('<h1>잘못된 접근입니다.<br><a href="/home">홈페이지로 이동</a></h1>');
});


//서버시작과 함께 db설정 불러오기
http.createServer(app).listen(port,function(){

console.log('3000번 포트로 서버가 시작 되었습니다.');
pool.getConnection(function(err ,connection) {
	if (err) {
	  console.log('Unable to connect to MySQL.');
	  process.exit(1);
	}
	else
	  console.log('database connected');
	  connection.release();
  });
});
