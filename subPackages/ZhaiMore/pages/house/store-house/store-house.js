function t(t) {
    return t && t.__esModule ? t : {
        default: t
    };
}

var a = t(require("../../../utils/dg.js")), e = t(require("../../../utils/data.js")), i = t(require("../../../utils/requestUtil.js")), s = e.default.duoguan_host_api_url + "/index.php/addon/DuoguanHouse";

Page({
    data: {
        info: null,
        retal: !0,
        sell: !1,
        status: 2
    },
    onLoad: function() {
        var t = {};
        t.status = 2, this._initialize(t);
    },
    _initialize: function(t) {
        var a = this, e = t.status, u = s + "/ResourceApi/getmyresource", n = {
            status: e
        };
        i.default.get(u, n, function(t) {
            a.setData({
                info: t
            });
        });
    },
    navigateToResource: function(t) {
        var e = "../detail/detail?id=" + t.currentTarget.dataset.id;
        a.default.navigateTo({
            url: e
        });
    },
    setretal: function() {
        var t = this;
        t.setData({
            retal: !0,
            sell: !1,
            status: 2
        });
        var a = {};
        a.status = 2, t._initialize(a);
    },
    setsell: function() {
        var t = this;
        t.setData({
            retal: !1,
            sell: !0,
            status: 1
        });
        var a = {};
        a.status = 1, t._initialize(a);
    },
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});