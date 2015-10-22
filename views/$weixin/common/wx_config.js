var EventProxy = require('eventproxy');
var ep=new EventProxy();
module.exports=ep
var needle = require('needle');
//var appId="wx904a94d5a8508109";
//var secret='eb37a11eda98361a2e8af610ad4a7f1f';
var appId="wx93ee70ac78ebc759";
var secret='7be9e573b0bfb2efb6a5d65930b81773';

var access_token="";
var jsapi_ticket=""
//获取token
ep.on("gettoken",function(callback){
    if(access_token){
        callback({
            appId:appId,
            secret:secret,
            access_token:access_token
        })
    }else{
        needle.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+appId+'&secret='+secret, function(err, resp,body) {
            cc.log(body)
            access_token=body.access_token;
            callback({
                appId:appId,
                secret:secret,
                access_token:access_token
            })
        })
        setTimeout(function(){
            access_token=""
        },7100000)
    }

})

//获取jsapi_ticket
ep.on("getticket",function(callback){
    ep.emit("gettoken",function(data){
        needle.get('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token='+data.access_token+'&type=jsapi',function(err,resp,body2){
            cc.log(body2.ticket)
            jsapi_ticket=body2.ticket
            callback({
                appId:data.appId,
                secret:data.secret,
                access_token:data.access_token,
                jsapi_ticket:jsapi_ticket
            })
        })
    })
})
