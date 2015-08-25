function downloadBtClicked(){
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        location.href = "http://mp.weixin.qq.com/mp/redirect?url=https://itunes.apple.com/cn/app/duo-na-xue-ying-yu/id852917296?mt=8";
    } else if (/(Android)/i.test(navigator.userAgent)) {
        location.href = "https://itunes.apple.com/cn/app/duo-na-xue-ying-yu/id852917296?mt=8";
    } else {
        location.href = "http://mp.weixin.qq.com/mp/redirect?url=https://itunes.apple.com/cn/app/duo-na-xue-ying-yu/id852917296?mt=8";
    };
}