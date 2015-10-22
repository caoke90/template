/**
 * Created by apple on 15/7/17.
 */

//video id 55a727efe4b04492ba7f1cc0

var router = require('express').Router();
module.exports = router;
var AV = require('leanengine');

var audio = AV.Object.extend('Audio');
function renderIndex(res, audioid){
    var query = new AV.Query(audio);
    query.get(audioid, {
        success: function(result) {
            // 成功获得实例
            console.log('success')
            res.render(__dirname+'/audio',{result: result});
        },
        error: function(object, error) {
            // 失败了.
            console.log('failed')
        }
    });
}
router.get('/audio', function(req, res){
    var audioid = req.query.audioid;
    console.log(audioid);
    renderIndex(res, audioid);
});

