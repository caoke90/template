define(function(require, exports, module) {

    var EventProxy=require("eventproxy")
    var ep = new EventProxy();
    var dialog=require("dialog/dialog")
    var $ = require('jquery');

    var page=$(".page")

    var curIndex=0,prevIndex=-1;

    function animate(name,ele,callback){

            ele.addClass(name+' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                $(this).removeClass(name+" animated")
                callback&&callback()
            });
    }
    $(".page6 .btn1").click(function(ele){
        if($(this).children("audio")[0].paused){
            $(this).children("audio")[0].play()
            $(this).removeClass("fui-volume fui-play")
            $(this).addClass("fui-pause")
        }else{
            $(this).children("audio")[0].pause()
            $(this).removeClass("fui-volume fui-pause")
            $(this).addClass("fui-play")
        }
    })
    $(".page6 .btn1").children("audio")[0].addEventListener("ended",function(){
        $(".page6 .btn1").removeClass("fui-play fui-pause")
        $(".page6 .btn1").addClass("fui-volume")
    })
    $(".page6 .btn2").click(function(){
        if($(".page6 .tip").is(":hidden")){
            $(".page6 .tip").show()
            $(".page6").one("click",function(){
                $(".page6 .tip").hide()
            })
            return false
        }

    })
    $(".page6 .tip").click(function(){
        return false
    })
    ep.all("page6",function(){
        cc.log("page5")
        seajs.use(["https://cdn1.lncld.net/static/js/av-mini-0.5.7.js","jquery.Query"],function(){
            AV.initialize("fyhb7s5ls1fvj6qucc9vwum9ko1qgk2gwag2yo6ii1iib6qz", "v5vu8fodj81waus8k2xacdtllnq5uochurzufflwqs3b0ntg");
           var openid=$.query.get("openid")

            ep.on("user_success",function(openid){
                cc.log(openid)
            })

            if (openid) {
                ep.emit("user_success",openid)
                // do stuff with the user
            } else {
                cc.log("openid 不正确")

            }

            var TestObject = AV.Object.extend("weixinUser");
            var testObject = new TestObject();
            var query = new AV.Query(TestObject);
            query.find({
                success: function(results) {
                    cc.log(results[0])
                    cc.log(results[0].attributes)

                },
                error: function(error) {
                    alert("Error: " + error.code + " " + error.message);
                }
            });
        })

    })
});

