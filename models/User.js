const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10; //10자리의 salt
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name:{
        type: String,
        maxlength:50
    },
    email:{
        type:String,
        trim:true,
        unique:1
    },
    password:{
        type:String,
        minlength:5
    },
    lastname:{
        type:String,
        maxlength:50
    },
    role :{
        type:Number,
        default:0
    },
    image: {
        type:String
    },
    token:{
        type:String
    },
    tokenExp:{
        type:Number
    }
})

/*
userSchema.pre('save', ( next )=> {
    var user = this;

    if(user.isModified('password')){ //비밀번호 수정일 때만!!
        //비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, (err, salt) => {
            console.log("흠" + err);
            if(err) return next(err);

            bcrypt.hash(user.password, salt, (err, hash) => {
                console.log("흠2" + err);
                if(err) return next(err);
                user.password = hash;
                next();
            })
        })
    }
})
*/
userSchema.pre('save', function( next ) {
    let user = this;

    if(user.isModified('password')){ //비밀번호 수정일 때만!!
        //비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if(err) return next(err);

            bcrypt.hash(user.password, salt, (err, hash)  => {
                if(err) return next(err);
                user.password = hash;
                next();
            })
        })
    } else { //비밀번호 변경이 아닐경우!!
        next();
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb){
    //plainPassword 1234567 암호화된 비밀번호 $2b$rwekrjgjifdogjwe$2365
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err)
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function (cb){
    let user = this;

    //jsonwebtoken을 이용해서 token을 생성하기
    let token = jwt.sign(user._id.toHexString(), 'secretToken');

    user.token = token;
    user.save(function(err, user){
        if(err) return cb(err)
        cb(null, user)
    })
}

userSchema.statics.findByIdToken = function(token, cb){
    let user = this;
    
    //토큰을 복호화 한다.
    jwt.verify(token, 'secretToken', function (err, decoded){
        //유저 아이디를 이용해서 유저를 찾은 다음에
        //클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인

        user.findOne({"_id" : decoded, "token" : token}, function(err,user){
            if(err) return cb(err)
            cb(null, user)
        })

    })
}

const User = mongoose.model('User', userSchema)

module.exports = { User }
