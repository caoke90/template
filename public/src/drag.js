define('donut/rename/1.0.0/drag',function(require, exports, module) {
    require("dragula.css")
    require("dragula")
    var arr=[]
    var sp=dragula(arr)
        .on("cloned",function(copy,ele){
            cc.log("cloned")
        })
        .on("drag",function(copy,ele){
            cc.log("drag")
        })
        .on("dragend",function(copy,ele){
            cc.log("dragend")
        })
        .on("out",function(copy,ele){
            cc.log("out")
        })

        .on("drop",function(copy,ele){
            cc.log("drop")
        })
    $("#add").click(function(){
        $("body").append($("[jsui=drag]").eq(0).clone())
    })
    module.exports=function(e){
        sp.containers.push(e)
    }
});

