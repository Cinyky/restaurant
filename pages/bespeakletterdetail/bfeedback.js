var app = getApp(),
  $ = require("../../utils/util.js"),
  userapi = require("../../api/userAPI.js"),
  activityapi = require("../../api/bespeakivityAPI.js");
Page({
  data: {
    remark: "",
    remarkLength: 0,
    name: "",
    phone: "",
    mtime: "",
    service: "",
    platform: "",
    date: '2017-01-01',
    pageNumber: 1,
    PageSize: 10,
    ispage: !1,
    flag: !0,
    dataList: [],
    categoryId: 0,
    Title: "",
    biaoti:"",
    cid: "",
    radioCheckVal: 0
  },
  onLoad: function (opd) {
    app.globalData.getTop();
    this.setData({
      id: "",
      biaoti: opd.biaoti,
      cid: opd.cid
    });
    this.GetFKletterList();
    try {
      var e = wx.getSystemInfoSync();
      this.setData({
        platform: e.platform
      })
    } catch (t) {
      console.log(t)
    }
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  inputname: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  inputbiaoti: function (e) {
    this.setData({
      biaoti: e.detail.value
    })
  },
  inputcid: function (e) {
    this.setData({
      cid: e.detail.value
    })
  },
  inputphone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },

  inputmtime: function (e) {
    this.setData({
      mtime: e.detail.value
    })
  },

  inputRemark: function (e) {
    this.setData({
      remark: e.detail.value,
      remarkLength: e.detail.value.length
    })
  },

  submitdata: function () {
    /**if ($.isNull(this.data.service)) {
      $.alert("请选择服务人员");
      return
    }*/
    if ($.isNull(this.data.name)) {
      $.alert("请输入姓名");
      return
    }
    if ($.isNull(this.data.phone)) {
      $.alert("请输入手机号");
      return
    }
    var e = {
      name: this.data.name,
      Suggestion: this.data.remark,
      Platform: this.data.platform,
      phone: this.data.phone,
      mtime: this.data.date,
      service: this.data.service,
      Sbiaoti: this.data.biaoti,
      cid: this.data.cid,
      openId: app.globalData.UserInfo.WeiXinOpenId
    };
    console.log(e), $.xsr($.makeUrl(userapi.AddMiniFkSuggestion, e), function (e) {
      console.log(e), e.errcode == 0 ? ($.alert("提交成功！"), setTimeout(function () {
        $.backpage(1, function () { })
      }, 1e3)) : $.alert(e.errmsg)
    })
  },
  GetFKletterList: function () {
    var e = {
      pageNumber: this.data.pageNumber,
      PageSize: 10,
      categoryId: this.data.categoryId || 0
    },
      t = this;
    $.xsr($.makeUrl(activityapi.GetFKletterList, e), function (e) {
      $.isNull(e.dataList), !$.isNull(e.dataList) && e.errcode == 0 ? (e.dataList.length < 10 && t.setData({
        flag: !1
      }), t.setData({
        ispage: !0,
        dataList: t.data.dataList.concat(e.dataList)
      })) : t.setData({
        flag: !1,
        ispage: !0
      })
    })
  },
  inputservice: function (e) {
    this.setData({
      service: e.detail.value
    })
  },
  scrollbottom: function () {
    if (this.data.flag) {
      var e = this;
      clearTimeout(t);
      var t = setTimeout(function () {
        e.setData({
          pageNumber: e.data.pageNumber + 1
        }), e.GetNewsletterList()
      }, 500)
    }
  }
});