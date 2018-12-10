var app = getApp(), $ = require("../../utils/util.js"), orderapi = require("../../api/orderAPI.js");
var templateMethods = require("../../utils/template_methods.js");
Page(Object.assign({},templateMethods,{
  data: {tapindex: 1, pageindex: 1, pagesize: 10, ispage: !0, flag: !0, type: 1, formId: "", orderlist: []},
  onLoad: function (e) {
    this.setMenu(this);
    app.globalData.getTop();
    this.setData({tapindex: e.sl, pageindex: 1, pagesize: 10, orderlist: [], type: e.type}), this.getOrderlist();
  },
  allOrders: function () {
    this.setData({
      tapindex: 1,
      pageindex: 1,
      pagesize: 10,
      orderlist: [],
      ispage: !0,
      flag: !0,
      type: 1
    }), this.getOrderlist();
  },
  toBePaid: function () {
    this.setData({
      tapindex: 2,
      pageindex: 1,
      pagesize: 10,
      orderlist: [],
      ispage: !0,
      flag: !0,
      type: 2
    }), this.getOrderlist();
  },
  receiptOfGoods: function () {
    this.setData({
      tapindex: 3,
      pageindex: 1,
      pagesize: 10,
      ispage: !0,
      flag: !0,
      orderlist: [],
      type: 3
    }), this.getOrderlist();
  },
  toBeEvaluated: function () {
    this.setData({
      tapindex: 4,
      pageindex: 1,
      pagesize: 10,
      ispage: !0,
      flag: !0,
      orderlist: [],
      type: 5
    }), this.getOrderlist();
  },
  scrollbottom: function () {
    if (this.data.flag) {
      var e = this;
      e.setData({flag: !1}), clearTimeout(t);
      var t = setTimeout(function () {
        e.setData({
          type: e.data.type,
          flag: !1,
          pageindex: parseInt(e.data.pageindex) + 1,
          pagesize: 10
        }), e.getOrderlist();
      }, 500);
    }
  },
  getOrderlist: function () {
    var e = {
      openId: app.globalData.UserInfo.WeiXinOpenId,
      currentPage: this.data.pageindex,
      pageSize: this.data.pagesize,
      type: this.data.type
    }, t = this;
    $.xsr($.makeUrl(orderapi.GetOrderList, e), function (e) {
      e.dataList != null ? e.dataList.length < 10 ? t.setData({
        flag: !1,
        ispage: !1,
        orderlist: t.data.orderlist.concat(e.dataList)
      }) : t.setData({flag: !0, ispage: !0, orderlist: t.data.orderlist.concat(e.dataList)}) : t.setData({
        flag: !1,
        ispage: !1
      });
      console.log('订单列表：',t.data.orderlist);
    });
  },
  cancelOrder: function (e) {
    var t = this, n = {orderid: e.currentTarget.dataset.orderid};
    $.confirm("是否取消订单", function (e) {
      e.confirm && $.xsr($.makeUrl(orderapi.CloseOrderByOrderId, n), function (e) {
        console.log(e), $.alert(e.errmsg, function () {
          t.setData({orderlist: [], currentPage: 1}), t.getOrderlist();
        });
      });
    }, !0);
  },
  confirmReceipt: function (e) {
    var t = {orderid: e.currentTarget.dataset.orderid}, n = this;
    $.confirm("是否确认收货？", function (e) {
      e.confirm && $.xsr($.makeUrl(orderapi.UpdateOrderByOrderId, t), function (e) {
        $.alert(e.errmsg, function () {
          n.setData({orderlist: [], currentPage: 1}), n.getOrderlist();
        });
      });
    }, !0);
  },
  gotoPayWrap(e) {
    let t=this;
    wx.showActionSheet({
      itemList: ['微信支付', '余额支付'],
      success: function (res) {
        console.log(res.tapIndex);
        if(res.tapIndex==0){
          t.gotopay(e);
        }else if(res.tapIndex==1){
          //设置跳转链接
          wx.setStorageSync('vip_pay_redirect','/pages/orderlist/orderlist');
          wx.navigateTo({
            url:`/pages/payment/payment?type=normal&orderid=${e.currentTarget.dataset.orderid}`
          });
        }
      },
      fail: function (res) {
        console.log(res.errMsg);
      }
    });
  },
  gotopay: function (e) {
    this.setData({formId: e.detail.formId});
    var t = {orderid: e.currentTarget.dataset.orderid, openId: app.globalData.UserInfo.WeiXinOpenId}, n = this;
    $.xsr($.makeUrl(orderapi.GetWeiXinPrePayNum, t), function (t) {
      if (t.errcode == 0) {
        console.log(t), wx.requestPayment({
          timeStamp: t.dataList.timeStamp,
          nonceStr: t.dataList.nonceStr,
          "package": t.dataList.package,
          signType: "MD5",
          paySign: t.dataList.paySign,
          success: function (t) {
            n.sendMessage(e.currentTarget.dataset.orderid), $.alert("支付成功！", function () {
              n.setData({orderlist: [], currentPage: 1}), n.getOrderlist();
            });
          },
          fail: function (e) {
            console.log("支付失败：", e);
          }
        });
      } else {
        console.log("订单提交失败：", e);
      }
    });
  },
  sendMessage: function (e) {
    var t = {
      api: orderapi.OrderPaySuccessWXMessage,
      pages: "pages/orderdetail/orderdetail?orderid=" + e,
      formId: this.data.formId,
      WeiXinOpenId: app.globalData.UserInfo.WeiXinOpenId,
      value: {orderid: e}
    };
    $.sendTpl(t);
  },
  bindTui: function (e) {
    let that = this;
    wx.showModal({
      title: '确认',
      content: '确定要申请退款吗？',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定');
          let orderId = e.currentTarget.dataset.orderid;
          let api = orderapi.refundMoney;
          api.data.orderId = orderId;
          api.success = function (resp) {
            wx.showToast({
              title: '申请成功',
              icon: 'success',
              duration: 2000
            });
            wx.navigateTo({
              url:"/pages/orderlist/orderlist"
            });
          };
          wx.request(api);
        }
      }
    })
  }
}));