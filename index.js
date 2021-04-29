const express = require('express')
const app = express()
const port = 3001
const config = require('./config/key');
//const bodyParser = require('body-parser'); Express 4.16+부터 필요가 없어진듯?
const { User } = require("./models/User");//User모델 가져오기

//application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({extended: true}));Express 4.16+부터 필요가 없어진듯?
app.use(express.urlencoded()); //Parse URL-encoded bodies
//app.use(bodyParser.json());Express 4.16+부터 필요가 없어진듯?
app.use(express.json()); //Used to parse JSON bodies

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

app.post('/register', (req, res) => {

  // 회원 가입 할때 필요한 정보들을 client에서 가져오면
  //그것들을 데이터 베이스에 넣어준다.
    const user = new User(req.body)

    user.save((err, userInfo) =>{
      if(err) return res.json({ success: false, err})
      return res.status(200).json({
        success:true
      })
    })

})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

