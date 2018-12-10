var app = getApp(),
  $ = require("../../utils/util.js"),
  secKillAPI = require("../../api/secKillAPI.js"),
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
    let prevData = prevPage.data;
    let product = prevData.product;
    //获取单价
    let perPrice = prevData.product.price;
    //商品总价格
    let totalPrice = parseFloat(perPrice) * parseInt(prevData.num);
    //带运费价格
    let allPrice = parseFloat(totalPrice) + parseFloat(product.trans_price);
    that.setData({
      prevData: prevData,
      product: product,
      perPrice: perPrice,
      num: prevData.num,
      totalPrice: totalPrice,
      allPrice: allPrice
    });

  },
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
  submitOrder: function () {
    let that = this;
    console.log(that.data);
    if (!that.data.FullAddress) {
      that.selectAddress();
      return false;
    }
    let api = secKillAPI.submitOrder;
    //整理订单数据
    api.data = Object.assign(api.data, {
      openid: app.globalData.UserInfo.WeiXinOpenId,
      //订单参数
      productId: that.data.product.id,//商品id
      productNum: that.data.num,//商品数量
      type: that.data.prevData.type,//购买方式
      remark: that.data.remark,//备注
      receiver: that.data.receiver,//收件人
      phone: that.data.phone,//手机号
      address: that.data.FullAddress,//收货地址
      groupId: that.data.prevData.joinGroupId,
    });
    //设置回调
    api = Object.assign({},api, {
      success: function (resp) {
        let data = resp.data;
        //缺少参数的时候
        if (data == []) {
          return false;
        }//库存不足的时候
        if (data.status == 'error') {
          wx.showModal({
            title: 'Error',
            content: data.msg,
            showCancel: 0
          });
          return false;
        }
        let payObj = data.payObj;
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
                  url: '/pages/seckill/seckill?index=1'
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
        // wx.showActionSheet({
        //   itemList: ['微信支付', '余额支付'],
        //   success: function (act) {
        //     console.log(act.tapIndex);
        //     if (act.tapIndex == 0) {
        //       let payObj = data.payObj;
        //       payObj.success = function (resp2) {
        //         wx.showModal({
        //           title: '成功',
        //           content: '支付成功',
        //           showCancel: 0,
        //           success: function (res) {
        //             if (res.confirm) {
        //               console.log('用户点击确定');
        //               //跳转到订单详情页面
        //               wx.redirectTo({
        //                 url: '/pages/seckill/seckill?index=1'
        //               });
        //             }
        //           }
        //         });
        //       };
        //       payObj.fail = function (resp2) {
        //         console.log('支付方法调用失败,错误信息如下');
        //         console.log(resp2);
        //       };
        //       wx.requestPayment(payObj);
        //     } else if (act.tapIndex == 1) {
        //       // 设置支付后跳转链接
        //       wx.setStorageSync('vip_pay_redirect', `/pages/seckill/seckill?index=1`);
        //       wx.navigateTo({
        //         url: `/pages/payment/payment?type=seckill&orderid=${resp.data.order.id}`
        //       });
        //     }
        //   },
        //   fail: function (act) {
        //     console.log(act.errMsg);
        //   }
        // });
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