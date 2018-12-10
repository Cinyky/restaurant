function e(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}

var t = e(require("../../../utils/dg")), a = e(require("../../../utils/data")), i = e(require("../../../utils/requestUtil")), s = e(require("../../../utils/underscore")), o = e(require("../../../utils/util")), n = t.default.os.isAlipay(), r = a.default.duoguan_host_api_url + "/index.php/addon/DuoguanHouse";

Page({
    data: {
        isAli: n,
        listUrl: "/HousePublishApi/list",
        list: [],
        pageNumber: 1,
        pageSize: 20,
        hasMore: !0,
        isShowLoading: !1,
        nodata: !1,
        dialog: "hidden",
        index: 0,
        baseInfo: {
            isAgent: !1,
            phone_number: 0,
            refresh_point_price: 0
        }
    },
    onLoad: function(e) {
        var t = this;
        o.default.trySyncUserInfo(function(a) {
            t.initialize(e);
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
        this.mockPullDownRefresh();
    },
    onReachBottom: function() {
        var e = [], t = {
            pageNumber: this.data.pageNumber,
            pageSize: this.data.pageSize,
            hasMore: this.data.hasMore,
            url: this.data.listUrl,
            search: e
        };
        this.reachBottom(t);
    },
    initialize: function(e) {
        var t = this, a = r + "/HousePublishApi/baseInfo", s = {};
        i.default.get(a, s, function(e) {
            t.setData({
                baseInfo: e
            });
        }, this, {
            isShowLoading: !1
        });
        var o = [];
        e = {
            pageNumber: 1,
            pageSize: this.data.pageSize,
            hasMore: !0,
            url: this.data.listUrl,
            search: o
        }, this.reachBottom(e);
    },
    mockPullDownRefresh: function() {
        this.setData({
            list: [],
            pageNumber: 1,
            pageSize: 20,
            hasMore: !0,
            isShowLoading: !1,
            nodata: !1
        });
        var e = [], t = {
            pageNumber: 1,
            pageSize: this.data.pageSize,
            hasMore: !0,
            url: this.data.listUrl,
            search: e
        };
        this.reachBottom(t);
    },
    reachBottom: function(e) {
        var a = this;
        if (!e.hasMore) return this.setData({
            isShowLoading: !1
        }), this.showToast("已经到底啦"), !1;
        e.search = JSON.stringify(e.search);
        var o = r + e.url, n = {
            _p: e.pageNumber,
            _r: e.pageSize,
            search: e.search
        };
        i.default.get(o, n, function(t) {
            var i = a.data.list;
            0 != (t = t || []).length && (0, s.default)(t).map(function(e) {
                return e;
            }), i = 1 == e.pageNumber ? t || [] : i.concat(t || []), a.setData({
                isShowLoading: !1,
                hasMore: !(t.length < a.data.pageSize),
                pageNumber: e.pageNumber + 1,
                list: i,
                nodata: 0 != i.length
            });
        }, this, {
            isShowLoading: !1,
            completeAfter: function(e) {
                t.default.stopPullDownRefresh();
            }
        });
    },
    action: function(e) {
        var a = e.currentTarget.dataset.form, o = e.currentTarget.dataset.index, n = this.data.isAli ? e.target.targetDataset.action : e.target.dataset.action, u = this, l = r, d = {};
        if ("list" == a) "more" == n ? this.setData({
            dialog: "",
            index: o
        }) : "refresh" == n ? t.default.confirm("确定要刷顶此房源吗？", function(e) {
            e.confirm ? (l += "/HousePublishApi/refresh", d = {
                id: u.data.list[o].id
            }, i.default.get(l, d, function(e) {
                "success" == e.action && (u.showToast("刷新成功"), u.setData({
                    dialog: "hidden"
                }), u.mockPullDownRefresh());
            }, this, {
                isShowLoading: !1
            })) : u.showToast();
        }, "温馨提示") : "top" == n && t.default.confirm("确定要置顶此房源吗？", function(e) {
            e.confirm ? (l += "/HousePublishApi/top", d = {
                id: u.data.list[o].id
            }, i.default.get(l, d, function(e) {
                "success" == e.action && (u.showToast("置顶成功"), u.setData({
                    dialog: "hidden"
                }), u.mockPullDownRefresh());
            }, this, {
                isShowLoading: !1
            })) : u.showToast();
        }, "温馨提示"); else if ("dialog" == a) if ("cancel" == n) this.setData({
            dialog: "hidden",
            index: 0
        }); else if ("delete" == n) t.default.confirm("确定要删除此房源吗？", function(e) {
            e.confirm ? (l += "/HousePublishApi/delete", d = {
                id: u.data.list[o].id
            }, i.default.get(l, d, function(e) {
                "success" == e.action && (u.showToast("删除成功"), u.setData({
                    dialog: "hidden"
                }), u.mockPullDownRefresh());
            }, this, {
                isShowLoading: !1
            })) : u.showToast();
        }, "温馨提示"); else if ("make_phone" == n) {
            var h = (this.data.baseInfo.phone_number || 0) + "";
            t.default.makePhoneCall({
                phoneNumber: h
            });
        } else if ("edit" == n) t.default.confirm("确定要修改此房源吗？", function(e) {
            if (e.confirm) {
                var a = u.data.list[o].is_sell, i = "?pagefrom=edit&id=" + u.data.list[o].id;
                if (1 == a) {
                    var s = "/pages/house/sell-regist/sell-regist" + i;
                    t.default.navigateTo({
                        url: s
                    });
                } else if (2 == a) {
                    var n = "/pages/house/rent-out-regist/rent-out-regist" + i;
                    t.default.navigateTo({
                        url: n
                    });
                } else u.showToast("数据异常");
            } else u.showToast();
        }, "温馨提示"); else if ("down_shelves" == n || "up_shelves" == n) {
            var f = "down_shelves" == n ? 2 : 1, c = 1 == f ? "上架" : "下架";
            if (this.data.list[o].is_show == f) return u.showToast("房源已" + c), !1;
            t.default.confirm("确定要" + c + "此房源吗？", function(e) {
                e.confirm ? (l += "/HousePublishApi/upAndDownShelves", d = {
                    id: u.data.list[o].id,
                    is_show: f
                }, i.default.get(l, d, function(e) {
                    if ("success" == e.action) {
                        u.showToast(c + "成功");
                        var t = u.data.list;
                        t = s.default.map(t, function(e, t) {
                            return t == o && (e.is_show = f), e;
                        }), u.setData({
                            dialog: "hidden",
                            list: t
                        });
                    }
                }, this, {
                    isShowLoading: !1
                })) : u.showToast();
            }, "温馨提示");
        } else "view" == n && t.default.confirm("确定要预览详情吗？", function(e) {
            if (e.confirm) {
                var a = "../detail/detail" + ("?id=" + u.data.list[o].id);
                t.default.navigateTo({
                    url: a
                });
            } else u.showToast();
        }, "温馨提示");
    },
    showToast: function() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "操作取消成功";
        t.default.showToast({
            title: e,
            duration: 800
        });
    },
    buy: function(e) {
        var a = e.currentTarget.dataset, i = a.path + a.params;
        t.default.navigateTo({
            url: i
        });
    }
});