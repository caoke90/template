//异步公共代码!
var router = require('express').Router();
var Api=require("../../Api")
//使用windjs
Api.useWindjs(router)
module.exports = router;

var cache;
//列表
router.getAsync("/play1.html",eval(Wind.compile("async", function (req, res) {
    var data={
        id:req.query.id||"8871560"
    }
    var data2=$await(needle.getJSONAsync("http://3rd.ximalaya.com/tracks/"+data.id+"?i_am=duona&uni=wx"))

    res.render(__dirname+"/play1",{
        item:data2.track
    })
})))
//上一个音频，下一个音频
router.getAsync("/pages",eval(Wind.compile("async", function (req, res) {
    if(!cache){
        cache=[]
        var arr=[2896646,291274,296425,293074,296739,2874711]
        var item,page= 1,index=0
        do{
            item=$await(needle.getAsync("http://3rd.ximalaya.com/albums/"+arr[index]+"/tracks?i_am=duona&is_asc=false&uni=wx&page="+page+"&per_page=20"))
            _.each(item.album.tracks,function(v,k){
                cache.push(v.id)
            })
            page+=1
            if(item.album.tracks.length<20){
                index++
                page=1
            }
        }while(arr[index])
    }
    var id=parseInt(req.query.id)||8871560
    var cur=cache.indexOf(id)
    var pre=cur-1;
    var nex=cur+1;
    if(pre<0){
        pre=(pre+cache.length)%cache.length
    }
    if(nex>=cache.length){
        nex=nex%cache.length
    }
    res.json({
        id:id,
        previd:cache[pre],
        nextid:cache[nex]
    })
})))
//菜单
router.getAsync("/albums",eval(Wind.compile("async", function (req, res) {

    //2896646 291274,296425,293074,296739,2874711
   var back=$await(needle.getAsync("http://3rd.ximalaya.com/albums/"+(req.query.album_id||2896646)+"/tracks?i_am=duona&is_asc=false&uni=wx&page="+(req.query.page||1)+"&per_page="+(req.query.per_page||20)))
    res.json(back)
})))

router.getAsync("/tracks",eval(Wind.compile("async", function (req, res) {
    var back=$await(needle.getAsync("http://3rd.ximalaya.com/tracks/"+req.query.track_id+"?i_am=duona&uni=wx"))
    res.json(back)
})))

