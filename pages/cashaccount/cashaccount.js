var app = getApp(), $ = require("../../utils/util.js"), userapi = require("../../api/userAPI.js");
var templateMethods = require("../../utils/template_methods.js");
Page(Object.assign({}, templateMethods, {
    data: {CashData: {}},
    onLoad(){
      this.setMenu(this);
    },
    onShow: function (e) {
      app.globalData.getTop();
      var t = this, n = {openId: app.globalData.UserInfo.WeiXinOpenId};
      $.xsr($.makeUrl(userapi.GetUserCashInfo, n), function (e) {
        console.log("资金：", e), t.setData({CashData: e.dataList});
      });
      var a = wx.getStorageSync('navigation');
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: a.selectedColor || '#000'
      });
      t.setData({ __wechat_main_color: a.selectedColor });
    }, showTip: function () {
      $.confirm("只要你在店铺分享任何商品或者活动页面到微信，吸引到朋友点击并且进入店铺，TA即会成为你的一级粉丝，TA分享的一级粉丝会成为你的二级粉丝，一、二级粉丝支付购买的任何店铺内的商品，都会按照一定的计算方法算作你的奖金收益。 如果没有获得收益，主要可能有以下原因：- 你的朋友在之前已经成为其他人粉丝；- 系统判定该笔订单数据异常，收益被取消；- 自己点击了自己分享的商品链接。");
    }
  })
);