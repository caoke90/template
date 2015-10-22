//video id 55a727efe4b04492ba7f1cc0

var router = require('express').Router();
var Api=require("../../Api")
//使用windjs
Api.useWindjs(router)
module.exports = router;

router.getAsync("/video_share.html",eval(Wind.compile("async",function(req,res,next){
    if(!req.query.videoid){
        next()
        return;
    }
    var data={
        videoid:req.query.videoid
    }

    //获取视频
    var video=$await(AV.getAsync("Video",data.videoid));
    //cc.log(video)

    res.render(__dirname+"/video_share",{
        video:video
    })
})))
//参数不存在
router.getAsync("/video_share.html",eval(Wind.compile("async",function(req,res,next){

    var data={
        //userid:req.query.userid
    }

    var theme=$await(AV.firstAsync("Theme",function(query){
        query.descending("order")
    }))

    var videoquery=theme.relation("themeVideo").query()
    videoquery.descending("createdAt")
    var video=$await(AV.queryfirstAsync(videoquery));
    data.video=video;

    res.render(__dirname+"/video_share",data)

})))