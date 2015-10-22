var EventProxy = require('eventproxy');
var weixinapi=new EventProxy()
var crypto = require('crypto');
var xml2js = require('xml2js');
var needle = require('needle');
var User=require("./userapi");

weixinapi.on("text",function(msg){
    var result = {
        xml: {
            ToUserName: msg.xml.FromUserName.toString(),
            FromUserName: msg.xml.ToUserName.toString(),
            CreateTime: new Date().getTime(),
            MsgType: 'text',
            Content: "text"
        }
    }
    var builder = new xml2js.Builder();
    var xml = builder.buildObject(result);

    weixinapi.emit("success",xml)
})
weixinapi.on("image",function(msg){
    var result = {
        xml: {
            ToUserName: msg.xml.FromUserName.toString(),
            FromUserName: msg.xml.ToUserName.toString(),
            CreateTime: new Date().getTime(),
            MsgType: 'text',
            Content: "image"
        }
    }
    var builder = new xml2js.Builder();
    var xml = builder.buildObject(result);

    weixinapi.emit("success",xml)
})
weixinapi.on("voice",function(msg){
    var user=User()
    user.emit("user_next",{
        openid:msg.xml.FromUserName.toString(),
        media_id:msg.xml.MediaId
    })
    user.on("error",function(data){
        cc.log(data)
    })

})
weixinapi.on("event",function(msg){
    var user=User()
    if(msg.xml.EventKey=="game_began"){
        user.emit("user_init",{
            openid:msg.xml.FromUserName.toString(),
            paper:"test"
        })
        user.on("error",function(data){
            cc.log(data)
        })
    }

})

module.exports=weixinapi