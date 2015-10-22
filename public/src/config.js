cc=console
requirejs.config({
    baseUrl:"../src/",
    paths: {
        jquery: '../js/zepto.min',
        ejs: "../js/ejs.min"
    },
    shim: {
        jquery: { exports: 'Zepto' },
        ejs: { exports: 'ejs' }
    },
    map: {
        '*': {
            'css': '../combo/css',
            'text': '../combo/text'
        }
    }
});
if(location.href.indexOf("avosapps.com")>-1){
    requirejs.config({
        baseUrl: "../dist/"
    })
}