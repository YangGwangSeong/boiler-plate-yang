const { User } = require("../models/User");

let auth = (req, res, next) => {
    //인증 처리를 하는곳

    //클라이언트 쿠키에서 토큰을 가져온다.
    let token = req.cookies.x_auth;
    //토큰을 복호화 한후 유저를 찾는다.
    User.findByIdToken(token, (err, user) => {
        if(err) throw err;
        if(!user) return res.json({ isAuth : false, err: true})

        //라우터에서 req.token , req.user이런식으로 사용할 수 있게 할려고 넣어줌
        req.token = token;
        req.user = user;
        next();
    })
    //유저가 있으면 인증 Okay

    //유저가 없으면 인증 NO!
}

module.exports = {auth};