
var Wind = require("wind")
Wind.logger.level = Wind.Logging.Level.WARN;

var AV = require('leanengine');
module.exports=AV;
/*
 数据库
 */

//var APP_ID = process.env.LC_APP_ID||"fyhb7s5ls1fvj6qucc9vwum9ko1qgk2gwag2yo6ii1iib6qz";
//var APP_KEY = process.env.LC_APP_KEY||"v5vu8fodj81waus8k2xacdtllnq5uochurzufflwqs3b0ntg";
//var MASTER_KEY = process.env.LC_APP_MASTER_KEY||"7gdwbl2ks846axc7kdoemw1eb4m8m90xr9p3w9k64jo89502";
//多纳学英语测试
var APP_ID = process.env.LC_APP_ID||"0fp663d00686fc25lrxa9nco3gvm1lj7vidg683n5pvpsedg";
var APP_KEY = process.env.LC_APP_KEY||"vkndqfc195hbd27ou5d18yt718tf9qzwje91rv5naqw2py9k";
var MASTER_KEY = process.env.LC_APP_MASTER_KEY||"2r5718u4x0128vifvpo7ywcfmn7tisd00j1218kx3fg95cri";

AV.initialize(APP_ID, APP_KEY, MASTER_KEY);
// 如果不希望使用 masterKey 权限，可以将下面一行删除
AV.Cloud.useMasterKey();
//登录
AV.logInAsync=Wind.Async.Binding.fromCallback(function(myname,mypass,callback){
    AV.User.logIn(myname, mypass, {
        success: function(user) {
            callback(user)
        },
        error: function(user, error) {
            callback()
        }
    });
})
AV.signUpAsync=Wind.Async.Binding.fromCallback(function(func,callback){
    var user = new AV.User();
    func&&func(user)
    user.signUp(null,{
        success: function(user) {
            callback(user)
        },
        error: function(user, error) {
            callback()
        }
    });
})
//保存对象
AV.saveAsync=Wind.Async.Binding.fromCallback(function(tablename,json,callback){
    var Post = AV.Object.extend(tablename);
    var post = new Post();
    post.save(json, {
        success: function(post) {
            callback(post)
        },
        error: function(post, error) {
            callback()
        }
    });
})
AV.postsaveAsync=Wind.Async.Binding.fromCallback(function(post,callback){
    post.save(null, {
        success: function(post) {
            callback(post)
        },
        error: function(post, error) {
            callback()
        }
    });
})
//检索post
AV.getAsync=Wind.Async.Binding.fromCallback(function(tablename,objectId,callback){
    var Post = AV.Object.extend(tablename);
    var query = new AV.Query(Post);
    query.get(objectId, {
        success: function(post) {
            // 成功，回调中可以取得这个 Post 对象的一个实例，然后就可以修改它了
            callback(post)
        },
        error: function(object, error) {
            // 失败了.
            callback()
        }
    });
})
  //更新一个post
AV.upAPostAsync=Wind.Async.Binding.fromCallback(function(post,json,callback){
    post.save(json, {
        success: function(post) {
            callback(post)
        },
        error: function(post, error) {
            callback()
        }
    });
})
//删除一个post
AV.destroyAsync=Wind.Async.Binding.fromCallback(function(post,callback){
    post.destroy({
        success: function(post) {
            callback(post)
        },
        error: function(post, error) {
            callback()
        }
    });
})
//删除多个post
AV.destroyAllAsync=Wind.Async.Binding.fromCallback(function(objects,callback){
    AV.Object.destroyAll(objects,{
        success: function(post) {
            callback(post)
        },
        error: function(post, error) {
            callback()
        }
    });
})

//查询
AV.findAsync=Wind.Async.Binding.fromCallback(function(tablename,condition,callback){
    var Post = AV.Object.extend(tablename);
    var query = new AV.Query(Post);
    condition&&condition(query)
    query.find({
        success: function(results) {
            callback(results)
        },
        error: function(error) {
            callback()
        }
    });
})
AV.queryfindAsync=Wind.Async.Binding.fromCallback(function(query,callback){
    query.find({
        success: function(results) {
            callback(results)
        },
        error: function(error) {
            callback()
        }
    });
})

AV.firstAsync=Wind.Async.Binding.fromCallback(function(tablename,condition,callback){
    var Post = AV.Object.extend(tablename);
    var query = new AV.Query(Post);
    condition&&condition(query)
    query.first({
        success: function(post) {
            callback(post)
        },
        error: function(error) {
            if(error.code==101){
                callback()
            }
        }
    });
})
AV.queryfirstAsync=Wind.Async.Binding.fromCallback(function(query,callback){
    query.first({
        success: function(post) {
            callback(post)
        },
        error: function(error) {
            if(error.code==101){
                callback()
            }
        }
    });
})
//计数查询
AV.countAsync=Wind.Async.Binding.fromCallback(function(tablename,condition,callback){
    var Post = AV.Object.extend(tablename);
    var query = new AV.Query(Post);
    condition&&condition(query)
    query.count({
        success: function(count) {
            callback(count)
        },
        error: function(error) {
            callback()
        }
    });
})
AV.querycountAsync=Wind.Async.Binding.fromCallback(function(query,callback){
    query.count({
        success: function(count) {
            callback(count)
        },
        error: function(error) {
            callback()
        }
    });
})
/*业务逻辑
//更新或者添加对象
 */
AV.updataAsync=eval(Wind.compile("async", function (tablename,objectId,json){
    var post=$await(AV.getAsync(tablename,objectId))
    var post2=null;
    if(post){
        post2=$await(AV.upAPostAsync(post,json))
    }else{
        post2=$await(AV.saveAsync(tablename,json))
    }
    return post2

}))
//测试
//var test = eval(Wind.compile("async", function () {
//
//    var post=$await(AV.getAsync("Test","5562c1c7e4b097545d515c42"))
//    post.get("abcde")
//    console.log(post)
//}));
//
//test().start();

