var AV = require('leanengine');

var donutUser =  AV.Object.extend("_User");
var donutCoin = AV.Object.extend("DonutCoin");

/**
 * 一个简单的云代码方法
 */
AV.Cloud.define('hello', function(request, response) {

  console.log("diao yong le hello")

  response.success('Hello world!');
});

AV.Cloud.define('checkEveryDayLogin', function(request, response) {

  var query = new AV.Query('_User');
  query.get(request.params.userid, {
    success: function(result) {
      // 成功获得实例
      console.log('获取user成功')
      //获取user信息
      var lianxidenglu = result.get('landingDays')//连续登录天数
      var lasttime =  result.get('lastLoginTime')//上次登录时间
      var jinbi = result.get('coinnumber')//纳币数
      var coinRelation = result.relation('myDonutCoin')//金币关联

      var nowdate = new Date()

      if(lasttime != null && (nowdate.getFullYear() == lasttime.getFullYear() && nowdate.getMonth() == lasttime.getMonth() && nowdate.getDate() == lasttime.getDate())){
        console.log('日期相同,今日已登录')
        response.success({'days':lianxidenglu,'coins':0})
      }
      else{
        console.log('日期不相同,今日未登录')
        var addcoinnumber;
        if(lianxidenglu +1 <= 5){
          addcoinnumber = lianxidenglu +1
        }
        else {
          addcoinnumber = 5
        }
        result.set('lastLoginTime',nowdate)
        result.set('landingDays',lianxidenglu+1)
        result.set('coinnumber',jinbi+addcoinnumber)
        result.save(null, {
          success: function(result) {
            // 成功保存之后，执行其他逻辑.
            console.log("user 保存成功")
            var coinchang = new donutCoin()
            coinchang.set('changDate',nowdate)
            coinchang.set('coinInfo',"每日登录")
            coinchang.set('changNumber',addcoinnumber)
            coinchang.save(null,{
              success:function(coinchang){
                console.log('金币明细保存成功')
                coinRelation.add(coinchang)
                result.save(null,{
                  success: function (result) {
                    console.log('user增加DonutCoin关联保存成功')
                    response.success({'days':lianxidenglu+1,'coins':addcoinnumber,'totalNumber':jinbi+addcoinnumber})
                  },
                  error: function(result, error) {
                    // 失败之后执行其他逻辑
                    // error 是 AV.Error 的实例，包含有错误码和描述信息.
                    console.log('user增加DonutCoin关联保存失败')
                    response.error("user增加DonutCoin关联保存失败")
                  }
                });
              },
              error: function(coinchang, error) {
                // 失败之后执行其他逻辑
                // error 是 AV.Error 的实例，包含有错误码和描述信息.
                console.log('金币明细保存失败')
                response.error("金币明细保存失败")
              }
            });
          },
          error: function(result, error) {
            // 失败之后执行其他逻辑
            // error 是 AV.Error 的实例，包含有错误码和描述信息.
            console.log('user 保存失败')
            response.error("user 保存失败")
          }
        });
      }
    },
    error: function(object, error) {
      // 失败了.
      console.log('获取user失败')
      response.error("获取user失败")
    }
  });
});
AV.Cloud.define('donutCoinChange', function(request, response) {

  var query = new AV.Query('_User');
  query.get(request.params.userid, {
    success: function(result) {
      console.log('获取user成功')
      // 成功获得实例
      var orinalNum = result.get('coinnumber')
      var changnum
      if(request.params.coinInfo == "注册多纳账号"){
        changnum = 8888
      }
      else if(request.params.coinInfo == "给多纳评分"){
        changnum = 5
      }
      else if(request.params.coinInfo == "把多纳分享给朋友"){
        changnum = 5
      }
      else if(request.params.coinInfo == "每日登录"){
        changnum = 1
      }
      else if(request.params.coinInfo == "每日任务"){
        changnum = 3
      }
      else if(request.params.coinInfo == "每日分享"){
        changnum = 2
      }
      else{
        changnum = request.params.changNumber
      }
      if(orinalNum+changnum < 0){
        response.success({'info':'金币不够'})
      }
      else{

        if(request.params.coinInfo == "解锁level1"){
          result.set('isBuyLevel1',1)
        }
        if(request.params.coinInfo == "解锁level2"){
          result.set('isBuyLevel2',1)
        }
        if(request.params.coinInfo == "解锁level3"){
          result.set('isBuyLevel3',1)
        }
        if(request.params.coinInfo == "解锁level4"){
          result.set('isBuyLevel4',1)
        }
        if(request.params.coinInfo == "解锁level5"){
          result.set('isBuyLevel5',1)
        }
        if(request.params.coinInfo == "解锁level6"){
          result.set('isBuyLevel6',1)
        }
        if(request.params.coinInfo == "解锁level1-level6"){
          result.set('isBuyLevel1',1)
          result.set('isBuyLevel2',1)
          result.set('isBuyLevel3',1)
          result.set('isBuyLevel4',1)
          result.set('isBuyLevel5',1)
          result.set('isBuyLevel6',1)
        }
        result.set('coinnumber',orinalNum+changnum)
        result.save(null,{

          success: function (result) {

            console.log('更新user成功')
            var nowdate = new Date()
            var coinRelation = result.relation('myDonutCoin')//金币关联
            var coinchang = new donutCoin()
            coinchang.set('changDate',nowdate)
            coinchang.set('coinInfo',request.params.coinInfo)
            coinchang.set('changNumber',changnum)
            coinchang.save(null,{
              success:function(coinchang){
                console.log('金币创建成功')
                coinRelation.add(coinchang)
                result.save(null,{
                  success:function(coinchang){
                    console.log('user创建金币关联成功'+request.params.coinInfo)
                    response.success({'changNumber':changnum,'changDate':nowdate,'coinInfo':request.params.coinInfo,'totalNumber':orinalNum+changnum})
                  },
                  error:function(coinchang){
                    console.log('user创建金币关联失败')
                    response.error("user创建金币关联失败")
                  }
                })
              },
              error:function(coinchang, error){
                response.error("donutCoin 保存失败")
              }
            })
          },
          error:function(result, error){
            response.error("user 保存失败")
          }
        })
      }
    },
    error: function(object, error) {
      console.log('获取user失败')
      response.error("获取user失败")
    }
  });
});

