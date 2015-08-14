define(function(require, exports, module) {
    require("dragula.css")
    require("dragula")
    var arr=[]
    $("[jsui=demo]").each(function(){
        arr.push(this)
    })
    dragula(arr,{
        item:"div"
    })
        .on("cloned",function(copy,ele){
            cc.log("cloned")
        })
        .on("dragend",function(copy,ele){
            cc.log("dragend")
        })
        .on("out",function(copy,ele){
            cc.log("out")
        })
        .on("drag",function(copy,ele){
            cc.log("drag")
        })
        .on("drop",function(copy,ele){
            cc.log("drop")
        })
//    dragula([arr[0]],{copy:true})
//        .on("cloned",function(copy,ele){
//            cc.log("cloned")
//            $(copy).html($(ele).html()+" cloned")
//        })
//    dragula([$('#left1')[0], $('#right1')[0]],{copy:true})
//        .on("cloned",function(copy,ele){
//            cc.log("cloned")
//
//            $(copy).html($(ele).html()+" cloned")
//            cc.log(copy)
//        })
//    dragula([$('#right1')[0]],{removeOnSpill:true})
//        .on("cloned",function(copy,ele){
//            cc.log("cloned")
//            $(copy).html("cloned")
//            cc.log(copy)
//        })
});

