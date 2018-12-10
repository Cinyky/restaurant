function n(n) {
    return n && n.__esModule ? n : {
        default: n
    };
}

n(require("../../../utils/dg"));

var o = n(require("../../../utils/data")), i = n(require("../../../utils/requestUtil")), e = o.default.duoguan_host_api_url + "/index.php/addon/DuoguanHouse";

Page({
    data: {},
    onLoad: function(n) {
        this.initialize(n);
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    initialize: function(n) {
        var o = n.id || 0, u = e + "/HouseAccessApi/refresh", t = {
            id: o
        };
        console.log(u), i.default.get(u, t, function(n) {
            console.log(n);
        });
    }
});