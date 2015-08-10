var router = require('express').Router();

//游戏开始界面
router.get('/', function(req, res, next) {
    res.send("index")
});
router.get('/test', function(req, res, next) {
    res.send("test")
});

router.use("/demo",require("./demo"))

module.exports = router;
