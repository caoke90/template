/**
 * Created by apple on 15/7/17.
 */

    //video id 55a727efe4b04492ba7f1cc0
var router = require('express').Router();
module.exports = router;
var AV = require('leanengine');

var videoObjectId = "abc";

var video = AV.Object.extend('Video');
function renderIndex(res, videoid){

    var query = new AV.Query(video);
    query.get(videoid, {
        success: function(result) {
            // 成功获得实例
            console.log('success')
            res.render(__dirname+'/video',{result: result});
        },
        error: function(object, error) {
            // 失败了.
            console.log('failed')
        }
    });
}

router.get('/video', function(req, res){
    var videoid = req.query.videoid;
    videoObjectId = videoid;
    console.log(videoObjectId);
    renderIndex(res, videoid);
});

router.post('/video',function(req, res){
    var name = req.body.name;
    if(name && name.trim() !=''){
        //Save visitor
//        var visitor = new Visitor();
//        visitor.set('name', name);
//        visitor.save(null, {
//            success: function(gameScore) {
//                res.redirect('/video?name=' + name);
//            },
//            error: function(gameScore, error) {
//                res.render('500', 500);
//            }
//        });
    }else{
        res.redirect('/');
    }
});

