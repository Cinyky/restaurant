var o = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
    return typeof o;
} : function(o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
};

module.exports = {
    duoguanJsonSort: function(t, r, e) {
        return t.length < 2 || !r || "object" !== o(t[0]) ? t : ("number" == typeof t[0][r] && t.sort(function(o, t) {
            return o[r] - t[r];
        }), "string" == typeof t[0][r] && t.sort(function(o, t) {
            return o[r].localeCompare(t[r]);
        }), e && t.reverse(), t);
    }
};