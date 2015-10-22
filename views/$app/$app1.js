//异步公共代码!
var router = require('express').Router();
//公共模块
var Api=require("../../Api")
//使用windjs
Api.useWindjs(router)
module.exports = router;

router.use(AV.Cloud.CookieSession({ secret: 'donut',fetchUser:true}));

router.getAsync("/app1.html",eval(Wind.compile("async", function (req, res, next) {
    var user = AV.User.current();
    var data={
        videoid:req.query.videoid||"55c7021c60b294e79b658be5"
    }
    //获取视频
    var video=$await(AV.getAsync("Video",data.videoid));
    //cc.log(video)
    //获取评论数
    var count=$await(AV.querycountAsync(video.relation("videoPosts").query()))
    //获取评论
    var query=video.relation("videoPosts").query();

    query.descending("createdAt")
    var videoPosts=$await(AV.queryfindAsync(query));
    //获取评论时间
    _.each(videoPosts,function(v){
        var text=""
        var time= (new Date().getTime()-v.createdAt.getTime())/1000
        console.log(Math.floor(time))
        if(Math.floor(time/86400)>=1){
            text=Math.floor(time/86400)+"天"
        }
        else if(Math.floor(time%86400/3600>=1)){
            text=Math.floor(time%86400/3600)+'时'
        }
        else if(Math.floor(time%86400%3600/60)>=1){
            text=Math.floor(time%86400%3600/60)+'分'
        }else{
            text="刚刚"
        }
        v.text=text
    })

    res.render(__dirname+"/app1",{
        video:video,
        videoPosts:videoPosts,
        count:count
    })
})))
