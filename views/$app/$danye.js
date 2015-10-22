//异步公共代码!
var router = require('express').Router();
var Api=require("../../Api")
//使用windjs
Api.useWindjs(router)
module.exports = router;

router.getAsync("/danye.html",eval(Wind.compile("async", function (req, res) {
    var data={
        userid:req.query.userid,
        score:parseInt(req.query.score)
    }
    var user=$await(AV.getAsync("_User",data.userid))
    var img1,img2
    if(user){
        if(user.get("head")){
            img1=user.get("head").url()
        }
        var query=user.relation("myChildren").query()
        query.exists("head")
        var child=$await(AV.queryfirstAsync(query))
        if(child){
            img2=child.get("head").url()
        }
    }
    res.render(__dirname+"/danye",{
        headimg:img1,
        childimg:img2,
        score:data.score
    })

})))

