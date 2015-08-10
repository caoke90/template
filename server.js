'use strict';
var AV = require('leanengine');

var APP_ID = process.env.LC_APP_ID||"fyhb7s5ls1fvj6qucc9vwum9ko1qgk2gwag2yo6ii1iib6qz";
var APP_KEY = process.env.LC_APP_KEY||"v5vu8fodj81waus8k2xacdtllnq5uochurzufflwqs3b0ntg";
var MASTER_KEY = process.env.LC_APP_MASTER_KEY||"7gdwbl2ks846axc7kdoemw1eb4m8m90xr9p3w9k64jo89502";

AV.initialize(APP_ID, APP_KEY, MASTER_KEY);
// 如果不希望使用 masterKey 权限，可以将下面一行删除
AV.Cloud.useMasterKey();

var app = require('./app');

// 端口一定要从环境变量 `LC_APP_PORT` 中获取。
// LeanEngine 运行时会分配端口并赋值到该变量。
var PORT = parseInt(process.env.LC_APP_PORT || 3000);
app.listen(PORT, function () {
  console.log('Node app is running, port:', PORT);
});
