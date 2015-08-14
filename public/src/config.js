cc=console
seajs.config({
    preload:["jquery","seajs-text.js"],
    vars: {
        'mode': 'donut/rename/1.0.0'
    },
    map: [
//        ['donut/rename/1.0.0', '../donut/1.0.0']
        ['donut/rename/1.0.0', '../src']
//        ['donut/rename/1.0.0', '../dist']
    ]
});
jsui=function(){
    $("[jsui]").each(function(e){
        var the=this
        if(!the.jsui){
            var mode=$(this).attr("jsui").replace(" ","")
            seajs.use("{mode}/"+mode,function(func){
                the.jsui=true
                func(the)
            })
        }
    })
}
jsui()
$("body").click(function(){
    jsui()
})
