var app = getApp(),
  $ = require("../../utils/util.js"),
  userapi = require("../../api/userAPI.js"),
  notice = require("../../utils/notice.js");
var templateMethods = require("../../utils/template_methods.js");
Page(Object.assign({}, templateMethods, {
  data: {
    addresslist: {},
    isdata: !1,
    spid: "",
    adid: 0
  },
  onLoad: function(e) {
    this.setMenu(this);
    app.globalData.getTop();
    this.setData({
      adid: e.adid || 0,
      spid: e.spid || ""
    }), this.GetAddressList();
    var t = this;
    notice.addNotification("Refresh", t.RefreshMethod, t);
  },
  onShow: function () {
    var a = wx.getStorageSync('navigation');
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: a.selectedColor || '#000'
    });
    this.setData({ __wechat_main_color: a.selectedColor });
  },
  RefreshMethod: function() {
    this.GetAddressList();
  },
  GetAddressList: function() {
    var e = this,
      t = {
        openId: app.globalData.UserInfo.WeiXinOpenId
      };
    $.xsr($.makeUrl(userapi.GetAddressList, t), function(t) {
      $.isNull(t) || $.isNull(t.dataList) ? e.setData({
        isdata: !1
      }) : e.setData({
        isdata: !0,
        addresslist: t.dataList
      });
    });
  },
  SelectAddress: function(e) {
    var t = this;
    $.backpage(1, function() {
      var n = {
        adid: e.currentTarget.dataset.adid,
        spid: t.data.spid
      };
      notice.postNotificationName("RefreshOrder", n);
    });
  },
  EditAddress: function(e) {
    var t = this;
    this.data.adid != 0 ? wx.redirectTo({
      url: "/pages/addressmanage/addressmanage?adid=" + e.currentTarget.dataset.adid + "&issub=true" + (t.data.spid == "" ? "" : "&spid=" + t.data.spid)
    }) : wx.navigateTo({
      url: "/pages/addressmanage/addressmanage?adid=" + e.currentTarget.dataset.adid + "&issub=false"
    });
  },
  AddAddress: function() {
    wx.chooseAddress({
      success: function(res) {
        console.log(res.userName);
        console.log(res.postalCode);
        console.log(res.provinceName);
        console.log(res.cityName);
        console.log(res.countyName);
        console.log(res.detailInfo);
        console.log(res.nationalCode);
        console.log(res.telNumber);
        var e = {
            openId: app.globalData.UserInfo.WeiXinOpenId,
            consignee: res.userName,
            province: 'auto',
            city: 'auto',
            district: 'auto',
            detail: res.detailInfo,
            isDefault: false,
            phone: res.telNumber,
            seladstr: res.provinceName + ',' + res.cityName + ',' + res.countyName
          },
          t = this;
        console.log(e);
        $.xsr($.makeUrl(userapi.AddAddress, e), function(e) {
          e.errcode == 0 && wx.showToast({
            title: "添加成功",
            icon: "success",
            duration: 2e3,
            success: function() {
              console.log('新增成功');
              wx.navigateTo({
                url: "/pages/shopaddress/shopaddress"
              });

            }
          });
          e.errcode == 1 && console.log(e.errmsg);
        })
      },
      fail: function() {
        // wx.navigateTo({url: "/pages/addressmanage/addressmanage?issub=false"});
      }
    })
  },
  DelAddress: function(e) {
    var t = this;
    wx.showModal({
      title: "提示",
      content: "确认删除这个地址吗？",
      showCancel: !0,
      success: function(n) {
        if (n.confirm) {
          var r = {
            Id: e.currentTarget.dataset.adid
          };
          $.xsr($.makeUrl(userapi.DelAddress, r), function(e) {
            wx.showToast({
              title: "删除成功！"
            }), notice.postNotificationName("RefreshOrder", 0), t.GetAddressList();
          });
        }
      }
    });
  }
}));