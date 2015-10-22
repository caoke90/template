//异步公共代码!
var router = require('express').Router();
//公共模块
var Api=require("../Api")
//使用windjs
module.exports = router;

//"/360/send_verify?order_id=1211090012345678800&app_key=1234567890abcdefghijklmnopqrstuv&product_id=p1&amount=101&app_uid=123456789&app_ext1=XXX201211091985&app_order_id=order1234&user_id=987654321&sign_type=md5&gateway_flag=success&sign=685fbdbc4be47992dfeea8da7d8a5027&sign_return=xxxxxxxxxxx"

router.all("/360/send_verify",function(req,res,next){
    req.params= _.extend(req.query,req.body)
    cc.log(req.params)
    AV.Cloud.run('send_verify', req.params, {
        success: function(result) {
            res.send(result)
        },
        error: function(error) {
        }
    });
})

router.all("/360/order_verify",function(req,res,next){
    req.params= _.extend(req.query,req.body)
    cc.log(req.param)
    AV.Cloud.run('order_verify', req.params, {
        success: function(result) {
            res.send(result)
        },
        error: function(error) {
        }
    });
})

router.all("/360/ok",function(req,res,next){
    res.send("ok")
})