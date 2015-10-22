//异步公共代码!
var router = require('express').Router();
var Api=require("../../Api")
//使用windjs
Api.useWindjs(router)
//Api.useCookieSession(router)
module.exports = router;

router.getAsync("/hd1.html",eval(Wind.compile("async", function (req, res, next) {

    var data={
        userid:req.query.userid
    }

    var endtime=new Date("2015-11-25 23:59")
    var notime=new Date()
    data.shengyuDay=parseInt((endtime.getTime()-notime.getTime())/1000/60/60/24)

    res.render(__dirname+"/hd1",data)

})))
router.getAsync("/hd1more.html",eval(Wind.compile("async", function (req, res, next) {

    var data={
    }
    //获奖名单
    data.lists=$await(AV.findAsync("DonutBox",function(query){
        query.equalTo("isuser","ok")
        query.containedIn("boxInfo",["多纳绘本一套","多纳双肩书包一个","星空儿童安全手环一个"]);
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

    var endtime=new Date("2015-11-25 23:59")
    var notime=new Date()
    data.shengyuDay=parseInt((endtime.getTime()-notime.getTime())/1000/60/60/24)

    res.render(__dirname+"/hd1more",data)

})))
router.postAsync("/hd1.html",eval(Wind.compile("async", function (req, res, next) {

    req.params=_.extend(req.query,req.body)
    if(!req.params.userid){
        res.send("userid 缺失")
    }
    var data={
        userid:req.params.userid
    }
    var user=$await(AV.getAsync("_User",data.userid))

    var query=user.relation("myDonutCoin").query()
    query.containedIn("coinInfo",["每日任务","领取3天连续任务奖励","领取7天连续任务奖励","领取14天连续任务奖励"]);
//    query.greaterThan("updatedAt",new Date("2015-10-10 00:01"))
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
    data.rw21ok=false
    var redata={}
    redata.userid=data.userid
    redata.code=-1
    redata.message="已领取或者无效"
    if(req.body.lqrw=="lqrw3"&&data.renwuArr.length>=3&&!data.rw3ok){
        var post=$await(AV.saveAsync("DonutCoin",{
            changNumber:5,
            coinInfo:"领取3天连续任务奖励"
        }))
        var relation =user.relation("myDonutCoin")
        relation.add(post);
        user.set("coinnumber", user.get("coinnumber")+5)
        $await(AV.postsaveAsync(user))
        redata.code=0
        redata.message="领取3天连续任务奖励"
    }
    if(req.body.lqrw=="lqrw7"&&data.renwuArr.length>=7&&!data.rw7ok){
        var post=$await(AV.saveAsync("DonutCoin",{
            changNumber:10,
            coinInfo:"领取7天连续任务奖励"
        }))
        var relation =user.relation("myDonutCoin")
        relation.add(post);
        user.set("coinnumber", user.get("coinnumber")+10)
        $await(AV.postsaveAsync(user))
        redata.code=0
        redata.message="领取7天连续任务奖励"
    }
    if(req.body.lqrw=="lqrw14"&&data.renwuArr.length>=14&&!data.rw14ok){
        var post=$await(AV.saveAsync("DonutCoin",{
            changNumber:15,
            coinInfo:"领取14天连续任务奖励"
        }))
        var relation =user.relation("myDonutCoin")
        relation.add(post);
        user.set("coinnumber", user.get("coinnumber")+15)
        $await(AV.postsaveAsync(user))
        redata.code=0
        redata.message="领取14天连续任务奖励"
    }
    if(req.body.lqrw=="lqrw21"&&data.renwuArr.length>=21){
        //是否领取过
        data.rw21ok=$await(AV.firstAsync("DonutBox",function(query){
            query.equalTo("userid",data.userid)
        }))
        if(!data.rw21ok){
            //获取库存
            var JpArr=$await(AV.findAsync("DonutBox",function(query){
                query.equalTo("isuser","no")
                query.containedIn("boxInfo",["多纳绘本一套","多纳双肩书包一个","星空儿童安全手环一个"]);
            }))
            var theJp,jpNum;

            //判断是否中奖，中奖几率
            if(JpArr.length==35){
                jpNum=100
            }else{
                var todayJp=$await(AV.findAsync("DonutBox",function(query){
                    query.exists("userid")
                    var data1=new Date()
                    data1.setDate(data1.getDate()-1)
                    var data2=new Date()
                    query.greaterThan("updatedAt",data1)
                    query.lessThan("updatedAt",data2)
                }))
                if(todayJp.length==2){
                    jpNum=0
                }else if(todayJp.length==1){
                    jpNum=5
                }else{
                    jpNum=10
                }
            }
            if(JpArr.length>0&&_.random(99)<jpNum){
                theJp=JpArr[_.random(JpArr.length-1)]
            }
            //如果中奖记录用户id,没中奖给50纳币
            if(theJp){
                var dizhi= $await(AV.firstAsync("user_address",function(query){
                    query.equalTo("userid",data.userid)
                }))
                theJp.set("userid",data.userid)
                theJp.set("username",dizhi.get("username"))
                theJp.set("telephone",dizhi.get("telephone"))
                theJp.set("address",dizhi.get("address"))

                theJp.set("isuser","ok")
                $await(AV.postsaveAsync(theJp))
                redata.code=0
                redata.message=theJp.get("boxInfo")
            }else{
                var Post = AV.Object.extend("DonutBox");
                theJp = new Post();
                theJp.set("userid",data.userid)

                theJp.set("boxInfo","50个纳币")
                theJp.set("isuser","ok")
                $await(AV.postsaveAsync(theJp))
                redata.code=0
                redata.message=theJp.get("boxInfo")
                user.set("coinnumber", user.get("coinnumber")+50)
                $await(AV.postsaveAsync(user))
            }

        }

    }
    res.json(redata)
})))
//保存用户地址
router.postAsync("/hd1_address",eval(Wind.compile("async", function (req, res, next) {

    req.params=_.extend(req.query,req.body)
    if(!req.params.userid){
        res.json({
            code:-1,
            message:"userid 缺失!"
        })
    }
    var exist= $await(AV.firstAsync("user_address",function(query){
        query.equalTo("userid",req.params.userid)
    }))
    if(exist){
        $await(AV.upAPostAsync(exist,req.params))
        res.json({
            code:0,
            message:"用户信息已存在，更新成功！"
        })
    }else{
        $await(AV.saveAsync("user_address",req.params))
        res.json({
            code:0,
            message:"保存成功！"
        })
    }


})))

//var test=eval(Wind.compile("async", function () {
//    for(var i=0;i<20;i++){
//        $await(AV.saveAsync("DonutBox",{
//            boxInfo:"多纳绘本一套",
//            isuser:"no"
//        }))
//    }
//    for(var i=0;i<10;i++){
//        $await(AV.saveAsync("DonutBox",{
//            boxInfo:"多纳双肩书包一个",
//            isuser:"no"
//        }))
//    }
//    for(var i=0;i<5;i++){
//        $await(AV.saveAsync("DonutBox",{
//            boxInfo:"星空儿童安全手环一个",
//            isuser:"no"
//        }))
//    }
//}))
//test().start()