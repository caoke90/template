define(function(require, exports, module) {
    require("../css/demo.css")
    require("../css/bootstrap.min.css")
    require("dragula.css")
    require("dragula")
    var EventProxy=require("eventproxy")
    var ep = new EventProxy();
    var $ = require('jquery');

    var tpl=$(".template").text()

    var data={
        name:21
    }
    ep.tail("tpl","data",function(tpl,data){
        var str=tpl.replace(/<%=(\w+)%>/g,function(m,p1){

            return data[p1]
        })
        $("body").append(str)

        dragula([$('#left1')[0], $('#right1')[0]],{copy:true})
            .on("cloned",function(copy,ele){
                cc.log("cloned")
                $(copy).html("cloned")
                cc.log(copy)
                cc.log(ele)
            })
            .on("cancel",function(el,container,handle){
                //cc.log(el)
                //cc.log(container)
                //cc.log(handle)
            })
            .on("drop",function(el,container,handle){
                //cc.log(el)
                //cc.log(handle)
            })
    })

    ep.emit("tpl",tpl)
    ep.emit("data",data)
});

