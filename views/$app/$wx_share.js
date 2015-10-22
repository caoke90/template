//异步公共代码!
var router = require('express').Router();
var Api=require("../../Api")
//使用windjs
Api.useWindjs(router)
module.exports = router;

router.getAsync("/wx_share.html",eval(Wind.compile("async", function (req, res) {
    var data={
        userid:req.query.userid
    }
    //最新主题
    var theme=$await(AV.firstAsync("Theme",function(query){
        query.descending("order")
    }))

    var videoquery=theme.relation("themeVideo").query()
    videoquery.descending("createdAt")
    var video=$await(AV.queryfirstAsync(videoquery));
    data.video=video;

    var audioquery=theme.relation("themeAudioXMLY").query()
    audioquery.descending("createdAt")
    var audio=$await(AV.queryfirstAsync(audioquery));
    data.audio=audio;

 //获取用户信息
    var user=$await(AV.getAsync("_User",data.userid))
    data.headimg=""
    data.childimg=""
    if(user){
        if(user.get("head")){
            data.headimg=user.get("head").url()
        }
        var query2=user.relation("myChildren").query()
        query2.exists("head")
        var child=$await(AV.queryfirstAsync(query2))
        if(child){
            data.childimg=child.get("head").url()
        }
    }

    res.render(__dirname+"/wx_share",data)

})))

