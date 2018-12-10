function e(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}

var a = e(require("../../../utils/dg.js")), t = e(require("../../../utils/data.js")), r = e(require("../../../utils/requestUtil.js")), s = e(require("../../../utils/underscore.js")), i = (e(require("../../../utils/util.js")), 
t.default.duoguan_host_api_url + "/index.php/addon/DuoguanHouse");

Page({
    data: {
        listUrl: "/NewHouseApi/listInfo",
        list: [],
        pageNumber: 1,
        pageSize: 20,
        hasMore: !0,
        isShowLoading: !1,
        shareInfo: {},
        searchHidden: !1,
        searchContent: "",
        serrchFocus: !1
    },
    onLoad: function(e) {
        this.initialize(e);
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        var e = this.getSearch(), a = {};
        a = {
            pageNumber: this.data.pageNumber,
            pageSize: this.data.pageSize,
            hasMore: this.data.hasMore,
            url: this.data.listUrl,
            search: e
        }, this.reachBottom(a);
    },
    initialize: function(e) {
        var a = this.getSearch();
        e = {
            pageNumber: 1,
            pageSize: this.data.pageSize,
            hasMore: !0,
            url: this.data.listUrl,
            search: a
        }, this.reachBottom(e);
    },
    reachBottom: function(e) {
        var a = this;
        if (!e.hasMore) return this.setData({
            isShowLoading: !1
        }), !1;
        e.search = JSON.stringify(e.search);
        var t = i + e.url, n = {
            _p: e.pageNumber,
            _r: e.pageSize,
            search: e.search
        };
        r.default.get(t, n, function(t) {
            var r = a.data.list;
            0 != (t = t || []).length && (0, s.default)(t).map(function(e) {
                return e.labelTextList = e.label.split(","), e;
            }), r = 1 == e.pageNumber ? t || [] : r.concat(t || []), a.setData({
                isShowLoading: !1,
                hasMore: !(t.length < a.data.pageSize),
                pageNumber: e.pageNumber + 1,
                list: r,
                nodata: 0 != r.length
            });
        });
    },
    getSearch: function() {
        var e = [];
        return this.data.searchContent && (e = [ {
            name: "search",
            value: this.data.searchContent
        } ]), e;
    },
    searchFocus: function(e) {
        this.setData({
            searchHidden: !0,
            searchFocus: !0
        });
    },
    searchBlur: function(e) {
        var a = e.detail.value || "";
        this.setData({
            searchHidden: "" != a,
            searchContent: "" == a ? "" : a,
            searchFocus: !1
        }), this.search();
    },
    searchInput: function(e) {
        var a = e.detail.value || "";
        this.setData({
            searchContent: a,
            searchHidden: !0
        }), this.search();
    },
    search: function() {
        this.setData({
            pageNumber: 1,
            hasMore: !0,
            list: []
        });
        var e = this.getSearch(), a = {};
        a = {
            pageNumber: 1,
            pageSize: this.data.pageSize,
            hasMore: !0,
            url: this.data.listUrl,
            search: e
        }, this.reachBottom(a);
    },
    navigateTo: function(e) {
        var t = e.currentTarget.dataset.path + e.currentTarget.dataset.param;
        a.default.navigateTo({
            url: t
        });
    }
});