var router = require('express').Router();

router.get('/', function(req, res, next) {

    res.send("<a href='/demo/test1'>test1</a>")
});
router.get('/test1', function(req, res, next) {

   res.send("test1")
});

module.exports = router;
