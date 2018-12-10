function e(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}

function t(e, t) {
    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
}

function a(e, t) {
    var a = {};
    return a[e] = t, a;
}

function n(e) {
    var t = e.currentTarget.dataset, n = t.isMulti || !1, u = t.index;
    if (n) {
        var r = JSON.parse(t.value);
        for (var i in r) void 0 !== u ? (this.data[i][u] = Object.assign(this.data[i][u] || {}, r[i]), 
        r[i] = this.data[i]) : r[i] = Object.assign(this.data[i] || {}, r[i]);
        return this.setData(r), r;
    }
    var o = a(t.name, t.value);
    return this.setData(o), o;
}

function u(e) {
    var t = e.detail.target ? e.detail.target.dataset : e.currentTarget.dataset, a = t.url;
    a = a ? a + (-1 != a.indexOf("?") ? "&" : "?") + "module=" + t.module : "";
    var n = t.type, u = {
        url: a
    };
    t.invalid || (e.detail.formId && i.default.pushFormId(e.detail.formId), "switch" == n ? (u.fail = function() {
        wx.navigateTo({
            url: a
        });
    }, wx.switchTab(u)) : wx.navigateTo(u));
}

Object.defineProperty(exports, "__esModule", {
    value: !0
});

var r = function() {
    function e(e, t) {
        for (var a = 0; a < t.length; a++) {
            var n = t[a];
            n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), 
            Object.defineProperty(e, n.key, n);
        }
    }
    return function(t, a, n) {
        return a && e(t.prototype, a), n && e(t, n), t;
    };
}(), i = e(require("./requestUtil")), o = require("./data"), l = e(require("./underscore")), d = function() {
    function e() {
        t(this, e);
    }
    return r(e, null, [ {
        key: "popup",
        value: function(e) {
            var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "", r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "ad_popup", d = 0, s = n.bind(e);
            e.onPlugSetValueTap = e.onPlugSetValueTap || function(e) {
                s(e)[r] && clearTimeout(d);
            }, e.onPlugNavigateTap = e.onPlugNavigateTap || u.bind(e);
            var f = o.duoguan_host_api_url + "/index.php/addon/DuoguanUser/ApiMarketing/getMarketConfig.html";
            i.default.get(f, {
                module_name: t
            }, function(n) {
                var u = e.data[r];
                u && u.length && u[0].min ? (l.default.each(n, function(e) {
                    e.min = !0, e.module = t;
                }), e.setData(a(r, n))) : (l.default.each(n, function(e) {
                    e.module = t;
                }), e.setData(a(r, n)), d = setTimeout(function() {
                    l.default.each(n, function(e) {
                        e.min = !0;
                    }), e.setData(a(r, n));
                }, 1e4));
            }, this, {
                error: function(t) {
                    if (-100 == t) return clearTimeout(d), e.setData(a(r, null)), !1;
                }
            });
        }
    }, {
        key: "share",
        value: function() {
            var e = o.duoguan_host_api_url + "/index.php/addon/DuoguanUser/ApiMarketing/shareSetData";
            i.default.get(e, {}, function(e) {
                pageObj.setData(a(name, e));
            });
        }
    }, {
        key: "setShare",
        value: function(e, t, a) {
            a = a || e.route, wx.hideShareMenu();
            var n = o.duoguan_host_api_url + "/index.php/addon/DuoguanUser/Api/getAddonIndexPage";
            i.default.get(n, {
                modulename: t
            }, function(t) {
                t || (t = getCurrentPages()[0].route), e.onShareAppMessage = function() {
                    var e = this.title || "", n = t + (-1 !== t.indexOf("?") ? "&" : "?") + "_path=" + encodeURIComponent("/" + a);
                    return {
                        title: e.substr(0, 48) + (e.length > 48 ? "..." : ""),
                        path: n
                    };
                }, wx.showShareMenu();
            });
        }
    } ]), e;
}();

exports.default = d;