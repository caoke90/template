var router = require('express').Router();
module.exports = router;
router.get('/donutshare', function(req, res){
    res.render(__dirname+'/donutshare');
});