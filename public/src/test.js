define(["../js/jquery-1.11.3.min","../js/jweixin-1.0.0"],function($,wx) {
//avalon
    var vm= avalon.define({
        $id: "test",
        name: "",
        shiyi: "",
        hanname: ""
    })
    avalon.scan()
    $.get("/rename/getdata2",{
        name:"Cash",
        sex:"boy"
    },function(item){
        vm.name=item.name
        vm.shiyi=item.shiyi
        vm.hanname=item.hanname
    })
    //ui
    var ele=$(".page6")
    $(".btn1",ele).click(function (ele) {
        if ($(this).children("audio")[0].paused) {
            $(this).children("audio")[0].play()
            $(this).removeClass("fui-volume fui-play")
            $(this).addClass("fui-pause")
        } else {
            $(this).children("audio")[0].pause()
            $(this).removeClass("fui-volume fui-pause")
            $(this).addClass("fui-play")
        }
    })
    $(".btn1",ele).children("audio")[0].addEventListener("ended", function () {
        $(".page6 .btn1").removeClass("fui-play fui-pause")
        $(".page6 .btn1").addClass("fui-volume")
    })
    $(".btn2",ele).click(function () {
        if ($(".tip",ele).is(":hidden")) {
            $(".tip",ele).show()
            $(ele).one("click", function () {
                $(".tip",ele).hide()
            })
            return false
        }else{
            $(".tip",ele).hide()
        }

    })
    $(".tip",ele).click(function () {
        return false
    })
    //微信

    $.get("/weixin/getconfig", {url: location.href}, function (data) {
        wx.config({
            debug: false,
            appId: data.appId,
            timestamp: data.timestamp,
            nonceStr: data.nonceStr,
            signature: data.signature,
            jsApiList: [
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                "chooseImage",
                "uploadImage",
                "downloadImage"
            ]
        });

    })
    wx.showOptionMenu();
    wx.onMenuShareTimeline({
        title: '我的新东方小伙伴多纳， 翻遍大英词典，给我起了最炫英文名！', // 分享标题
        link: location.href, // 分享链接
        imgUrl: location.origin + '/images/rename/guanzhu_3.png', // 分享图标
        success: function () {
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });
    wx.onMenuShareAppMessage({
        title: '宝宝英文取名神器', // 分享标题
        desc: '我的新东方小伙伴多纳， 翻遍大英词典，给我起了最炫英文名！', // 分享描述
        link: location.href, // 分享链接
        imgUrl: location.origin + '/images/rename/guanzhu_3.png', // 分享图标
        type: '', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function () {
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });
    wx.onMenuShareQQ({
        title: '宝宝英文取名神器', // 分享标题
        desc: '我的新东方小伙伴多纳， 翻遍大英词典，给我起了最炫英文名！', // 分享描述
        link: location.href, // 分享链接
        imgUrl: location.origin + '/images/rename/guanzhu_3.png', // 分享图标
        success: function () {
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });
    wx.onMenuShareWeibo({
        title: '宝宝英文取名神器', // 分享标题
        desc: '我的新东方小伙伴多纳， 翻遍大英词典，给我起了最炫英文名！', // 分享描述
        link: location.href, // 分享链接
        imgUrl: location.origin + '/images/rename/guanzhu_3.png', // 分享图标
        success: function () {
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });
    wx.onMenuShareQZone({
        title: '宝宝英文取名神器', // 分享标题
        desc: '我的新东方小伙伴多纳， 翻遍大英词典，给我起了最炫英文名！', // 分享描述
        link: location.href, // 分享链接
        imgUrl: location.origin + '/images/rename/guanzhu_3.png', // 分享图标
        success: function () {
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });
});

