_=require("underscore")

cc=require("./cc")

Wind = require("wind");
Wind.logger.level = Wind.Logging.Level.WARN;

AV=require("./Api.AV")
fs=require("./Api.fs")
needle=require("./Api.needle")

weixin=require("./Api.weixin")

var Api=module.exports

Api.use$Path=function(router,path){
    var fs=require("fs")
    //自动加载路径
    fs.readdir(path,function(err,list){
        list.forEach(function(v,k){
            if(v.indexOf("$")==0){
                if(v.substr(v.length-3, v.length)==".js"){
                    router.use("/",require(path+"/"+ v))
                }else{
                    router.use("/"+ v.substr(1, v.length),require(path+"/"+ v))
                }

            }

        })
    })
}

Api.useWindjs=function(router){
    router.getAsync = function (path, handler) {
        router.get(path, function (req, res, next) {
            handler(req, res, next).start();
        });
    }
    router.postAsync = function (path, handler) {
        router.post(path, function (req, res, next) {
            handler(req, res, next).start();
        });
    }
    router.allAsync = function (path, handler) {
        router.all(path, function (req, res, next) {
            handler(req, res, next).start();
        });
    }
    router.useAsync = function (path, handler) {
        router.use(path, function (req, res, next) {
            handler(req, res, next).start();
        });
    }

}

Api.useCookieSession=function(router){
    router.use(AV.Cloud.CookieSession({ secret: 'donut',fetchUser:true}));
}

