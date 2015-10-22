var AV = require('leanengine');
var xml2js = require('xml2js');
var needle = require('needle');
var path=require("path");

var Users = AV.Object.extend("wx_users");
var Users_query = new AV.Query(Users);

var Titles = AV.Object.extend("music")
var Titles_query=new AV.Query(Titles);


var EventProxy = require('eventproxy');



module.exports=function(){
    var ep = new EventProxy();
//发送当前题目
    ep.all('data_success',"Titles_success","user_init_success","postVoice_success",function(data,Titles,user){
        cc.log("postText")
        var paper=user.get("paper")
        var curtitle=user.get("curtitle")
        var title=Titles[curtitle]
        var kefu=require("./wx_kefu")
        kefu.postText(data.openid,"请读第一句："+title.get("cntxt"),function(json){
            ep.emit("postText_success",json)
            cc.log("over")
        })
    })

    ep.all('data_success',"Titles_success","user_init_success",function(data,Titles,user){
        cc.log("postVoice")
        var paper=user.get("paper")
        var curtitle=user.get("curtitle")
        var title=Titles[curtitle]
        ep.emit("postVoice",{
            openid:data.openid,
            media_id:title.get("media_id"),
            title:title
        })
    })
    ep.on("error",function(json){
        cc.log(json)
    })
    ep.all('data_success',"Titles_success","user_next_success","analysis_success","postVoice_success",function(data,Titles,user,analysis){
        cc.log("postText")
        var paper=user.get("paper")
        var curtitle=user.get("curtitle")
        var title=Titles[curtitle]
        var kefu=require("./wx_kefu")
        kefu.postText(data.openid,parseInt(analysis.Sentence.SentenceScore)+"分。请读下一句:"+title.get("cntxt"),function(json){
            cc.log("postText_success")
            ep.emit("postText_success",json)
        })
    })
    ep.on("postVoice",function(data){
        var title=data.title
        var kefu=require("./wx_kefu")
        kefu.postVoice(data.openid,data.media_id,function(json){
            cc.log("post media_id")
            cc.log(json)
            if(json.errcode==40007){
                ep.on("uploadmp3_success",function(data2){
                    ep.emit("postVoice",{
                        openid:data.openid,
                        media_id:data2.media_id
                    })
                })
                ep.emit("uploadmp3",title)
            }
            if(json.errcode==0){
                ep.emit("postVoice_success",title)
            }else{
                ep.emit("error",json)
            }
        })
    })
    ep.all('data_success',"Titles_success","user_next_success",function(data,Titles,user){
        cc.log("postVoice")
        var paper=user.get("paper")
        var curtitle=user.get("curtitle")
        var title=Titles[curtitle]
        ep.emit("postVoice",{
            openid:data.openid,
            media_id:title.get("media_id"),
            title:title
        })
    })
    ep.all('data_success',"user_end_success","analysis_success","postText",function(data,user,analysis){
        cc.log("post user_end")
        var kefu=require("./wx_kefu")
        kefu.postText(data.openid,parseInt(analysis.Sentence.SentenceScore)+"分。结束:",function(json){
            cc.log("over")
            ep.emit("success",json)
        })
    })
    ep.on("user_end_success",function(user){
        ep.emit("postText")
    })
    ep.on("postVoice_success",function(){
        ep.emit("postText")
    })

//重新上传media_id
    ep.once("uploadmp3",function(title){
        cc.log("uploadmp3")
        var url=title.get("oriurl")
        needle.get(url,function(err,resp,buff){
            var data = {
                media:{
                    buffer:buff,
                    filename:path.basename(url),
                    content_type: 'audio/mp3'
                }
            }
            needle.post('https://api.weixin.qq.com/cgi-bin/media/upload?access_token='+access_token+'&type=voice', data, { multipart: true,boundary:"--------------------NODENEEDLEHTTPCLIENT\r\n" }, function(err, resp, body) {
                var json=JSON.parse(body)
                cc.log(json.media_id)
                title.set("media_id",json.media_id)
                title.save({
                    success:function(){
                        ep.emit("uploadmp3_success",json)
                    }
                })
            });
        })

    })

//获取之前测评结果
    ep.all("data_success","user_next_success","Titles_success","analysis",function(data,user,Titles){
        cc.log("analysis")
        var paper=user.get("paper")
        var curtitle=user.get("curtitle")-1
        cc.log(user.get("curtitle"))
        var title=Titles[curtitle]

        var data1={
            token:access_token,
            media_id:data.media_id,
            wavid:title.get("wav_id"),
            root:title.get("wav_root"),
            jac:"xdf123"
        }
        needle.get("http://xdf.kouyu100.com/analysis/analysis4xdf.jsp?token=" + data1.token + "&mediaId="+ data1.media_id + "&asr=1&wavid=" + data1.wavid + "&root=" + data1.root+ "&jac=xdf123",function(err,resp,body){
            xml2js.parseString(body, function(err, json) {
                ep.emit("analysis_success",json)
            });
        })
    })
    ep.all("data_success","user_end_success","Titles_success","analysis",function(data,user,Titles){
        cc.log("analysis")
        var paper=user.get("paper")
        var curtitle=user.get("curtitle")-1
        cc.log(user.get("curtitle"))
        var title=Titles[curtitle]

        var data1={
            token:access_token,
            media_id:data.media_id,
            wavid:title.get("wav_id"),
            root:title.get("wav_root"),
            jac:"xdf123"
        }
        needle.get("http://xdf.kouyu100.com/analysis/analysis4xdf.jsp?token=" + data1.token + "&mediaId="+ data1.media_id + "&asr=1&wavid=" + data1.wavid + "&root=" + data1.root+ "&jac=xdf123",function(err,resp,body){
            xml2js.parseString(body, function(err, json) {
                ep.emit("analysis_success",json)
            });
        })
    })
//获取所有的题目
    ep.once("Titles",function(){
        Titles_query.limit(10);
        Titles_query.find({
            success: function(Titles) {
                ep.emit("Titles_success",Titles)
            },
            error: function(error) {
            }
        })
    })
//不存在就，创建用户
    ep.all("data_success","user_new",function(data,user_new){
        var user = new Users()
        user.save({
            openid:data["openid"],
            xx:0,
            gold:0,
            score:0,
            curtitle:0,
            paper:"test"
        },{
            success: function(user) {
                ep.emit("user_new_success",user)
            },
            error: function(error) {
            }
        });
    })
//存在就，重置用户的属性
    ep.all("data_success","user_success","user_init",function(data,user){
        cc.log("user_init")
        user.set('curtitle',0);
        user.set('paper',data["paper"]);
        user.save({
            success: function(user) {
                ep.emit("user_init_success",user)
            },
            error: function(error) {

            }
        });
    })

    ep.all("data_success","user_success","Titles_success","user_next",function(data,user,Titles){
        cc.log("user_next")
        var curtitle=user.get("curtitle")
        if(!Titles[curtitle]){
            cc.log("没有试题了，游戏结束！")
            return;
        }
        if(!Titles[curtitle+1]){
            user.set('curtitle',curtitle+1);
            user.save({
                success: function(user) {
                    ep.emit("user_end_success",user)
                },
                error: function(error) {
                }
            });
            return;
        }
        user.set('curtitle',curtitle+1);
        user.save({
            success: function(user) {
                ep.emit("user_next_success",user)
            },
            error: function(error) {

            }
        });
    })
    ep.all("data_success","user",function(data){
        Users_query.equalTo("openid", data["openid"]);
        Users_query.first({
            success: function(user) {
                if(user){
                    ep.emit("user_success",user)
                }else{
                    cc.log("new user")
                    ep.on("user_new_success",function(user){
                        ep.emit("user_success",user)
                    })
                    ep.emit("user_new")
                }
            },
            error: function(error) {

            }
        });
    })
    ep.on("user_init",function(data){
        ep.emit("data_success",data)
        ep.emit("user")
        ep.emit("Titles")

    })
    ep.on("user_next",function(data){
        ep.emit("data_success",data)
        ep.emit("Titles")
        ep.emit("user")
        ep.emit("analysis")
    })
//监听请求
    return ep
}