function e(t, o) {
    var a = new Date(t), s = new Date(), n = a.getTime() - s.getTime(), i = 0, u = 0, m = 0, r = 0;
    n >= 0 ? (i = Math.floor(n / 1e3 / 60 / 60 / 24), u = Math.floor(n / 1e3 / 60 / 60 % 24), 
    m = Math.floor(n / 1e3 / 60 % 60), r = Math.floor(n / 1e3 % 60), o.setData({
        goods_tuan_status: !0,
        shengTime: i + "天" + u + "时" + m + "分" + r + "秒后结束"
    }), setTimeout(function() {
        e(t, o);
    }, 1e3)) : o.setData({
        goods_tuan_status: !1,
        shengTime: "已结束"
    });
}

module.exports = {
    GetRTime: e
};