define(function(require, exports, module) {

    var EventProxy=require("eventproxy")
    var ep = new EventProxy();
    var $ = require('jquery');

    var page=$(".page")

    var curIndex=0,prevIndex=-1;


    window.onhashchange=function(){
        var hash=location.hash
        if(hash.indexOf("#page")==0||hash==""){
            prevIndex=curIndex
            curIndex=parseInt(hash.substr(5))||0
            if(curIndex>prevIndex){
                ep.emit("rightScene",function(){
                    ep.emit("init")
                })
            }else{
                ep.emit("leftScene",function(){
                    ep.emit("init")
                })
            }
        }
    }
    //场景切换
    ep.on("rightScene",function(callback){
        page.eq(prevIndex).addClass('abs slideOutLeft animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
            $(this).removeClass("abs slideOutLeft animated").hide()
        });
        page.eq(curIndex).show().addClass('abs slideInRight animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
            $(this).removeClass("abs slideInRight animated");
            callback()
        });
    })
    ep.on("leftScene",function(callback){
        page.eq(prevIndex).addClass('abs slideOutRight animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
            $(this).removeClass("abs slideOutRight animated").hide()
        });
        page.eq(curIndex).show().addClass('abs slideInLeft animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
            $(this).removeClass("abs slideInLeft animated");
            callback()
        });
    })
    function animate(name,ele,callback){

            ele.addClass(name+' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                $(this).removeClass(name+" animated")
                callback&&callback()
            });
    }
    ep.on("nextScene",function(callback){
        location.hash="#page"+(curIndex+1);
    })
    ep.on("init",function(){
        cc.log("init")
        page.hide()
        curIndex=prevIndex=parseInt(location.hash.substr(5))||0
        page.eq(curIndex).show()
        cc.log(curIndex)
        ep.emit("page"+curIndex)
    })
    ep.all("page0",function(){
        cc.log("page0")
        //名字选择 下一步
        var nameArr=[ $("#name"),$("#page1_next")]
        nameArr[1].on("click",function(e){
            var name=nameArr[0].val()
            if(/^[\u4E00-\u9FA5]+$/.test(name)){
                localStorage.name=name
                location.hash="#page1";
            }else{
                animate("shake",$("#name"))
            }

        })
    })
    ep.all("page1",function(){
        cc.log("page1")
        //性别选择 下一步
        var sexArr=[$("#man"),$("#woman"),$("#page2_next")]
        localStorage.sex=0
        sexArr[0].on("click",function(){
            localStorage.sex=1
            sexArr[0].removeClass("off")
            sexArr[0].addClass("on")
            sexArr[1].removeClass("on")
            sexArr[1].addClass("off")
        })
        sexArr[1].on("click",function(){
            localStorage.sex=2
            sexArr[1].removeClass("off")
            sexArr[1].addClass("on")
            sexArr[0].removeClass("on")
            sexArr[0].addClass("off")
        })
        sexArr[2].on("click",function(e){
            if(localStorage.sex!=0){
                location.hash="#page2";
            }else{
                animate("swing",sexArr[0])
                animate("swing",sexArr[1])
            }
        })
    })

    ep.all("page2",function(){
        cc.log("page2")
        //属相选择 下一步
        var xinglist=$("#shuxiang li");
        localStorage.shuxiang=-1
        xinglist.each(function(i){
            $(this).click(function(){
                xinglist.removeClass("on")
                $(this).addClass("on")
                localStorage.shuxiang=i
            })
        })
        $("#page3_next").click(function(){
            if(localStorage.shuxiang!=-1){
                location.hash="#page3";
            }else{
                animate("swing",xinglist)
            }
        })
    })
    ep.all("page3",function(){
        cc.log("page3")
        //星座选择 下一步
        var xinglist=$("#xingzuo li");
        localStorage.xingzuo=-1
        xinglist.each(function(i){
            $(this).click(function(){
                xinglist.removeClass("on")
                $(this).addClass("on")
                localStorage.xingzuo=i
            })
        })
        $("#page4_next").click(function(){
            if(localStorage.xingzuo!=-1){
                location.hash="#page4";
            }else{
                animate("swing",xinglist)
            }
        })
    })
    ep.all("page4",function(){
        cc.log("page4")
        //头像选择 下一步
        seajs.use("http://res.wx.qq.com/open/js/jweixin-1.0.0.js",function(wx){
            var photoArr=[$("#photo"),$("#page5_next")]
            $.get("/weixin/getConfig",{url:location.href},function(data){
                wx.config({
                    debug:true,
                    appId: data.appId,
                    timestamp: data.timestamp,
                    nonceStr: data.nonceStr,
                    signature: data.signature,
                    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage','onMenuShareQQ','onMenuShareWeibo',"chooseImage","uploadImage","downloadImage"]
                });
            })
            wx.ready(function(){
                $("#photoclick").click(function(){
                    wx.chooseImage({
                        count: 9, // 默认9
                        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                        success: function (res) {
                            var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                            photoArr[0].attr("src",localIds[0])
                        }
                    });
                })
                $("#page5_next").click(function(){
                    WeixinJSBridge.invoke("addContact", {webtype: "1",username: "wx904a94d5a8508109"}, function(e) {
                        WeixinJSBridge.log(e.err_msg);
                        //e.err_msg:add_contact:added 已经添加
                        //e.err_msg:add_contact:cancel 取消添加
                        //e.err_msg:add_contact:ok 添加成功
                        if(e.err_msg == 'add_contact:added' || e.err_msg == 'add_contact:ok'){
                            //关注成功，或者已经关注过
                        }
                    })
                })
            })

        })
//        $("#page5_next").click(function(){
//            location.hash="#page5";
//        })
    })
    ep.all("page5",function(){
        cc.log("page5")
        //选择英文名 下一步
        var tips=$("#englishname li .tip")
        $("#englishname li .div1 .fui-triangle-down").each(function(i){
            var tip=tips.eq(i)
            $(this).click(function(){
                tips.hide()
                tip.show()
                animate("fadeInDown",tip)
                $(".page5").one("click",function(){
                    tip.hide()
                })
                return false
            })
            tip.click(function(){
                return false
            })
        })
        $("#englishname li .tip .icon2").each(function(){
            $(this).click(function(){
                $(this).parent().hide()
            })
        })
        //音乐
        $("#englishname li .div2 span").each(function(i,ele){
            if( $(this).children("audio").length>0){
                $(this).children("audio")[0].addEventListener("ended",function(){
                    $(ele).removeClass("fui-play fui-pause")
                    $(ele).addClass("fui-volume")
                })
            }
            $(this).click(function(){
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
        })
         //选择
        localStorage.englistname=-1
        var xuanzlist=$("#englishname li .div3")
        $("#englishname li .div3").each(function(i,ele){
            $(this).click(function(){
                localStorage.englistname=i
                $("#englishname li .div3 span").removeClass("on")
                $(this).children("span").addClass("on")
            })
        })
        $("#page6_next").click(function(){
            if(localStorage.englistname!=-1){
                location.hash="#page6";
            }else{
                animate("swing",xuanzlist)
            }
        })
    })
    ep.all("page6",function(){
        cc.log("page6")
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
    ep.emit("init")
});

