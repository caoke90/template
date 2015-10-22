var router = require('express').Router();

module.exports = router;
var Api=require("../Api")
//使用自动加载
Api.use$Path(router,__dirname)

//private
router.get('/', function(req, res) {
    res.send("hello donut!")
});

