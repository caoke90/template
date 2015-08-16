define('donut/rename/1.1.0/drag',function(require, exports, module) {
    require("dragula.css")
    require("dragula")
    cc.log(21)
    var arr=[]
    var sp=dragula(arr,{
       copy:true
    })
        .on("cloned",function(copy,ele){
            cc.log("cloned")
            cc.log(copy)
            $(copy).html($("#mode1").clone())

        })
        .on("drag",function(copy,ele){
            cc.log("drag")

        })
        .on("dragend",function(copy,ele){
            cc.log("dragend")

        })
        .on("out",function(copy,ele){
            cc.log("out")
            //$(copy).addClass("red")
        })
        .on("over",function(copy,ele){
            cc.log("over")
        })

        .on("drop",function(copy,ele){
            cc.log("drop")
            $(copy).replaceWith($(copy).html())
        })
    $("#add").click(function(){
        $("body").append($("[jsui=drag]").eq(0).clone())
    })
    module.exports=function(e){
        sp.containers.push(e)
    }
});

