var app = getApp(), $ = require("../../utils/util.js"), userapi = require("../../api/userAPI.js"); Page({ data: { tapindex: 1, pageindex: 1, ChangeType: 0, ispage: !0, flag: !0, CaseDetailList: [] }, onShow: function () { app.globalData.getTop(); this.setData({ CaseDetailList: [] }), this.InitData() }, InitData: function () { var e = { ChangeType: this.data.ChangeType, userId: app.globalData.UserInfo.Id, PageIndex: this.data.pageindex }, t = this; $.xsr($.makeUrl(userapi.SelectUserCashAccount, e), function (e) { e.dataList != null && e.errcode != 1 ? e.dataList.length < 10 ? t.setData({ CaseDetailList: t.data.CaseDetailList.concat(e.dataList), flag: !1, ispage: !1 }) : t.setData({ CaseDetailList: t.data.CaseDetailList.concat(e.dataList) }) : t.setData({ flag: !1, ispage: !1 }) }) }, scrollbottom: function () { if (this.data.flag) { var e = this; clearTimeout(t); var t = setTimeout(function () { e.setData({ pageindex: parseInt(e.data.pageindex) + 1 }), e.InitData() }, 500) } }, allTypes: function () { this.setData({ tapindex: 1, pageindex: 1, ispage: !0, flag: !0, ChangeType: 0, CaseDetailList: [] }), this.InitData() }, expenditure: function () { this.setData({ tapindex: 2, pageindex: 1, ispage: !0, flag: !0, ChangeType: 1, CaseDetailList: [] }), this.InitData() }, income: function () { this.setData({ tapindex: 3, pageindex: 1, ispage: !0, ChangeType: 2, flag: !0, CaseDetailList: [] }), this.InitData() } });