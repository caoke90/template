//异步公共代码!
var router = require('express').Router();
router.getAsync = function (path, handler) {
    router.get(path, function (req, res, next) {
        handler(req, res, next).start();
    });
}
module.exports = router;
var Wind = require("wind")

//公共模块
var Api=require("../Api")

var AV=require("leanengine")
router.use(AV.Cloud.CookieSession({ secret: 'donut',fetchUser:true}));

router.getAsync("/logIn",eval(Wind.compile("async", function (req, res) {
    AV.User.logIn("test123", "test123", {
        success: function(user) {
            // 成功了，现在可以做其他事情了.
            cc.log("ok")
            res.jsonp(user)
        },
        error: function(user, error) {
            // 失败了.
            res.jsonp(error)
        }
    });

})))
router.getAsync("/user",eval(Wind.compile("async", function (req, res) {
    var user = AV.User.current();
    res.jsonp(user)
})))

router.getAsync("/logOut",eval(Wind.compile("async", function (req, res) {
    AV.User.logOut();
    var user = AV.User.current();
    cc.log(user)
    res.jsonp("21")

})))