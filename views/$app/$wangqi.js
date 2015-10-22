//异步公共代码!
var router = require('express').Router();
var Api=require("../../Api")
//使用windjs
Api.useWindjs(router)
module.exports = router;

router.getAsync("/wangqi.html",eval(Wind.compile("async", function (req, res, next) {
    var data={
        userid:req.query.userid,
        score:parseInt(req.query.score)
    }

    var lists=$await(AV.findAsync("Video",function(query){
        query.ascending("createdAt")
    }))

    res.render(__dirname+"/wangqi",{
        lists:lists
    })

})))


