var app = getApp(),
  $ = require("../../utils/util.js"),
  bargainAPI = require("../../api/bargainAPI.js"),
  notice = require("../../utils/notice.js");
Page({
  data: {
    product: {}
  },
  onLoad: function (options) {
    app.globalData.getTop();
    let that = this;
    let pageStack = getCurrentPages();
    let prevPage = pageStack[pageStack.length - 2];
    let prevData = prevPage.data.orderdetaildata;
    console.log(prevData);
    let product = prevData.goodsinfo;
    //获取原价
    let perPrice = product.goods_price;
    //获取实付商品价格
    let reallyPrice = prevData.orderinfo.really_price;
    //带运费价格
    let allPrice = parseFloat(reallyPrice) + parseFloat(product.trans_price);
    that.setData({
      prevData: prevData,
      product: product,
      perPrice: perPrice,
      reallyPrice:reallyPrice,
      num: 1,
      allPrice: allPrice
    });

  },
  //设置收货地址
  selectAddress: function () {
    var that = this;
    wx.chooseAddress({
      success: function (addr) {
        console.log('选择的收货地址', addr);
        that.setData({
          receiver: addr.userName,
          phone: addr.telNumber,
          FullAddress: addr.provinceName + addr.cityName + addr.countyName + addr.detailInfo
        });
      }
    });
  },
  //备注信息
  remarkInput: function (e) {
    let that = this;
    let remark = e.detail.value;
    if (remark.length > 200) {
      that.setData({
        remark: that.data.remark
      });
    } else {
      this.setData({
        remark: remark
      });
    }
  },
  //提交订单
  submitOrder: function () {
    let that = this;
    console.log(that.data);
    if (!that.data.FullAddress) {
      that.selectAddress();
      return false;
    }
    let api = bargainAPI.editOrder;
    //整理订单数据
    api.data = Object.assign(api.data, {
      openid: app.globalData.UserInfo.WeiXinOpenId,
      //订单参数
      goodsid: that.data.product.id,//商品id
      remark: that.data.remark,//备注
      receiver: that.data.receiver,//收件人
      phone: that.data.phone,//手机号
      address: that.data.FullAddress,//收货地址
      orderid: that.data.prevData.orderinfo.id,//订单id
    });
    //设置回调
    api = Object.assign(api, {
      success: function (resp) {
        console.log(resp);
        // 进行支付方式的选择
        wx.showActionSheet({
          itemList: ['微信支付'],
          success: function (res) {
            console.log(res.tapIndex);
            if (res.tapIndex == 0) {
              // 微信支付
              let payObj = resp.data.payObj;
              if (payObj.package) {
                payObj.success = function (resp2) {
                  wx.showModal({
                    title: '成功',
                    content: '支付成功',
                    showCancel: 0,
                    success: function (res) {
                      if (res.confirm) {
                        console.log('用户点击确定');
                        //跳转到订单详情页面
                        wx.redirectTo({
                          url: '/pages/bargaingoodslist/goodslist?index=1'
                        });
                      }
                    }
                  });
                };
                payObj.fail = function (resp2) {
                  console.log('支付方法调用失败,错误信息如下');
                  console.log(resp2);
                };
                wx.requestPayment(payObj);
              }
            }
          },
          fail: function (res) {
            console.log(res.errMsg);
          }
        });
      },
      error: function () {
        wx.showModal({
          title: 'Error',
          content: '网络错误',
          showCancel: 0
        });
      }
    });
    wx.request(api);
  }
});