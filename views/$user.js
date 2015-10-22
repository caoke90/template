//异步公共代码!
var router = require('express').Router();
module.exports = router;
var Api=require("../Api")
Api.use$Path(router,__dirname)
Api.useWindjs(router)
Api.useCookieSession(router)

router.getAsync("/logIn",eval(Wind.compile("async", function (req, res) {
    AV.User.logIn("test", "test", {
        success: function(user) {
            // 成功了，现在可以做其他事情了.
            cc.log("ok")
            res.jsonp(user)
        },
        error: function(user, error) {
            cc.log("fail")
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