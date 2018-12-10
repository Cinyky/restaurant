function e(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}

function t(e, t) {
    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
}

function n(e) {
    return (e = e.toString())[1] ? e : "0" + e;
}

Object.defineProperty(exports, "__esModule", {
    value: !0
});

var a = function() {
    function e(e, t) {
        for (var n = 0; n < t.length; n++) {
            var a = t[n];
            a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), 
            Object.defineProperty(e, a.key, a);
        }
    }
    return function(t, n, a) {
        return n && e(t.prototype, n), a && e(t, a), t;
    };
}(), o = e(require("./underscore.js")), r = e(require("./bluebird.js")), u = e(require("./qqmap-wx-jssdk.min.js")), i = e(require("./dg")), s = e(require("./listener")), l = e(require("./requestUtil")), f = require("./data"), d = function() {
    function e() {
        t(this, e);
    }
    return a(e, null, [ {
        key: "Promise",
        value: function(e, t) {
            return t = t || {}, new r.default(function(n, a) {
                "function" != typeof e && a(), t.success = n, t.fail = a, e(t);
            });
        }
    }, {
        key: "formatTime",
        value: function(e) {
            var t = e.getFullYear(), a = e.getMonth() + 1, o = e.getDate(), r = e.getHours(), u = e.getMinutes(), i = e.getSeconds();
            return [ t, a, o ].map(n).join("/") + " " + [ r, u, i ].map(n).join(":");
        }
    }, {
        key: "format",
        value: function(e, t) {
            var n = {
                "M+": (e = e instanceof Date ? e : new Date(e)).getMonth() + 1,
                "d+": e.getDate(),
                "h+": e.getHours(),
                "m+": e.getMinutes(),
                "s+": e.getSeconds(),
                "q+": Math.floor((e.getMonth() + 3) / 3),
                S: e.getMilliseconds()
            };
            /(y+)/.test(t) && (t = t.replace(RegExp.$1, (e.getFullYear() + "").substr(4 - RegExp.$1.length)));
            for (var a in n) new RegExp("(" + a + ")").test(t) && (t = t.replace(RegExp.$1, 1 === RegExp.$1.length ? n[a] : ("00" + n[a]).substr(("" + n[a]).length)));
            return t;
        }
    }, {
        key: "formatSmartTime",
        value: function(t) {
            t = t instanceof Date ? t.getTime() : t;
            var n = new Date().getTime() - t + 2e4, a = new Date().setHours(0, 0, 0), o = a - 864e5, r = a + 864e5, u = o - 864e5, i = r + 864e5;
            if (n < 0) {
                if ((n = Math.abs(n)) < 6e4) return "一会儿";
                if (n >= 6e4 && n < 36e5) return Math.floor(n / 6e4) + "分钟后";
                if (t < r) return "今天" + e.format(t, "hh:mm");
                if (t < i) return "明天" + e.format(t, "hh:mm");
                if (t < i + 864e5) return "后天" + e.format(t, "hh:mm");
            } else {
                if (n < 6e4) return "刚刚";
                if (n >= 6e4 && n < 36e5) return Math.floor(n / 6e4) + "分钟前";
                if (t > a) return "今天" + e.format(t, "hh:mm");
                if (t > o) return "昨天" + e.format(t, "hh:mm");
                if (t > u) return "前天" + e.format(t, "hh:mm");
            }
            var s = new Date();
            s.setMonth(0, 0), s.setHours(0, 0, 0, 0);
            var l = new Date(t);
            return l.setMonth(0, 0), l.setHours(0, 0, 0, 0), s.getTime() === l.getTime() ? e.format(t, "M月d日 hh:mm") : e.format(t, "yyyy年M月d日 hh:mm");
        }
    }, {
        key: "formatSmartNumber",
        value: function(t) {
            var n = [ "万", "亿", "兆" ], a = "";
            if (t >= 1e4) for (var o = 0; o < n.length && (a = n[o], !((t /= 1e4) < 1e4)); o++) ;
            return e.formatFloat(t) + a;
        }
    }, {
        key: "formatFloat",
        value: function(e, t) {
            t = t || 2, "string" != typeof e && (e += "");
            var n = e.lastIndexOf(".");
            return -1 !== n ? e.substring(0, n + t + 1) : e;
        }
    }, {
        key: "getUserInfo",
        value: function(e) {
            i.default.getUserInfo({
                success: function(t) {
                    e.call(null, i.default.os.isWechat() ? t.userInfo : t);
                },
                fail: function(t) {
                    if (console.error(t), i.default.os.isWechat()) {
                        s.default.addEventListener("user.get_info", function t(n) {
                            s.default.removeEventListener("user.get_info", t), n && e.call(null, n);
                        }), i.default.navigateTo({
                            url: "/pages/user/tips-info/index"
                        });
                    } else my.getAuthCode({
                        scopes: "auth_user",
                        success: function(e) {}
                    });
                }
            });
        }
    }, {
        key: "syncUserInfo",
        value: function(t) {
            e.getUserInfo(function(e) {
                l.default.post(f.duoguan_user_info_post_url, {
                    nickname: e.nickName,
                    headimgurl: e.avatarUrl || e.avatar,
                    sex: e.gender,
                    city: e.city,
                    province: e.province,
                    country: e.country,
                    language: e.language
                }, function(n) {
                    t && t.call(null, n, e);
                });
            });
        }
    }, {
        key: "trySyncUserInfo",
        value: function(t) {
            i.default.os.isWechat() ? wx.getSetting({
                success: function(n) {
                    n.authSetting["scope.userInfo"] ? t && wx.getUserInfo({
                        success: function(e) {
                            return t.call(null, e.userInfo);
                        }
                    }) : e.syncUserInfo(function(e, n) {
                        t && t.call(null, n);
                    });
                }
            }) : i.default.getStorageSync("is_sync_userinfo") ? t && t.call(null, osUserInfo) : e.syncUserInfo(function(e, n) {
                i.default.setStorageSync("is_sync_userinfo"), t && t.call(null, n);
            });
        }
    }, {
        key: "useCoupon",
        value: function(t) {
            var n = (t = o.default.extend({
                onFilter: function() {},
                params: {},
                coupon_id: 0,
                name: "coupon"
            }, t)).page.data[t.name] || {};
            n.isShow = !0, n.data = [], n.name = t.name;
            var a = {};
            a[t.name] = n, t.page.setData(a);
            var r = null;
            t.page["on" + t.name + "ComfirnTap"] = function() {
                var e = {};
                n.isShow = !1, e[t.name] = n, t.page.setData(e), t.onSelect(r);
            }, t.page["on" + t.name + "Change"] = function(e) {
                var t = e.detail.value;
                r = -1 == t ? null : n.data[t];
            }, l.default.get(f.duoguan_host_api_url + "/index.php?s=/addon/Card/CardApi/getMyCoupons.html", o.default.extend({
                available: 1,
                _r: 100
            }, t.params), function(a) {
                if ((0, o.default)(a).map(function(n) {
                    return n.use_start_date = e.format(1e3 * n.use_start_time, "yyyy-MM-dd"), n.use_end_date = e.format(1e3 * n.use_end_time, "yyyy-MM-dd"), 
                    n.is_active = n.id == t.coupon_id, n;
                }), t.onFilter) for (var r = 0; r < a.length; r++) !1 === t.onFilter(a[r]) && (a.splice(r, 1), 
                r--);
                n.data = a;
                var u = {};
                u[t.name] = n, t.page.setData(u);
            });
        }
    }, {
        key: "goCoupon",
        value: function(t, n, a) {
            n = n || "coupon";
            var r = t.data[n] || {};
            r.isShow = !0, r.data = [], r.name = n;
            var u = {};
            u[n] = r, t.setData(u), t["on" + n + "ComfirnTap"] = function() {
                var e = {};
                r.isShow = !1, e[n] = r, t.setData(e);
            }, t["on" + n + "Go"] = function(e) {
                var t = e.currentTarget.dataset.index, n = r.data[t];
                l.default.get(f.duoguan_host_api_url + "/index.php?s=/addon/Card/CardApi/goCoupon.html", o.default.extend({
                    id: n.id
                }, a), function(e) {
                    i.default.showToast({
                        title: "领取成功！",
                        icon: "success"
                    });
                });
            }, l.default.get(f.duoguan_host_api_url + "/index.php?s=/addon/Card/CardApi/getCoupons.html", {
                available: 1,
                _r: 100
            }, function(a) {
                (0, o.default)(a).map(function(t) {
                    return t.go_start_time = e.format(1e3 * t.go_start_time, "yyyy-MM-dd"), t.go_end_time = e.format(1e3 * t.go_end_time, "yyyy-MM-dd"), 
                    t.style = 0 == t.type ? "daijin" : "zhekou", t.full_available > 0 && (t.style = "manjian"), 
                    t;
                }), r.data = a;
                var u = {};
                u[n] = r, t.setData(u);
            });
        }
    }, {
        key: "payment",
        value: function(e, t) {
            console.log("must pay param:", {
                notify_url: "业务处理回调地址错误！",
                total_amount: "总金额"
            });
            var n = "pay_" + new Date().getTime(), a = function a() {
                s.default.removeEventListener("pay.get_payinfo_" + n, a), s.default.fireEventListener("pay.payinfo_" + n, [ e ]), 
                console.log("pay.payinfo_" + n, "fireEvented");
                s.default.addEventListener("pay.result_" + n, function e(a) {
                    s.default.removeEventListener("pay.result_" + n, e), t && setTimeout(function() {
                        t.call(null, a);
                    }, 500);
                });
            };
            s.default.addEventListener("pay.get_payinfo_" + n, a), console.log("waiting set get_payinfo"), 
            i.default.navigateTo({
                url: "/pages/user/mcard/pay?key=" + n,
                fail: function() {
                    s.default.removeEventListener("pay.get_payinfo_" + n, a), i.default.alert("无法调用余额界面，请尝试关闭一些界面！");
                }
            });
        }
    }, {
        key: "getMapSdk",
        value: function() {
            var t = "";
            if (2 === Math.floor(3 * Math.random())) {
                2 === Math.floor(3 * Math.random()) && (e.qqMapKeys = o.default.shuffle(e.qqMapKeys));
                var n = Math.floor(Math.random() * (e.qqMapKeys.length - 1));
                t = e.qqMapKeys[n];
            } else t = "2X5BZ-MNHKP-UC2D5-VJQZM-7NNXV-VIB6G";
            return new u.default({
                key: t
            });
        }
    }, {
        key: "chooseAddress",
        value: function(e, t) {
            if (e) {
                t = 1 == t, i.default.navigateTo({
                    url: "/pages/user/address/index?isCallback=1&isUseLocation=" + t
                });
                s.default.addEventListener("address.choose.confirm", function t(n) {
                    n instanceof Array && (n = {}), s.default.removeEventListener("address.choose.confirm", t), 
                    e.call(null, n);
                });
            } else console.log("undefined chooseAddress callback function");
        }
    }, {
        key: "getDefaultAddress",
        value: function(e, t) {
            if (e) {
                t = 1 == t;
                var n = l.default, a = f.duoguan_host_api_url + "/index.php/addon/DuoguanUser" + "/AddressApi/getDefaultAddress", o = {
                    isUseLocation: t
                };
                n.get(a, o, function(t) {
                    t instanceof Array && (t = {}), e.call(null, t);
                }, this, {
                    isShowLoading: !1
                });
            } else console.log("undefined get_default_address callback function");
        }
    }, {
        key: "userMobile",
        value: function(e, t) {
            t ? (e = "bind" == e ? "bind" : "edit", i.default.navigateTo({
                url: "/pages/user/userMobile/userMobile?action=" + e
            }), s.default.addEventListener("user.mobile.action", function(e) {
                t.call(null, e);
            })) : console.log("undefined userMobile callback function");
        }
    }, {
        key: "webView",
        value: function(e, t) {
            e = encodeURIComponent(e || "");
            var n = "/pages/user/web-view/index?title=" + (t = t || "网页") + "&url=" + e;
            i.default.navigateTo({
                url: n
            });
        }
    } ]), e;
}();

d.syncWechatInfo = d.syncUserInfo, d.trySyncWechatInfo = d.trySyncUserInfo, d.qqMapKeys = [ "YX2BZ-KIACS-NZRO4-6CXHO-EHZ3Z-OCB6U", "AGIBZ-ZVRK4-RFIUB-XLQ3X-UIXPF-K5FS7", "V7BBZ-WXT6J-PQMF4-FFQZB-NVDCH-LKFUY", "EWUBZ-BTZ33-GMW3I-3FYII-XIKM2-DXBAM", "YDUBZ-ZHGC5-D65I6-QKTDH-PBM6E-SGF2M" ], 
exports.default = d, "undefined" != typeof module && (module.exports = d);