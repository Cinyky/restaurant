var app = getApp(), $ = require("../../utils/util.js"), orderapi = require("../../api/orderAPI.js");
Page({
  data: {OrderInfo: {}, formId: "", isdata: !1},
  onLoad(e){
    this.setData({tempE:e});
  },
  onShow: function () {
    var t = this;
    var e=t.data.tempE;
    app.globalData.getTop();
    $.isNull(app.globalData.UserInfo) ? app.GetUserInfo(function () {
      t.InitPage(e)
    }, e.uid) : t.InitPage(e)
  }, InitPage: function (e) {
    var t = {orderid: e.orderid, openId: app.globalData.UserInfo.WeiXinOpenId}, n = this;
    $.xsr($.makeUrl(orderapi.GetOrderInfo, t), function (e) {
      console.log(e);
      if (e.errcode == 0) {
        console.log(e.dataList);
        n.setData({OrderInfo: e.dataList, isdata: !0})
      } else {
        n.setData({isdata: !1})
      }
    })
  }, cancelOrder: function (e) {
    var t = {orderid: e.currentTarget.dataset.orderid};
    $.confirm("是否取消订单", function (e) {
      e.confirm && $.xsr($.makeUrl(orderapi.CloseOrderByOrderNum, t), function (e) {
        $.alert("取消成功！", function () {
          $.backpage(1)
        })
      })
    }, !0)
  }, gotopay: function (e) {
    console.log(e.detail.formId), this.setData({formId: e.detail.formId});
    var t = {orderid: e.currentTarget.dataset.orderid, openId: app.globalData.UserInfo.WeiXinOpenId}, n = this;
    $.xsr($.makeUrl(orderapi.GetWeiXinPrePayNum, t), function (e) {
      wx.requestPayment({
        timeStamp: e.Info.timeStamp,
        nonceStr: e.Info.nonceStr,
        "package": e.Info.package,
        signType: "MD5",
        paySign: e.Info.paySign,
        success: function (e) {
          console.log(e), n.sendMessage(n.data.OrderInfo.orderid), $.alert("支付成功！", function () {
            $.backpage(1)
          })
        },
        fail: function (e) {
          console.log("支付失败：", e)
        }
      })
    })
  }, sendMessage: function (e) {
    var t = {
      api: orderapi.OrderPaySuccessWXMessage,
      pages: "pages/orderdetail/orderdetail?orderid=" + e,
      formId: this.data.formId,
      WeiXinOpenId: app.globalData.UserInfo.WeiXinOpenId,
      value: {orderid: e}
    };
    $.sendTpl(t)
  }
});