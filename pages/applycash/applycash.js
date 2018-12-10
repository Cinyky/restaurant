var app = getApp(),
  $ = require("../../utils/util.js"),
  userapi = require("../../api/userAPI.js");
Page({
  data: {
    TotalPrice: 0,
    Price: "",
    alipayName: "",
    alipayNum: "",
    Phone: "",
    inputPrice: "",
    isPrice: !0,
    inputPhone: "",
    ValidDays: 0,
    isPhone: !0,
    inputalipayName: "",
    isalipayName: !0,
    inputalipayNum: "",
    isalipayNum: !0,
    limit: 100
  },
  onLoad: function() {
    app.globalData.getTop();
    var e = {
        openId: app.globalData.UserInfo.WeiXinOpenId
      },
      t = this;
    $.xsr($.makeUrl(userapi.UserInfoPointTotalCashrealName, e), function(e) {
      e.dataList.length > 0 && t.setData({
        TotalPrice: e.dataList[0].canUseCashAmount,
        ValidDays: e.dataList[0].ValidDays,
        alipayName: e.dataList[0].alipayName,
        alipayNum: e.dataList[0].alipayNum,
        Phone: e.dataList[0].Phone
      })
    })
  },
  onShow: function() {
    var a = wx.getStorageSync('navigation');
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: a.selectedColor || '#000'
    });
    this.setData({ __wechat_main_color: a.selectedColor });
  },
  inputPrice: function(e) {
    this.setData({
      Price: e.detail.value
    }), $.isNull(e.detail.value) ? this.setData({
      isPrice: !1
    }) : this.setData({
      isPrice: !0
    })
  },
  inputalipayName: function(e) {
    this.setData({
      alipayName: e.detail.value
    }), $.isNull(e.detail.value) ? this.setData({
      isalipayName: !1
    }) : this.setData({
      isalipayName: !0
    })
  },
  inputalipayNum: function(e) {
    this.setData({
      alipayNum: e.detail.value
    }), $.isNull(e.detail.value) ? this.setData({
      isalipayNum: !1
    }) : this.setData({
      isalipayNum: !0
    })
  },
  inputPhone: function(e) {
    this.setData({
      Phone: e.detail.value
    }), $.isNull(e.detail.value) ? this.setData({
      isPhone: !1
    }) : /^1[34578]\d{9}$/.test(e.detail.value) ? this.setData({
      isPhone: !0
    }) : this.setData({
      isPhone: !1
    })
  },
  submitdata: function() {
    $.isNull(this.data.Price) ? this.setData({
      isPrice: !1
    }) : parseInt(this.data.Price) < this.data.limit || this.data.Price % this.data.limit > 0 ? (this.setData({
      isPrice: !1
    }), $.alert("亲~提现金额必须是" + this.data.limit + "的整数倍才能提现哟！")) : this.setData({
      isPrice: !0
    }), $.isNull(this.data.alipayName) ? this.setData({
      isalipayName: !1
    }) : this.setData({
      isalipayName: !0
    }), $.isNull(this.data.alipayNum) ? this.setData({
      isalipayNum: !1
    }) : this.setData({
      isalipayNum: !0
    }), $.isNull(this.data.Phone) ? this.setData({
      isPhone: !1
    }) : /^1[34578]\d{9}$/.test(this.data.Phone) ? this.setData({
      isPhone: !0
    }) : this.setData({
      isPhone: !1
    });
    if (this.data.isPrice && this.data.isalipayName && this.data.isalipayNum && this.data.isPhone) {
      var e = {
        openId: app.globalData.UserInfo.WeiXinOpenId,
        Price: this.data.Price,
        Phone: this.data.Phone,
        alipayName: this.data.alipayName,
        alipayNum: this.data.alipayNum,
        nickName: app.globalData.UserInfo.NickName
      };
      $.xsr($.makeUrl(userapi.ApplyToCash, e), function(e) {
        console.log("提现：", e), e.errcode == 0 ? wx.showModal({
          title: "提示",
          content: e.errmsg,
          showCancel: !1,
          success: function(n) {
            if (n.confirm) {
              $.backpage(1, function() {
                $.alert(e.errmsg)
              })
            }
          }
        }) : $.alert(e.errmsg)
      })
    }
  }
});