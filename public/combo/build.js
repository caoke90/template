({
    baseUrl: ".",
    mainConfigFile: '../src/main.js',
    appDir: "../src",
    dir: "../dist",
    paths:{
        jquery: "../js/jquery-1.11.3.min",
        weixin: "../js/jweixin-1.0.0"
    },
    modules: [
        {
            name: "test"
        }
    ]
})