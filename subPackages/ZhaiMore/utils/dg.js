function e(e, o) {
    if (!(e instanceof o)) throw new TypeError("Cannot call a class as a function");
}

Object.defineProperty(exports, "__esModule", {
    value: !0
});

var o = function() {
    function e(e, o) {
        for (var t = 0; t < o.length; t++) {
            var a = o[t];
            a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), 
            Object.defineProperty(e, a.key, a);
        }
    }
    return function(o, t, a) {
        return t && e(o.prototype, t), a && e(o, a), o;
    };
}(), t = function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}(require("./underscore.js")), a = "undefined" == typeof wx ? "alipay" : "wechat", n = "wechat" === a, i = "alipay" === a, s = function() {
    function a() {
        e(this, a);
    }
    return o(a, null, [ {
        key: "uploadFile",
        value: function(e) {
            return e.fileName = e.name, e.fileType = e.fileType || "image", a.os.isWechat() ? wx.uploadFile(e) : my.uploadFile(e);
        }
    }, {
        key: "alert",
        value: function(e, o) {
            var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "提示", i = t.default.extend({
                title: n,
                content: e,
                showCancel: !1,
                success: o
            });
            a.os.isWechat() ? wx.showModal(i) : my.alert(i);
        }
    }, {
        key: "confirm",
        value: function(e, o) {
            var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "提示", i = t.default.extend({
                title: n,
                content: e,
                success: o
            });
            a.os.isWechat() ? wx.showModal(i) : my.confirm(i);
        }
    }, {
        key: "showLoading",
        value: function() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "";
            a.os.isWechat() ? wx.showLoading ? wx.showLoading({
                title: e
            }) : wx.showToast({
                title: e,
                icon: "loading",
                duration: 1e4
            }) : my.showLoading({
                content: e
            });
        }
    } ]), a;
}();

s.os = {
    isWechat: function() {
        return n;
    },
    isAlipay: function() {
        return i;
    },
    name: function() {
        return a;
    }
}, s.request = s.os.isWechat() ? wx.request : my.httpRequest, s.downloadFile = s.os.isWechat() ? wx.downloadFile : my.downloadFile, 
s.navigateTo = s.os.isWechat() ? wx.navigateTo : my.navigateTo, s.redirectTo = s.os.isWechat() ? wx.redirectTo : my.redirectTo, 
s.navigateBack = s.os.isWechat() ? wx.navigateBack : my.navigateBack, s.switchTab = s.os.isWechat() ? wx.switchTab : my.switchTab, 
s.reLaunch = s.os.isWechat() ? wx.reLaunch : my.reLaunch, s.navigateToMiniProgram = s.os.isWechat() ? wx.navigateToMiniProgram : my.navigateToMiniProgram, 
s.navigateBackMiniProgram = s.os.isWechat() ? wx.navigateBackMiniProgram : my.navigateBackMiniProgram, 
s.getSystemInfo = s.os.isWechat() ? wx.getSystemInfo : my.getSystemInfo, s.getSystemInfoSync = s.os.isWechat() ? wx.getSystemInfoSync : my.getSystemInfoSync, 
s.authLogin = s.os.isWechat() ? wx.login : my.getAuthCode, s.getSetting = s.os.isWechat() ? wx.getSetting : function() {
    console.warn("支付宝不支持:getSetting");
}, s.setSetting = s.os.isWechat() ? wx.setSetting : function() {
    console.warn("支付宝不支持:setSetting");
}, s.getUserInfo = s.os.isWechat() ? wx.getUserInfo : my.getAuthUserInfo, s.getLocation = s.os.isWechat() ? wx.getLocation : my.getLocation, 
s.chooseLocation = s.os.isWechat() ? wx.chooseLocation : my.chooseLocation || function() {
    console.warn("支付宝不支持地图位置选择");
}, s.openLocation = s.os.isWechat() ? wx.openLocation : my.openLocation, s.canIUse = s.os.isWechat() ? wx.canIUse : my.canIUse, 
s.makePhoneCall = s.os.isWechat() ? wx.makePhoneCall : function(e) {
    my.makePhoneCall({
        number: e.phoneNumber
    });
}, s.showShareMenu = s.os.isWechat() ? wx.showShareMenu : my.showShareMenu || function() {
    console.warn("支付宝不支持显示分享按钮~");
}, s.hideShareMenu = s.os.isWechat() ? wx.hideShareMenu : my.hideShareMenu || function() {
    console.warn("支付宝不支持隐藏分享按钮~");
}, s.startPullDownRefresh = s.os.isWechat() ? wx.startPullDownRefresh : my.startPullDownRefresh || function() {
    console.warn("支付宝暂不支持开始下拉刷新~");
}, s.stopPullDownRefresh = s.os.isWechat() ? wx.stopPullDownRefresh : my.stopPullDownRefresh, 
s.pageScrollTo = s.os.isWechat() ? wx.pageScrollTo : my.pageScrollTo, s.getStorage = s.os.isWechat() ? wx.getStorage : my.getStorage, 
s.getStorageSync = s.os.isWechat() ? wx.getStorageSync : function(e) {
    return my.getStorageSync({
        key: e
    }).data;
}, s.setStorage = s.os.isWechat() ? wx.setStorage : my.setStorage, s.setStorageSync = s.os.isWechat() ? wx.setStorageSync : function(e, o) {
    my.setStorageSync({
        key: e,
        data: o
    });
}, s.removeStorage = s.os.isWechat() ? wx.removeStorage : my.removeStorage, s.removeStorageSync = s.os.isWechat() ? wx.removeStorageSync : function(e) {
    my.removeStorageSync({
        key: e
    });
}, s.clearStorage = s.os.isWechat() ? wx.clearStorage : my.clearStorage, s.clearStorageSync = s.os.isWechat() ? wx.clearStorageSync : my.clearStorageSync, 
s.getStorageInfo = s.os.isWechat() ? wx.getStorageInfo : my.getStorageInfo, s.getStorageInfoSync = s.os.isWechat() ? wx.getStorageInfoSync : my.getStorageInfoSync, 
s.showToast = function() {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
    e.content = e.title, s.os.isWechat() ? wx.showToast(e) : my.showToast(e);
}, s.hideToast = s.os.isWechat() ? wx.hideToast : my.hideToast, s.hideLoading = s.os.isWechat() ? wx.hideLoading || wx.hideToast : my.hideLoading, 
s.setNavigationBarTitle = s.os.isWechat() ? wx.setNavigationBarTitle : my.setNavigationBar, 
s.setNavigationBarColor = s.os.isWechat() ? wx.setNavigationBarColor : my.setNavigationBar, 
s.showNavigationBarLoading = s.os.isWechat() ? wx.showNavigationBarLoading : my.showNavigationBarLoading, 
s.hideNavigationBarLoading = s.os.isWechat() ? wx.hideNavigationBarLoading : my.hideNavigationBarLoading, 
s.chooseImage = s.os.isWechat() ? wx.chooseImage : my.chooseImage, s.previewImage = s.os.isWechat() ? wx.previewImage : my.previewImage, 
s.saveImage = s.os.isWechat() ? wx.saveImage : my.saveImage, s.getImageInfo = s.os.isWechat() ? wx.getImageInfo : my.getImageInfo || function() {
    console.warn("支付宝不支持 getImageInfo 方法");
}, s.chooseAddress = s.os.isWechat() ? wx.chooseAddress : my.chooseAddress || function() {
    console.warn("支付宝不支持选择地址");
}, exports.default = s, "undefined" != typeof module && (module.exports = s);