var e = Object.assign || function(e) {
    for (var t, n = 1, o = arguments.length; n < o; n++) {
        t = arguments[n];
        for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
    }
    return e;
};

Object.defineProperty(exports, "__esModule", {
    value: !0
});

var t = require("./listener.js"), n = function() {
    function e(e, t) {
        this.host = e, this.port = t;
    }
    return e.prototype.getHost = function() {
        return this.host;
    }, e.prototype.setHost = function(e) {
        this.host = e;
    }, e.prototype.getPort = function() {
        return this.port;
    }, e.prototype.setPort = function(e) {
        this.port = e;
    }, e.prototype.getAddress = function() {
        return this.host + ":" + this.port;
    }, e;
}();

exports.Config = n;

var o = function() {
    function e(e, t, n) {
        this.id = e, this.type = t, this.data = n;
    }
    return e.parse = function(t) {
        return t = JSON.parse(t), new e(t.id, t.type, t.data);
    }, e.prototype.getId = function() {
        return this.id || (this.id = "m" + new Date().getTime()), this.id;
    }, e.prototype.getType = function() {
        return this.type;
    }, e.prototype.getData = function() {
        return this.data;
    }, e.prototype.setData = function(e) {
        this.data = e;
    }, e.prototype.toString = function() {
        return JSON.stringify({
            id: this.getId(),
            type: this.getType(),
            data: this.getData()
        });
    }, e;
}();

exports.Message = o;

var r = function() {
    function n() {}
    return n.init = function(e) {
        n.config = e, wx.onSocketOpen(function(e) {
            return t.default.fireEventListener("websocket.open", [ e ]);
        }), wx.onSocketError(function(e) {
            return t.default.fireEventListener("websocket.error", [ e ]);
        }), wx.onSocketClose(function(e) {
            n._isConnected = !1, n._isLogin = !1, t.default.fireEventListener("websocket.close", [ e ]);
        }), wx.onSocketMessage(function(e) {
            if ("ping" === (e = JSON.parse(e.data)).type) return console.debug("ping server...", new Date()), 
            void wx.sendSocketMessage({
                data: '{"type":"pong"}'
            });
            var t = new o(e.id, e.type, e.data);
            console.debug("receiving server message", t);
            for (var r = 0; r < n.routes.length; r++) {
                var s = n.routes[r];
                if ("function" == typeof s.rule) {
                    if (s.rule.call(null, t) && !1 === s.callback.call(null, t)) return;
                } else if (s.rule === t.getType() && !1 === s.callback.call(null, t)) return;
            }
        });
    }, n.isInited = function() {
        return null != n.config;
    }, n.connect = function(t) {
        void 0 === t && (t = {});
        var o = t.success;
        t.success = function(e) {
            n._isConnected = !0, o && o.call(null, e);
        }, wx.connectSocket(e({
            url: "wss://" + n.config.getAddress()
        }, t));
    }, n.close = function(e) {
        void 0 === e && (e = {
            code: 1e3,
            reason: ""
        }), wx.closeSocket(e);
    }, n.request = function(e, t) {
        void 0 === t && (t = {}), wx.sendSocketMessage({
            data: e + "",
            success: function() {
                var o = n.addRoute(function(t) {
                    return t.getId() === e.getId();
                }, function(e) {
                    return n.removeRoute(o), t.success && t.success.call(null, e), t.complete && t.complete.call(null, e), 
                    !1;
                });
            },
            fail: function(e) {
                console.error("sendSocketMessage:", e), t.fail && t.fail.call(null, e), t.complete && t.complete.call(null, e);
            }
        });
    }, n.login = function(e, t) {
        void 0 === t && (t = {});
        var r = function() {
            console.log("login server...");
            var r = new o(null, "login", {
                uid: e
            }), s = t.success;
            t.success = function(e) {
                console.log("login result", e), n._isLogin = !0, s && s.call(null, e);
            }, n.request(r, t);
        };
        n.isConnected() ? (console.log("connected!"), r()) : n.connect({
            success: function() {
                return setTimeout(r, 500);
            },
            fail: console.error
        });
    }, n.send = function(t, n) {
        void 0 === n && (n = {}), wx.sendSocketMessage(e({
            data: t
        }, n));
    }, n.isConnected = function() {
        return n._isConnected;
    }, n.isLogin = function() {
        return n._isLogin;
    }, n.addRoute = function(e, t) {
        var o = {
            rule: e,
            callback: t
        };
        return n.routes.push(o), o;
    }, n.removeRoute = function(e) {
        var t = n.routes, o = t.indexOf(e);
        -1 !== o && t.splice(o, 1);
    }, n.addOnOpenListener = function(e) {
        t.default.addEventListener("websocket.open", e);
    }, n.addOnErrorListener = function(e) {
        t.default.addEventListener("websocket.error", e);
    }, n.addOnCloseListener = function(e) {
        t.default.addEventListener("websocket.close", e);
    }, n.removeOnOpenListener = function(e) {
        t.default.removeEventListener("websocket.open", e);
    }, n.removeOnErrorListener = function(e) {
        t.default.removeEventListener("websocket.open", e);
    }, n.removeOnCloseListener = function(e) {
        t.default.removeEventListener("websocket.open", e);
    }, n.routes = [], n._isConnected = !1, n._isLogin = !1, n;
}();

exports.Client = r;