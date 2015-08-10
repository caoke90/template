define(function(require, exports, module) {
    require("../css/demo.css")
    var EventProxy=require("eventproxy")
    var ep = new EventProxy();
    var $ = require('jquery');

    var tpl=$("template").html()

    var data={
        name:21
    }
    ep.all("tpl","data",function(tpl,data){

        var str=tpl.replace(/<%=(\w+)%>/g,function(m,p1){
            cc.log(m)
            return data[p1]
        })
        cc.log(str)
        $("body").append(str)
    })

    ep.emit("tpl",tpl)
    ep.emit("data",data)
});

