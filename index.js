const express = require('express')
const app = express()
const port = 3001
const config = require('./server/config/key');
//const bodyParser = require('body-parser'); //Express 4.16+부터 필요가 없어진듯?
const cookieParser = require('cookie-parser');

const { auth } = require("./server/middleware/auth");
const { User } = require("./server/models/User");//User모델 가져오기

//application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({extended: true}));Express 4.16+부터 필요가 없어진듯?
app.use(express.urlencoded()); //Parse URL-encoded bodies
//app.use(bodyParser.json()); //Express 4.16+부터 필요가 없어진듯?
app.use(express.json()); //Used to parse JSON bodies
app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => console.log('MongoDB connected!'))
  .catch(err => console.log(err))

//mongodb+srv://admin:<password>@boilerplate.lje9s.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
//admin//rhkdtjd83**
app.get('/', (req, res) => res.send('Hello World2!'))
app.get('/api/hello', (req, res) => {
  res.send("heelo");
});
app.post('/api/users/register', (req, res) => {

  // 회원 가입 할때 필요한 정보들을 client에서 가져오면
  //그것들을 데이터 베이스에 넣어준다.
  
    const user = new User(req.body)
    //userSchema.pre('save', function() { User 모델에 있는 이게 실행됨
    user.save((err, userInfo) =>{
      if(err) return res.json({ success: false, err})
      return res.status(200).json({
        success:true
      })
    })
})
app.post('/api/users/login', (req, res) =>{

  //1.요청된 이메일을 데이터베이스에서 있는지 찾는다.
  User.findOne({ email: req.body.email }, (err, user) => {
    if(!user){
      return res.json({
        loginSuccess : false,
        message : "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }
  

    //2.요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호 인지 확인.
    user.comparePassword(req.body.password , (err, isMatch ) => {
      if(!isMatch)
      return res.json({ loginSuccess : false, message : "비밀번호가 틀렸습니다."})

      //3.비밀번호 까지 맞다면 토큰을 생성하기.
      user.generateToken((err,user) => {
        if(err) return res.status(400).send(err);

        // 토큰을 저장한다. 어디에 ?  쿠키, 로컬스토리지
        res.cookie("x_auth",user.token)
        .status(200)
        .json({ loginSuccess : true, userId: user._id })
      })

    })

  })
});

//role 0 -> 일반유저 role 0이 아니면 관리자
app.get('/api/users/auth', auth, (req, res) =>{
  //auth 미들웨어가 성공적으로 통과했을때!
  res.status(200).json({
    _id : req.user_id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth : true,
    email : req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})

app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id},
    { token: ""}
    ,(err, user)=>{
      if(err) return res.json({ success:false, err});
      return res.status(200).send({
        success: true
      })
    }
    )
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

