var router = require('express').Router();
var Api=require("../../Api")
//使用windjs
Api.useWindjs(router)
module.exports = router;
var xml2js = require('xml2js');

//public
// 解析微信的 xml 数据
var xmlBodyParser = function (req, res, next) {
    if (req._body) return next();
    req.body = req.body || {};

    // ignore GET
    if ('GET' == req.method || 'HEAD' == req.method) return next();
    console.log("获取数据req")
    // check Content-Type
    if (!req.is('text/xml')) return next();

    // flag as parsed
    req._body = true;

    // parse
    var buf = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk){ buf += chunk });
    req.on('end', function(){

        xml2js.parseString(buf, function(err, json) {
            if (err) {
                err.status = 400;
                next(err);
            } else {
                req.body = json;
                next();
            }
        });
    });
};
router.use(xmlBodyParser);
//end
//微信配置
router.getAsync("/getconfig",eval(Wind.compile("async", function (req, res, next) {

    var data_ticket=$await(Api.getticket())
    cc.log(data_ticket)
    var sign=require("./common/wx_sign")
    var url=req.query.url
    var data2=sign(data_ticket.jsapi_ticket, url)
    data2.appId=data_ticket.appId
    res.jsonp(data2)
})));
router.getAsync("/gettoken",eval(Wind.compile("async", function (req, res, next) {
    var data_token=$await(Api.gettoken())
    delete data_token.secret
    res.jsonp(data_token)
})));

var url=require("url")
var dataurl=url.parse("http://mp.weixin.qq.com/debug/cgi-bin/sandboxinfo?action=showinfo&t=sandbox/index")
dataurl.query=dataurl.query+"openid=2121"

var cache={
    test:"http://dpx.avosapps.com/weixin/getopenid"
}
//登录 redirect_uri
router.getAsync("/login",eval(Wind.compile("async", function (req, res, next) {
    var state=_.uniqueId()
    var data={
        redirect_uri:req.query.redirect_uri||"http://dpx.avosapps.com/index.html"
    }
    cache[state]=data.redirect_uri
    res.redirect("https://open.weixin.qq.com/connect/oauth2/authorize?appid="+Api.getappId()+"&redirect_uri=http://dpx.avosapps.com/weixin/signUp&response_type=code&scope=snsapi_userinfo&state="+state+"#wechat_redirect")

})));
//根据code获取openid
// state记录 redirect_uri
router.getAsync("/signUp",eval(Wind.compile("async", function (req, res, next) {
    var data={
        state:req.query.state||"test",
        code:req.query.code||"021de2292f6730395d8e0f94b9b0166G"
    }
    data.redirect_uri=cache[data.state]
    delete cache[data.state]
    //获取openid
    var data2=$await(needle.getJSONAsync("https://api.weixin.qq.com/sns/oauth2/access_token?appid="+Api.getappId()+"&secret="+Api.getsecret()+"&code="+data.code+"&grant_type=authorization_code"))
    data.openid=data2.openid

    var user1=$await(AV.logInAsync(data2.openid,data2.openid))

    if(!user1){
        //获取用户信息
        var data3=$await(needle.getJSONAsync("https://api.weixin.qq.com/sns/userinfo?access_token="+data2.access_token+"&openid=OPENID&lang=zh_CN"))
        //注册用户
        user1=$await(AV.signUpAsync(function(user){
            user.set("username",data3.openid);
            user.set("password", data3.openid);
            user.set("nickname", data3.nickname);
            user.set("sex", data3.sex);
            user.set("province", data3.province);
            user.set("city", data3.city);
            user.set("country", data3.country);
            user.set("headimgurl", data3.headimgurl);
        }))
    }

//    res.jsonp(user1)
    res.redirect(data.redirect_uri+"?openid="+data2.openid)
})));
router.getAsync("/login_base",eval(Wind.compile("async", function (req, res, next) {
    var data={
        redirect_uri:req.query.redirect_uri||"http://dpx.avosapps.com/index.html"
    }
    var data_token=$await(Api.gettoken())
    var url="https://open.weixin.qq.com/connect/oauth2/authorize?appid="+data_token.appId+"&redirect_uri="+data.redirect_uri+"&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect"
    res.redirect(url)
})));
router.getAsync("/test",eval(Wind.compile("async", function (req, res, next) {
    var data={
        openid:req.query.openid
    }

    var user=$await(AV.logInAsync(data.openid,data.openid))

    res.jsonp(user)
})));
//验证微信服务器
router.get('/', function(req, res, next) {
    var crypto = require('crypto');
    var msg=req.query
    var oriStr = ["duona", msg.timestamp, msg.nonce].sort().join('')
    var code = crypto.createHash('sha1').update(oriStr).digest('hex');

    if (code == msg.signature) {
        cc.log(req.query)
        res.send(msg.echostr)
    } else {
        res.send("hello wixin")
    }
});
//回复消息
router.postAsync("/",eval(Wind.compile("async", function (req, res, next) {
    var msg=req.body
//    english_ep.emit(msg.xml.MsgType.toString(),msg)
    res.send("")
})));
