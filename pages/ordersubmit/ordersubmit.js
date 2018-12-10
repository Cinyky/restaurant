var app = getApp(),
  $ = require("../../utils/util.js"),
  cartapi = require("../../api/cartAPI.js"),
  orderapi = require("../../api/orderAPI.js"),
  notice = require("../../utils/notice.js");
Page({
  data: {
    cartinfo: {},
    addressid: 0,
    spinfo: "",
    remark: "",
    remarkLength: 0,
    formId: "",
    submitinfo: {},
    isSubmit: !1,
    couponItemId: 0,
    orderid: "",
    IsUseCoupon: 1
  },
  onLoad: function (e) {
    app.globalData.getTop();
    this.setData({
      spinfo: e.spid || ""
    });
    var t = this;
    notice.addNotification("RefreshOrder", t.RefreshOrder, t),
      notice.addNotification("RefreshCoupon", t.RefreshCoupon, t),
      this.getcartlist();
    this.getPayType();
  },
  getPayType:function(){
    let t = this;
    let api = orderapi.GetPayType;
    wx.request({
      url:api.url,
      data:{
        wid:api.data.wid
      },
      method:"POST",
      success: function (e) {
        console.log('支付方式回调：',e.data.data);
        t.setData({
          payTypeArr:e.data.data
        })
      }
    })
  },
  RefreshOrder: function (e) {
    this.setData({
      spinfo: e.spid
    }),
      this.getcartlist();
  },
  RefreshCoupon: function (e) {
    this.setData({
      couponItemId: e.couponItemId,
      IsUseCoupon: e.IsUseCoupon
    }),
      this.getcartlist();
  },
  getcartlist: function () {
    var e = this,
      t = {
        openId: app.globalData.UserInfo.WeiXinOpenId
      };
    $.xsr($.makeUrl(cartapi.GetCartList, t),
      function (t) {
        var n = {
          openId: app.globalData.UserInfo.WeiXinOpenId,
          ShoppingCartList: [],
          couponItemId: e.data.couponItemId,
          IsUseCoupon: e.data.IsUseCoupon,
          addressId: e.data.addressid
        };
        if ($.isNull(e.data.spinfo)) {
          var r = t.dataList.VendorList[0].ShoppingCartList;
          for (var i in r) r[i].IsCheck && (n.ShoppingCartList.push(r[i]));
        } else n.ShoppingCartList.push(JSON.parse(e.data.spinfo));
        e.setData({
          cartinfo: n.ShoppingCartList
        }),
          console.log(e.data.cardInfo);
          $.xsr($.makeUrl(cartapi.GoSettlement, n),
            function (t) {
              t.errcode == 0 && (e.setData({
                // addressid: $.isNull(t.dataList.DeliveryAddress) ? 0 : t.dataList.DeliveryAddress.address_id,
                submitinfo: t.dataList
              }), $.isNull(e.data.submitinfo.ShoppingCartUsedCouponInfo) || e.setData({
                couponItemId: e.data.submitinfo.ShoppingCartUsedCouponInfo.CouponItem.Id
              }));
            });
      });
  },
  getLocalTime: function (e) {
    e = e.replace("/Date(", "").replace(")/", "");
    var t = new Date(parseInt(e));
    return t;
  },
  submitorder: function (e) {
    var t = this;
    if ($.isNull(t.data.orderid)) {
      if (this.data.addressid == 0) {
        wx.showModal({
          title: "提示",
          showCancel: !1,
          content: "请添加地址！"
        });
        return;
      }
      var n = {
        openId: app.globalData.UserInfo.WeiXinOpenId,
        ShoppingCartList: this.data.cartinfo,
        remark: t.data.remark,
        addressId: this.data.addressid,
        couponItemId: this.data.couponItemId
      };
      console.log(n);
      $.xsr($.makeUrl(orderapi.SubmitOrders, n),
        function (n) {
          n.errcode == 0 ? (t.setData({
            formId: e.detail.formId,
            orderid: n.dataList.OrderId
          }), n.dataList.ActualPayPrice > 0 ? t.gotoPayWrap() : t.returnUrl(n.dataList.OrderId)) : wx.showToast({
            title: n.errmsg
          });
        });
    } else t.gotoPayWrap();
  },
  gotoPayWrap() {
    let t=this;
    var itemlist;
    if(t.data.payTypeArr[1]){
      itemlist=['微信支付', '余额支付']
    }else if(t.data.payTypeArr[0] == 1){
      itemlist=['微信支付']
    }else{
      itemlist=['余额支付']
    }
    wx.showActionSheet({
      itemList: itemlist,
      success: function (res) {
        console.log(res.tapIndex);
        if(t.data.payTypeArr[1]){
          if(res.tapIndex==0){
            t.gotopay();
          }else if(res.tapIndex==1){
            // 设置支付后跳转链接
            wx.setStorageSync('vip_pay_redirect',`/pages/orderdetail/orderdetail?orderid=${t.data.orderid}`);
            wx.navigateTo({
              url:`/pages/payment/payment?type=normal&orderid=${t.data.orderid}`
            });
          }
        }else if(t.data.payTypeArr[0] == 1){
          t.gotopay();
        }else{
          // 设置支付后跳转链接
          wx.setStorageSync('vip_pay_redirect',`/pages/orderdetail/orderdetail?orderid=${t.data.orderid}`);
          wx.navigateTo({
            url:`/pages/payment/payment?type=normal&orderid=${t.data.orderid}`
          });
        }
        
      },
      fail: function (res) {
        console.log(res.errMsg);
      }
    });
  },
  gotopay: function () {
    var e = this,
      t = {
        orderid: this.data.orderid,
        openId: app.globalData.UserInfo.WeiXinOpenId
      };
    this.data.isSubmit = !0,
      $.xsr($.makeUrl(orderapi.GetWeiXinPrePayNum, t),
        function (n) {
        console.log(n);
          wx.requestPayment({
            timeStamp: n.dataList.timeStamp,
            nonceStr: n.dataList.nonceStr,
            "package": n.dataList.package,
            signType: "MD5",
            paySign: n.dataList.paySign,
            success: function (n) {
              e.sendMessage(t.orderid, 2),
                e.returnUrl(t.orderid);
            },
            fail: function (n) {
              $.gotopage("/pages/orderdetail/orderdetail?orderid=" + t.orderid),
                e.sendMessage(t.orderid, 1);
            }
          });
        });
  },
  inputRemark: function (e) {
    this.setData({
      remark: e.detail.value,
      remarkLength: e.detail.value.length
    });
  },
  sendMessage: function (e, t) {
    var n = {
      api: t == 1 ? orderapi.OrderSubmitMessage : orderapi.OrderPaySuccessWXMessage,
      pages: "pages/orderdetail/orderdetail?orderid=" + e,
      formId: this.data.formId,
      WeiXinOpenId: app.globalData.UserInfo.WeiXinOpenId,
      value: {
        orderid: e
      }
    };
    $.sendTpl(n);
  },
  suitcouponlist: function () {
    wx.navigateTo({
      url: "/pages/suitcouponlist/suitcouponlist?val=" + JSON.stringify(this.data.submitinfo.ShoppingCartCouponInfoList) + "&id=" + this.data.couponItemId
    });
  },
  returnUrl: function (e) {
    var t = this;
    $.gotopage("/pages/orderdetail/orderdetail?orderid=" + e);
    return;
  },
  selectAddress: function () {
    var e = this;
    wx.chooseAddress({
      success: function (t) {
        var n = {
          cityName: t.cityName,
          countyName: t.countyName,
          provinceName: t.provinceName,
          detailInfo: t.detailInfo,
          errMsg: t.errMsg,
          userName: t.userName,
          nationalCode: t.nationalCode,
          postalCode: t.postalCode,
          telNumber: t.telNumber,
          openId: app.globalData.UserInfo.WeiXinOpenId
        };
        e.setData({
          receiver: n.userName,
          phone: n.telNumber,
          FullAddress: n.provinceName + n.cityName + n.countyName + n.detailInfo,
        });
        $.xsr($.makeUrl(orderapi.selectAddressInfo, n),
          function (t) {
            e.setData({
              addressid: t.dataList.id,
            });

          });
      },
    });
  }
});