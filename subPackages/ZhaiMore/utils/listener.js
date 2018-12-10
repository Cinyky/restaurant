function e(e, n) {
    if (!(e instanceof n)) throw new TypeError("Cannot call a class as a function");
}

Object.defineProperty(exports, "__esModule", {
    value: !0
});

var n = function() {
    function e(e, n) {
        for (var r = 0; r < n.length; r++) {
            var t = n[r];
            t.enumerable = t.enumerable || !1, t.configurable = !0, "value" in t && (t.writable = !0), 
            Object.defineProperty(e, t.key, t);
        }
    }
    return function(n, r, t) {
        return r && e(n.prototype, r), t && e(n, t), n;
    };
}(), r = function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}(require("./underscore.js")), t = [], u = function() {
    function u() {
        e(this, u);
    }
    return n(u, null, [ {
        key: "addEventListener",
        value: function(e, n) {
            if (!e || !isNaN(parseInt(e))) throw TypeError("监听器名称只能为英文字母以及下划线！");
            if (!r.default.isFunction(n)) throw TypeError("监听器只能为回调函数！");
            void 0 === t[e] && (t[e] = []), t[e].push(n);
        }
    }, {
        key: "removeEventListener",
        value: function(e, n) {
            if (r.default.isFunction(n)) {
                var u = function(e, n) {
                    var t = r.default.indexOf(e, n);
                    -1 !== t && e.splice(t, 1);
                };
                e && isNaN(parseInt(e)) ? u(t[e] || [], n) : r.default.each(t, function(e) {
                    u(e, n);
                });
            }
        }
    }, {
        key: "fireEventListener",
        value: function(e, n, r) {
            if (!e || !isNaN(parseInt(e))) throw TypeError("监听器名称只能为英文字母以及下划线！");
            for (var u = t[e] || [], i = 0; i < u.length; i++) if (!1 === u[i].apply(r, n)) return !1;
        }
    } ]), u;
}();

exports.default = u, "undefined" != typeof module && (u.default = u, module.exports = u);