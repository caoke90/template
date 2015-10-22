var router = require('express').Router();
module.exports = router;

var Api=require("../../Api")
//使用自动加载
Api.use$Path(router,__dirname)

//使用windjs
Api.useWindjs(router)

//使用cookie
Api.useCookieSession(router)

//手机号码登录
router.postAsync("/logInByTelephone",eval(Wind.compile("async", function (req, res) {
    var data={
        username:req.body.telephone,
        password:req.body.password
    }
    var options = {
        headers: { 'X-Custom-Header': 'Bumbaway atuna' }
    }
    var body=$await(needle.postAsync('http://donutmanager.koolearn.com/common/login',data, options))
    body=typeof body=="string"?JSON.parse(body):body
    res.json(body)
    if(body.code=="0"){
        var user=$await(AV.signUpAsync(function(user){
            user.set("username", body.userName);
            user.set("password", data.password);
            user.set("mobilePhoneNumber", body.mobile_number);
        }))
        //如果注册成功
        if(user){
            var post=$await(AV.saveAsync("Child",{
                "nickname":"Donut_"+body.userName
            }))

            var relation = user.relation("myChildren");
            relation.add(post);
            user.save()
        }else{
        //用户是否存在
            AV.User.logInWithMobilePhone(body.mobile_number, data.password).then(function(user){
                //登录成功
                cc.log("登录成功")
            }, function(err){
                //登录失败
                cc.log("登录失败")
            });
        }

    }

})))
router.getAsync("/test",eval(Wind.compile("async", function (req, res) {

    var user=$await(AV.firstAsync("_User",function(query){
        query.equalTo("mobilePhoneNumber","15101175662")
    }))
    cc.log(user)
    if(user){
        user.setPassword("caoke907167");
        user.save()
    }

})))
//注册
router.postAsync("/signUpOrlogInWithMobilePhone",eval(Wind.compile("async", function (req, res) {
    var data={
        mobile: req.body.telephone,
        verify_code: req.body.smsCode,
        password:req.body.password,
        defalut_child:true
    }
    var body=$await(needle.postAsync('http://donutmanager.koolearn.com/common/mobiregist',data))
    body=typeof body=="string"?JSON.parse(body):body
    res.json(body)
})))
//发送验证码
router.postAsync("/send_vcode",eval(Wind.compile("async", function (req, res) {
    var data={
        mobile:req.body.telephone,
        use:req.body.use//用途(1:找回密码，2:手机注册)
    }
    var body=$await(needle.postAsync('http://donutmanager.koolearn.com/common/send_vcode',data))
    body=typeof body=="string"?JSON.parse(body):body
    res.json(body)
})))
//验证手机验证码
router.postAsync("/verify_code",eval(Wind.compile("async", function (req, res) {
    var data={
        mobile:req.body.telephone,
        verify_code: req.body.smsCode,
        use:req.body.use //用途(1:找回密码，2:手机注册)
    }
    var body=$await(needle.postAsync('http://donutmanager.koolearn.com/common/verify_code',data))
    body=typeof body=="string"?JSON.parse(body):body
    res.json(body)
})))

//通过手机验证码 修改密码
router.postAsync("/findpwd",eval(Wind.compile("async", function (req, res) {
    var data={
        mobile:req.body.telephone,
        verify_code:req.body.smsCode,
        password:req.body.password
    }
    var body=$await(needle.postAsync('http://donutmanager.koolearn.com/findpwd/mobile',data))
    body=typeof body=="string"?JSON.parse(body):body
    res.json(body)
    if(body.code=="0"){
        var user=$await(AV.firstAsync("_User",function(query){
            query.equalTo("mobilePhoneNumber",data.mobile)
        }))
        if(user){
            user.setPassword(data.password);
            user.save()
        }

    }

})))
