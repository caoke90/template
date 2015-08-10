define("donut/rename/1.0.0/test-debug", [ "bootswatch-debug", "bootstrap-debug", "dialog/dialog-debug", "jquery-debug", "dialog/popup-debug", "dialog/dialog-config-debug", "eventproxy-debug" ], function(require, exports, module) {
    require("bootswatch-debug");
    var dialog = require("dialog/dialog-debug");
    var d = dialog({
        content: "safsaf",
        title: "EF893L"
    });
    d.show();
    var EventProxy = require("eventproxy-debug.js");
    $("#photo").on("click", function() {
        $("#photoFileUpload").trigger("click");
    });
    $("#tb").on("click", function() {
        cc.log(21);
    });
    var test = new EventProxy();
    test.after("click", function() {
        cc.log("cwl");
    });
    test.not("click", function() {
        cc.log("cl");
    });
});
