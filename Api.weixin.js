
var AV=require("./Api.AV")
var needle=require("./Api.needle")
var Wind=require("wind")
/*
 微信部分
 */
//var appId="wx904a94d5a8508109";
//var secret='eb37a11eda98361a2e8af610ad4a7f1f';
var appId="wx93ee70ac78ebc759";
var secret='7be9e573b0bfb2efb6a5d65930b81773';
var cache_token="";
var cache_updateAt;

var weixin=module.exports
weixin.getappId=function(){
    return appId
}
weixin.getsecret=function(){
    return secret
}
weixin.gettoken=eval(Wind.compile("async", function () {
    //如果缓存不存在或者缓存失效
    if(!cache_token||((new Date()).getTime()-cache_updateAt.getTime())/1000>7100){
        var post=$await(AV.firstAsync("wp_options",function(query){
            query.equalTo("key","wxtoken")
        }))
        if(!post) {
            var json = $await(needle.getJSONAsync('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + appId + '&secret=' + secret))
            post = $await(AV.saveAsync("wp_options", {key: "wxtoken", value: json.access_token}))
        }
        cache_token=post.get("value")
        cache_updateAt=post.updatedAt
    }
    return {
        appId:appId,
        secret:secret,
        access_token:cache_token
    }

}));
weixin.getticket = eval(Wind.compile("async", function () {
    var data=$await(weixin.gettoken())
    var json = $await(needle.getJSONAsync('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token='+data.access_token+'&type=jsapi'))
    return {
        appId:data.appId,
        secret:data.secret,
        access_token:data.access_token,
        jsapi_ticket:json.ticket
    }
}));
//测试
//var test = eval(Wind.compile("async", function () {
//
//    var dd=$await(weixin.getticket())
////
//    console.log(dd)
//}));
//
//test().start();