AV.Cloud.define('getMainCoinInfo', function(request, response) {

  var query = new AV.Query('_User');
  query.get(request.params.userid, {
    success: function (result) {
      console.log('获取user成功')

      var coinRelation = result.relation('myDonutCoin')//金币关联
      var query = coinRelation.query()
      query.equalTo('coinInfo','注册多纳账号')
      //query.equalTo('coinInfo','给多纳评分')
      query.find({
        success: function (list) {
          console.log('获取user金币关联成功')
          for (var i = 0; i < list.length; i++) {
            var object = list[i];
            console.log(object.get('coinInfo'))
          }
        },
        error: function (result, error) {
          console.log('获取user金币关联失败')
        }
      });
    },
    error: function (result, error) {
      response.error("获取user失败")
    }
  })
})
AV.Cloud.define('getMainCoinInfo', function(request, response) {

  var query = new AV.Query('_User');
  query.get(request.params.userid, {
    success: function (result) {
      console.log('获取user成功')

      var datenow = new Date()
      var date = new Date(datenow.getFullYear(),datenow.getMonth(),datenow.getDate(),0,0,0,0)
      console.log(date)
      var coinRelation = result.relation('myDonutCoin')//金币关联
      var query1 = coinRelation.query()
      query1.containedIn('coinInfo',['注册多纳账号','给多纳评分','把多纳分享给朋友'])
      query1.find({
        success: function (list) {
          console.log('query1获取user金币关联成功')

          var objArray = new Array()

          for (var i = 0; i < list.length; i++) {

            var obj =  list[i]
            var changdate = obj.get('changDate')

            if(changdate.getFullYear()==datenow.getFullYear() && changdate.getMonth()==datenow.getMonth() &&changdate.getDate()==datenow.getDate()){

            }
            else{
              console.log('++')
              objArray.push(list[i])
            }
            //var object = list[i];
            //console.log(object.get('coinInfo'))
          }

          var query2 = coinRelation.query()
          query2.greaterThan('changDate',date)
          query2.find({
            success: function (list) {
              console.log('query2获取user金币关联成功')
              for (var i = 0; i < list.length; i++) {

                console.log('++')

                objArray.push(list[i])
                //var object = list[i];
                //console.log(object.get('coinInfo'))
              }
              response.success(objArray)
            },
            error: function (result, error) {
              console.log('获取user金币关联失败')
            }
          });
        },
        error: function (result, error) {
          console.log('获取user金币关联失败')
        }
      });
    },
    error: function (result, error) {
      response.error("获取user失败")
    }
  })
})
AV.Cloud.define('getRelation', function(request, response) {

  var query = new AV.Query(request.params.classname);
  query.get(request.params.objid, {
    success: function (result) {

      console.log('user成功')
      var relation = result.relation(request.params.objkey)

      var query = relation.query()

      query.find({
        success: function (list) {
          console.log('query1获取user金币关联成功')
          response.success(list)
        },
        error: function (result, error) {
          console.log('获取user金币关联失败')
        }
      });
    },
    error: function (result, error) {
      response.error("获取user失败")
    }
  })
})
AV.Cloud.define('IOSRestore', function(request, response) {

  var query = new AV.Query('_User');
  query.get(request.params.userid, {
    success: function(result) {
      console.log('获取user成功')
      // 成功获得实例
      var isresumeBuy = result.get('resumeBuy')
      var coinNumber = result.get('coinnumber')
      if(isresumeBuy == 1){
        console.log("已恢复过")
        response.success({'isFirstTimeResume':0})
      }
      else{
        result.set('resumeBuy',1)
        result.save(null,{
          success: function (result) {
            console.log('更新user成功')
            var nowdate = new Date()
            var coinRelation = result.relation('myDonutCoin')//金币关联
            var coinchang = new donutCoin()
            coinchang.set('changDate',nowdate)
            coinchang.set('coinInfo',"恢复购买")
            coinchang.set('changNumber',900)
            coinchang.save(null,{
              success:function(coinchang){
                console.log('金币创建成功')
                coinRelation.add(coinchang)
                result.save(null,{
                  success:function(coinchang){
                    console.log('user创建金币关联成功'+request.params.coinInfo)
                    response.success({'isFirstTimeResume':1,'changNumber':900,'changDate':nowdate,'coinInfo':"恢复购买",'totalNumber':coinNumber+900})
                  },
                  error:function(coinchang){
                    console.log('user创建金币关联失败')
                    response.error("user创建金币关联失败")
                  }
                })
              },
              error:function(coinchang, error){
                response.error("donutCoin 保存失败")
              }
            })
          },
          error:function(result, error){
            response.error("user 保存失败")
          }
        })
      }
    },
    error: function(object, error) {
      console.log('获取user失败')
      response.error("获取user失败")
    }
  });
});
module.exports = AV.Cloud;