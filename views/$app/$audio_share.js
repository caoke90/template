//video id 55a727efe4b04492ba7f1cc0

var router = require('express').Router();
var Api=require("../../Api")
//使用windjs
Api.useWindjs(router)
module.exports = router;


router.getAsync("/audio_share.html",eval(Wind.compile("async",function(req,res,next){
    if(!req.query.track_id){
        next()
        return;
    }
    var data={
        track_id:req.query.track_id
    }
    var data2=$await(needle.getJSONAsync("http://3rd.ximalaya.com/tracks/"+data.track_id+"?i_am=duona&uni=wx"))
    //cc.log(data2)
    //res.json(data2)
    res.render(__dirname+"/audio_share",data2)
})))

//参数不存在的时候
router.getAsync("/audio_share.html",eval(Wind.compile("async",function(req,res,next){
    var data={

    }
    var theme=$await(AV.firstAsync("Theme",function(query){
        query.descending("order")
    }))

    var audioquery=theme.relation("themeAudioXMLY").query()
    audioquery.descending("createdAt")
    var audio=$await(AV.queryfirstAsync(audioquery));
    data.track={
        nickname:audio.get("name"),
        title:audio.get("name"),
        play_url_32:audio.get("playUrl")
    }
    //cc.log(audio)
    res.render(__dirname+"/audio_share",data)

})))

