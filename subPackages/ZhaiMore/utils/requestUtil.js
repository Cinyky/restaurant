var e = require("underscore"), o = require("client").Client, t = require("data"), n = getApp(), i = [], a = {}, l = [], d = !1, s = [];

module.exports = {
    getRequestOptions: function(o, n) {
        var i = this;
        return o = e.extend({
            method: "GET",
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                client: "XCX"
            },
            success: function(e) {
                try {
                    o.isLoginInvalid = !1;
                    var t = void 0 === (e = e.data).code ? e.status : e.code;
                    if (1 == t) {
                        var a = null;
                        void 0 !== e.info && (a = e.info), void 0 !== e.data && (a = e.data), o.callback.call(n, a, e, o);
                    } else if (2 == t) {
                        if (o.loginInvalidCount = o.loginInvalidCount + 1 || 1, o.loginInvalidCount > 1) return void wx.showModal({
                            content: "请稍后重试~",
                            showCancel: !1
                        });
                        o.isLoginInvalid = !0, i._fireLoginInvalidListener(), o.onLoginInvalid && !1 === o.onLoginInvalid() || i.login({
                            success: function(e) {
                                o.data.utoken = e, wx.request(o);
                            },
                            complete: o.complete
                        });
                    } else {
                        var l = void 0;
                        if (void 0 !== e.msg && (l = e.msg), void 0 !== e.errMsg && (l = e.errMsg), void 0 !== e.code && void 0 !== e.info && (l = e.info), 
                        void 0 !== l) {
                            if (o.error && !1 === o.error.call(o.callbackObj, t, l, o)) return;
                            wx.showModal({
                                content: l,
                                showCancel: !1
                            });
                        }
                    }
                } catch (e) {
                    console.error(e.stack);
                }
            },
            fail: function(e) {
                console.error(e), o.isLoginInvalid = !1, o.failAfter && o.failAfter.call(n, e, o), 
                console.error(e, o.url);
            },
            complete: function(e) {
                o.isLoginInvalid && d || (setTimeout(function() {
                    o.isShowLoading && wx.hideToast(), delete a[o.requestId];
                }, o.delay), o.completeAfter && o.completeAfter.call(n, e, o));
            }
        }, o), o.isShowLoading = !1 !== o.isShowLoading, o.loadingText = o.loadingText || "请稍后...", 
        o.delay = o.delay || 500, o.data = o.data || {}, o.data.utoken = wx.getStorageSync("utoken"), 
        o.data.token = t.duoguan_user_token, s.length && (o.method ? o.data._form_id = [ s.shift() ] : o.data._form_id = s.splice(0, 20), 
        o.data._form_id = JSON.stringify(o.data._form_id)), o.requestId = o.requestId || e.uniqueId("RQ"), 
        a[o.requestId] = 1, o;
    },
    get: function(o, t, n, i, a) {
        return (a = this.getRequestOptions(e.extend({
            url: o,
            data: t,
            callback: n
        }, a || {}), i)).isShowLoading && wx.showToast({
            icon: "loading",
            title: a.loadingText,
            duration: 1e4
        }), wx.request(a), a.requestId;
    },
    post: function(o, t, n, i, a) {
        return (a = this.getRequestOptions(e.extend({
            url: o,
            data: t,
            callback: n,
            method: "POST"
        }, a || {}), i)).isShowLoading && wx.showToast({
            icon: "loading",
            title: a.loadingText,
            duration: 1e4
        }), wx.request(a), a.requestId;
    },
    upload: function(o, i, l, d, s, r, u) {
        return wx.showToast({
            title: "上传中...",
            icon: "loading",
            duration: 1e4
        }), u = e.extend({
            url: o,
            filePath: i,
            name: l,
            formData: d,
            success: function(e) {
                if (e = JSON.parse(e.data), u.isLoginInvalid = !1, 1 == e.code) s.apply(r, [ e.data, e ]); else if (2 == e.code) {
                    u.isLoginInvalid = !0;
                    wx.showToast({
                        title: "登陆中",
                        icon: "loading",
                        duration: 1e4,
                        success: function() {
                            n.getNewToken(function(e) {
                                wx.hideToast(), wx.uploadFile(u);
                            });
                        }
                    }), setTimeout(function() {
                        delete a[u.requestId], u.completeAfter && u.completeAfter.apply(r, [ {
                            statusCode: 0,
                            errMsg: "请求超时",
                            data: null
                        } ]);
                    }, 1e4);
                } else wx.showModal({
                    content: e.info,
                    showCancel: !1
                });
            },
            fail: function(e) {
                console.error(e), wx.showModal({
                    content: e.errMsg,
                    showCancel: !1
                });
            },
            complete: function(e) {
                u.isLoginInvalid || (wx.hideToast(), setTimeout(function() {
                    delete a[u.requestId];
                }, u.delay), u.completeAfter && u.completeAfter.apply(r, [ e ]));
            }
        }, u || {}), u.delay = u.delay || 1e3, u.formData = u.formData || {}, u.formData.utoken = wx.getStorageSync("utoken"), 
        u.formData.token = t.duoguan_user_token, u.requestId = e.uniqueId("RQ"), a[u.requestId] = 1, 
        wx.uploadFile(u), u.requestId;
    },
    isLoading: function(e) {
        return !!e && void 0 !== a[e];
    },
    addLoginInvalidListener: function(e, o) {
        (o = void 0 !== o && o) ? i.unshift(e) : i.push(e);
    },
    removeLoginInvalidListener: function(o) {
        var t = e.indexOf(i, o);
        t >= 0 && i.splice(t, 1);
    },
    _fireLoginInvalidListener: function() {
        for (var e in i) i[e].apply(this);
    },
    pushFormId: function(e) {
        return s.length >= 100 && s.shift(), s.push(e);
    },
    login: function(e) {
        if (l.push(e), !d) {
            var n = function(e, o) {
                for (var t = 0; t < l.length; t++) {
                    var n = l[t];
                    "complete" === e ? n.complete.apply(null, o) : n.success.apply(null, o);
                }
            }, i = function(e) {
                d = !1, wx.hideToast(), n("complete", [ e ]), l.splice(0, l.length);
            }, a = function(e) {
                1 != (e = e.data).code ? (i(e), wx.showModal({
                    content: e.info,
                    showCancel: !1
                })) : (wx.setStorageSync("user_info", e.data), wx.setStorageSync("utoken", e.utoken), 
                d = !1, n("success", [ e.utoken, e.data ]), l.splice(0, l.length), o.isInited() && !o.isLogin() && o.login(e.data.uid));
            };
            d = !0, wx.showToast({
                title: "登陆中",
                icon: "loading",
                duration: 1e4
            }), wx.login({
                success: function(e) {
                    var o = e.code, n = wx.getStorageSync("utoken");
                    wx.request({
                        url: t.duoguan_auth_login_url,
                        data: {
                            token: t.duoguan_user_token,
                            utoken: n,
                            code: o
                        },
                        method: "POST",
                        success: a,
                        fail: function(e) {
                            i(e), wx.showModal({
                                content: "请稍后重试~",
                                showCancel: !1
                            });
                        }
                    });
                },
                fail: function(e) {
                    i(e), wx.showModal({
                        content: "请稍后重试~",
                        showCancel: !1
                    });
                }
            });
        }
    }
};