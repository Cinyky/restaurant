function t(t) {
    return t && t.__esModule ? t : {
        default: t
    };
}

var i = t(require("../../../utils/dg")), e = t(require("../../../utils/data.js")), a = t(require("../../../utils/requestUtil.js")), n = (t(require("../../../utils/underscore.js")), 
t(require("../../../utils/util.js"))), o = i.default.os.isAlipay(), l = e.default.duoguan_host_api_url + "/index.php/addon/DuoguanHouse", u = n.default.getMapSdk();
let app             = getApp();
let templateMethods = require("../../../../../utils/template_methods.js");
let myTools         = require('../../../../../utils/myTools');
let common          = require('../../../scripts/common');
let apiList         = require('../../../scripts/apiList');
Page(Object.assign({}, {
    data: {
        info: null,
        marker: [],
        markerinfo: {},
        isAli: o
    },
    onLoad: function(t) {
        // this._initialize(t);
      this.setMenu(this);
      app.globalData.getTop(this);
    },
    _initialize: function(t) {
        var i = this, e = t.id || 0, n = l + "/ResourceApi/getvillage", u = {
            id: e
        };
        a.default.get(n, u, function(e) {
            var a = {
                iconPath: "../../../images/village.png",
                id: 0,
                latitude: e.latitude,
                longitude: e.longitude,
                width: 24,
                height: 24,
                title: e.vill_name
            }, n = [];
            if (n.push(a), i.setData({
                info: e,
                marker: n,
                markerinfo: a
            }), o) return !1;
            t.keyword && i.openmark(t);
        }, this);
    },
    openmark: function(t) {
        if (o) return !1;
        var i = this, e = t.keyword;
        u.search({
            keyword: e,
            location: {
                latitude: i.data.info.latitude,
                longitude: i.data.info.longitude
            },
            success: function(t) {
                var a = [];
                a.push(i.data.markerinfo);
                var n = [];
                n = t.data;
                for (var o = 0; o < n.length; o++) {
                    var l = n[o], u = {
                        iconPath: "../../../images/marker.png",
                        id: 0,
                        latitude: 23.099994,
                        longitude: 113.32452,
                        width: 24,
                        height: 24,
                        title: ""
                    };
                    u.id = "公交" != e ? l.id : l.pano.id, u.latitude = l.location.lat, u.longitude = l.location.lng, 
                    u.title = l.title, a.push(u);
                }
                i.setData({
                    marker: a
                });
            },
            fail: function(t) {
                console.log(t);
            },
            complete: function(t) {
                console.log(t);
            }
        });
    },
    setmark: function(t) {
        var i = this, e = t.currentTarget.dataset.name;
        u.search({
            keyword: e,
            location: {
                latitude: i.data.info.latitude,
                longitude: i.data.info.longitude
            },
            success: function(t) {
                var a = [];
                a.push(i.data.markerinfo);
                var n = [];
                n = t.data;
                for (var o = 0; o < n.length; o++) {
                    var l = n[o], u = {
                        iconPath: "../../../images/marker.png",
                        id: 0,
                        latitude: 23.099994,
                        longitude: 113.32452,
                        width: 24,
                        height: 24,
                        title: ""
                    };
                    u.id = "公交" != e && "地铁" != e ? l.id : l.pano.id, u.latitude = l.location.lat, u.longitude = l.location.lng, 
                    u.title = l.title, a.push(u);
                }
                i.setData({
                    marker: a
                });
            },
            fail: function(t) {
                console.log(t);
            },
            complete: function(t) {
                console.log(t);
            }
        });
    }
}, templateMethods, common));