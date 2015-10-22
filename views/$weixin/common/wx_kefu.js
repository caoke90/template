var ep=require("./wx_config")
var needle = require('needle');
//客服接口
module.exports={
    //发送客服接口
    postAll:function(data,callback){
        ep.emit("gettoken",function(data2){
            needle.post("https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token="+data2.access_token,data,{json:true},function(err,resp,body){
                callback(err,body)

            })
        })
    },
    //发送客服消息
    postText:function(openid,content,callback){
        var data={
            "touser":openid,
            "msgtype":"text",
            "text":
            {
                "content":content
            }
        }
        this.postAll(data,callback)
    },
    //发送客服图片
    postImage:function(openid,media_id,callback){
        var data={
            "touser":openid,
            "msgtype":"image",
            "image":
            {
                "media_id":media_id
            }
        }
        this.postAll(data,callback)
    },
    //发送语音消息
    postVoice:function(openid,media_id,callback){
        var data={
            "touser":openid,
            "msgtype":"voice",
            "voice":
            {
                "media_id":media_id
            }
        }
        this.postAll(data,callback)
    },
    //发送视频消息
    postVideo:function(openid,media_id,title,description,callback){
        var data={
            "touser":openid,
            "msgtype":"video",
            "video":
            {
                "media_id":media_id,
                "thumb_media_id":media_id,
                "title":"TITLE",
                "description":"DESCRIPTION"
            }
        }
        this.postAll(data,callback)
    },
    //发送音乐消息
    postMusic:function(openid,title,description,url,url2,thumb_media_id,callback){
        var data={
            "touser":openid,
            "msgtype":"music",
            "video":
            {
                "title":"MUSIC_TITLE",
                "description":"MUSIC_DESCRIPTION",
                "musicurl":url,
                "hqmusicurl":url2,
                "thumb_media_id":thumb_media_id
            }
        }
        this.postAll(data,callback)
    },
    //发送图文消息
    postNews:function(openid,news,callback){
        var data={
            "touser":openid,
            "msgtype":"news",
            "news":{
                "articles": [
                    {
                        "title":"Happy Day",
                        "description":"Is Really A Happy Day",
                        "url":"URL",
                        "picurl":"PIC_URL"
                    },
                    {
                        "title":"Happy Day",
                        "description":"Is Really A Happy Day",
                        "url":"URL",
                        "picurl":"PIC_URL"
                    }
                ]
            }
        }
        this.postAll(data,callback)
    }
}
//module.exports.postText("oX8oewWfMelNMsoV0VVv1N5LyEb0","游鱼,你好！哈哈，游鱼、还是鱿鱼",function(json){
//    cc.log(json)
//})
