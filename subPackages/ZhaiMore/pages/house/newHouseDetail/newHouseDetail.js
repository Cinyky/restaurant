function t(t) {
    return t && t.__esModule ? t : {
        default: t
    };
}

var e = t(require("../../../utils/dg.js")), i = t(require("../../../utils/data.js")), a = t(require("../../../utils/requestUtil.js")), o = (t(require("../../../utils/underscore.js")), 
t(require("../../../utils/util.js"))), n = i.default.duoguan_host_api_url + "/index.php/addon/DuoguanHouse";

Page({
    data: {
        infoUrl: "/NewHouseApi/getInfo",
        info: [],
        indicatorDots: !0,
        autoplay: !0,
        interval: 2e3,
        duration: 500,
        lookMore: !0
    },
    onLoad: function(t) {
        this.initialize(t), this.views(t.id);
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {
        return {
            title: this.data.info.name,
            desc: "",
            path: "/" + this.route + "?id=" + this.data.info.id
        };
    },
    initialize: function(t) {
        var e = this, i = t.id || 0, o = n + this.data.infoUrl, u = {
            id: i
        };
        a.default.get(o, u, function(t) {
            var i = t;
            i.labelTextList = i.label.split(","), e.setData({
                info: i
            });
        });
    },
    lookMore: function() {
        this.setData({
            lookMore: 1 != this.data.lookMore
        });
    },
    openLocation: function(t) {
        var i = t.currentTarget.dataset, a = i.latitude, o = i.longitude, n = i.address;
        e.default.openLocation({
            latitude: parseFloat(a),
            longitude: parseFloat(o),
            address: n,
            scale: 28
        });
    },
    makePhoneCall: function(t) {
        var i = t.currentTarget.dataset.phoneNumber;
        e.default.makePhoneCall({
            phoneNumber: i
        });
    },
    views: function(t) {
        var e = n + "/NewHouseApi/views", i = {
            id: t
        };
        a.default.get(e, i, function(t) {}, this, {
            isShowLoading: !1
        });
    },
    webView: function(t) {
        if (this.data.isAli) e.default.alert("支付宝暂不支持！"); else {
            var i = t.currentTarget.dataset, a = i.url, n = i.title;
            o.default.webView(a, n);
        }
    }
});