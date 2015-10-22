//异步公共代码!
var router = require('express').Router();
var Api=require("../../Api")
//使用windjs
Api.useWindjs(router)
Api.use$Path(router,__dirname)
module.exports = router;

//公共方法
function strTonum(str){
    var num=0
    for(var i=0;i<str.length;i++){
        num+=str.charCodeAt(i)
    }
    return num
}
function getNameByArray(pinyin,arr){
    var some=_.filter(arr,function(v){
        return v.name.toLowerCase()[0]==pinyin[0]
    })
    var temp=pinyin.replace(new RegExp(pinyin[0],"g"),"")
    if(temp.split("-")[1]){
        some=some.concat(_.filter(arr,function(v){
            return v.name.toLowerCase()[0]==temp.split("-")[1][0]
        }))
    }else{
        if(temp[0]){
            some=some.concat(_.filter(arr,function(v){
                return v.name.toLowerCase()[0]==temp[0]
            }))
        }
    }
    var some2=_.sortBy(some, function(e1){ return Math.abs(strTonum(e1.name)-strTonum(pinyin)); });
    some2=_.uniq(some2,true,"name")
    var arr=[some2[0],some2[1],some2[_.random(2, some2.length-1)]]
    return arr
}

//缓存
var cache={
    install:false
}
//设置缓存
var setCacheAsync=eval(Wind.compile("async", function () {
    var fs=require("fs");
    if(!cache["boy"]){
        var get_boyAsync=$await(AV.firstAsync("aglobal",function(query){
            query.equalTo("key","boy")
        }))
        //不存在就安装数据
        if(!get_boyAsync){
            get_boyAsync=$await(AV.saveAsync("aglobal",{
                key:"boy",
                value:JSON.parse(fs.readFileSync(__dirname+"/boy.json").toString())
            }))
        }
        cache["boy"]=get_boyAsync.get("value")
    }
    if(!cache["girl"]){
        var get_girlAsync=$await(AV.firstAsync("aglobal",function(query){
            query.equalTo("key","girl")
        }))
        //不存在就安装数据
        if(!get_girlAsync){
            get_girlAsync=$await(AV.saveAsync("aglobal",{
                key:"girl",
                value:JSON.parse(fs.readFileSync(__dirname+"/girl.json").toString())
            }))
        }
        cache["girl"]=get_girlAsync.get("value")
    }
}));
//设置缓存 静默安装
router.useAsync("/",eval(Wind.compile("async", function (req, res ,next) {
    //初始化
    $await(setCacheAsync())
    next()
})))
//清理缓存
router.getAsync("/clear",eval(Wind.compile("async", function (req, res) {
    //初始化
    cache={}
    res.send("缓存清理成功")
})))
//获取3个name
router.getAsync("/getdata1",eval(Wind.compile("async", function (req, res) {
    console.log(21)
    var data={
        name:req.query.name||"曹科"
    }
    var slugify = require('transliteration').slugify;

    var arr=[];

    if(data.sex=="boy"){
        arr=arr.concat(cache["boy"])
    }
    if(data.sex=="girl"){
        arr=arr.concat(cache["girl"])
    }
    if(!data.sex){
        arr=arr.concat(cache["boy"],cache["girl"])
    }
    var pinyin=slugify(data.name)
    cc.log(pinyin)
    var some=getNameByArray(pinyin,arr)
    res.jsonp(some)
})))
router.getAsync("/getdata2",eval(Wind.compile("async", function (req, res) {

    var data={
        name:req.query.name||"Cedric"
    }
    var arr=[];
    if(data.sex=="boy"){
        arr=arr.concat(cache["boy"])
    }
    if(data.sex=="girl"){
        arr=arr.concat(cache["girl"])
    }
    if(!data.sex){
        arr=arr.concat(cache["boy"],cache["girl"])
    }
    var item= _.find(arr,function(ele){
        return ele.name.toLowerCase()==data.name.toLowerCase()
    })||{}
    res.jsonp(item)

})))
//通过name获取微信分享内容
router.getAsync("/page6.html",eval(Wind.compile("async", function (req, res) {

    var data={
        name:req.query.name||"Cedric"
    }
    var arr=[];
    if(data.sex=="boy"){
        arr=arr.concat(cache["boy"])
    }
    if(data.sex=="girl"){
        arr=arr.concat(cache["girl"])
    }
    if(!data.sex){
        arr=arr.concat(cache["boy"],cache["girl"])
    }
    var item= _.find(arr,function(ele){
        return ele.name.toLowerCase()==data.name.toLowerCase()
    })||{}
    res.render(__dirname+"/page6",{item:item})

})))
