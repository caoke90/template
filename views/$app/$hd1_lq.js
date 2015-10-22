//异步公共代码!
var router = require('express').Router();
var Api=require("../../Api")
//使用windjs
Api.useWindjs(router)
module.exports = router;
//领取奖品
router.getAsync("/hd1_lq.html",eval(Wind.compile("async", function (req, res, next) {

    var data={
        userid:req.query.userid
    }
    data.renwuArr=[]
    data.rw3ok=false;
    data.rw7ok=false;
    data.rw14ok=false;
    data.rw21ok=false

    if(data.userid!=""){
        var user=$await(AV.getAsync("_User",data.userid))
        var query=user.relation("myDonutCoin").query()
        query.containedIn("coinInfo",["每日任务","领取3天连续任务奖励","领取7天连续任务奖励","领取14天连续任务奖励"]);
//        query.greaterThan("updatedAt",new Date("2015-10-10 00:01"))
        query.lessThan("updatedAt",new Date("2015-11-25 23:59"))

        var dataArr=$await(AV.queryfindAsync(query))

        data.renwuArr= _.filter(dataArr,function(v){
            return v.get("coinInfo")=="每日任务"
        })
        data.rw3ok=_.find(dataArr,function(v){
            return v.get("coinInfo")=="领取3天连续任务奖励"
        })
        data.rw7ok=_.find(dataArr,function(v){
            return v.get("coinInfo")=="领取7天连续任务奖励"
        })
        data.rw14ok=_.find(dataArr,function(v){
            return v.get("coinInfo")=="领取14天连续任务奖励"
        })
        if(data.renwuArr.length>=21){
            data.rw21ok=$await(AV.firstAsync("DonutBox",function(query){
                query.equalTo("userid",data.userid)
            }));
        }
    }
    res.render(__dirname+"/hd1_lq",data)

})))

router.getAsync("/hd1_list5.html",eval(Wind.compile("async", function (req, res, next) {
//获奖名单
    var data={}
    data.lists=$await(AV.findAsync("DonutBox",function(query){
        query.equalTo("isuser","ok")
        query.containedIn("boxInfo",["多纳绘本一套","多纳双肩书包一个","星空儿童安全手环一个"]);
        query.limit(5)
    }))
    var useridArr=[]
    _.each(data.lists,function(v){
        if(v.get("userid")){
            useridArr.push(v.get("userid"))
        }
    })
    var lists2=$await(AV.findAsync("_User",function(query){
        query.containedIn("objectId",useridArr);
    }))
    _.each(lists2,function(v){
        var vp=_.find(data.lists,function(v2){
            return v2.get("userid")== v.id
        })
        vp.set("head", v.get("head"))
    })
    res.render(__dirname+"/hd1_list5",data)

})))