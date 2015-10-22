var _=require("underscore")
var Wind = require("wind");

/*
网络请求
 */
var needle=require("needle");
module.exports=needle;
//获取json
needle.getJSONAsync=Wind.Async.Binding.fromCallback(function(url,callback){
    needle.get(url,function(err,resp,body){
        if(typeof body=="string"){
            callback(JSON.parse(body))
        }else{
            callback(body)
        }

    })
})
needle.getAsync=Wind.Async.Binding.fromCallback(function(url,callback){
    needle.get(url,function(err,resp,body){
        if(err){
            return callback()
        }
        callback(resp.body)
    })
})
needle.postAsync=Wind.Async.Binding.fromCallback(function(url,callback){
    var arr= _.initial(arguments)
    var callback=_.last(arguments)
    arr.push(function(err,resp){
        if(err){
            return callback()
        }
        callback(resp.body)
    })
    needle.post.apply(needle,arr)
})

