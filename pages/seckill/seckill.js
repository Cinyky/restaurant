let app = getApp(), $ = require("../../utils/util.js");
let secKillAPI = require("../../api/secKillAPI.js");
var templateMethods = require("../../utils/template_methods.js");
let cf2 = require("../../config.js");
let qiyeapi = require("../../api/supercard.js");
Page(Object.assign({}, templateMethods, {
  data: {
    qrcode_bg: false,
  },
  onLoad: function (options) {
    this.setMenu(this);
    app.globalData.getTop();
    let that = this;
    if (options['index'] == 1) {
      that.orderList();
    } else {
      //切换到商品列表标签
      that.productList();
    }

    //发送企业微信提示
    console.log('发送企业微信提示');
    that.sendQiYeMessage();
    that.saveEvent(2);
  },


  //发送企业微信通知
  sendQiYeMessage:function(){
    wx.request({
      url: qiyeapi.sendQiYeMessage.url,
      data: Object.assign({}, {
        userInfo: app.globalData.UserInfo,
        type:'seckill',
        content:'秒杀商品',
      }, qiyeapi.sendQiYeMessage.data),
      method: 'POST',
      success: res => {
        if (res.data.status) {
          console.log('日志发送成功!');
        } else {
          wx.showModal({
            title: '出错啦',
            content: '啊哈哈哈1哈',
            showCancel: false
          })
        }
      }
    })
  },

  saveEvent:function(eventId){
    wx.request({
      url: qiyeapi.saveCardEvent.url,
      data: Object.assign({}, {
        open_id: app.globalData.UserInfo.WeiXinOpenId,
        event_id: eventId,
      }, qiyeapi.saveCardEvent.data),
      method: 'POST',
      success: res => {
        if (res.data.success) {
          console.log(res.data.msg);
        } else {
          console.log(res.data.msg);
        }
      }
    })
  },

  //清除data
  cleanData: function () {
    let that = this;
    for (let attr in that.data) {
      if (that.data.hasOwnProperty(attr) && attr != '__webviewId__') {
        that.data[attr] = undefined;
      }
    }
    that.setData(that.data);
  },
  // onShareAppMessage: function () {
  //   return {
  //     title: app.globalData.VendorInfo.ShopName+'秒杀活动',
  //     desc: app.globalData.VendorInfo.VendorInfo+'秒杀活动',
  //     path: "/pages/seckill/seckill"
  //   };
  // },
  //商品列表点击事件
  productList: function () {
    let that = this;
    //切换标签
    //重置页面数据
    that.cleanData();
    that.setData({
      tabIndex: 0,
      page: 1,
      hasMore: 1,
      productList: []
    });
    //获取商品列表
    that.loadProduct();
  },
  loadProduct: function () {
    let that = this;
    let api = secKillAPI.getProductList;
    api.data = Object.assign(api.data, {
      openid: app.globalData.UserInfo.WeiXinOpenId,
      page: that.data.page
    });
    api = Object.assign(api, {
      success: function (resp) {
        console.log('秒杀列表', resp);
        let productList = that.data.productList;
        productList = productList.concat(resp.data);
        let hasMore = resp.data.length != 0;
        that.setData({
          productList: productList,
          hasMore: hasMore,
          page: that.data.page + 1
        });
      },
      error: function () {
        wx.showModal({
          title: 'Error',
          content: '加载失败',
          showCancel: 0
        });
      }
    });
    wx.request(api);
  },
  scrollbottom: function () {
    let that = this;
    //加载商品列表
    if (that.data.tabIndex == 0 && that.data.hasMore) {
      console.log('加载下一页商品');
      that.loadProduct();
    } else if (that.data.tabIndex == 1 && that.data.hasMore) {
      console.log('加载下一页商品');
      that.loadOrder();
    }
  },
  /**
   * 跳到商品详情页面
   */
  goToDetail: function (e) {
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    console.log('按钮的点击事件', e);
    console.log('点击的商品id是', id);
    wx.navigateTo({
      url: '/pages/seckilldetail/seckilldetail?id=' + id + '&index=' + index
    });
  },
  //切换标签页之订单列表
  orderList: function () {
    let that = this;
    //切换标签
    //重置页面数据
    that.cleanData();
    that.setData({
      tabIndex: 1,
      page: 1,
      hasMore: 1,
      orderList: []
    });
    //获取订单列表
    that.loadOrder();
  },
  loadOrder: function () {
    let that = this;
    let api = secKillAPI.getOrderList;
    api.data = Object.assign(api.data, {
      openid: app.globalData.UserInfo.WeiXinOpenId,
      page: that.data.page
    });
    api = Object.assign(api, {
      success: function (resp) {
        console.log('订单列表', resp);
        let orderList = that.data.orderList;
        orderList = orderList.concat(resp.data);
        let hasMore = resp.data.length != 0;
        that.setData({
          orderList: orderList,
          hasMore: hasMore,
          page: that.data.page + 1
        });
      },
      error: function () {
        wx.showModal({
          title: 'Error',
          content: '加载失败',
          showCancel: 0
        });
      }
    });
    wx.request(api);
  },
  receive: function (e) {
    let that = this;
    wx.showModal({
      title: '确认',
      content: '确定要确认收货吗？',
      success: function (confirm) {
        if (confirm.confirm) {
          let orderId = e.currentTarget.dataset.orderId;
          let orderIndex = e.currentTarget.dataset.orderIndex;
          let api = secKillAPI.receive;
          api.data.orderId = orderId;
          api.success = function (resp) {
            let data = resp.data;
            if (data.is_receive == 1) {
              that.data.orderList[orderIndex]['status'][0] = 3;
              that.data.orderList[orderIndex]['status'][1] = '已收货';
              that.setData({
                orderList: that.data.orderList
              });
            }
          };
          wx.request(api);
        }
      }
    });
  },
  show_qrcode: function (e) {
    let t = this;
    let qr_data = e.currentTarget.dataset.code;
    let qrurl_h = cf2.config.configUrl + "seller/qrcode.html?data=" + qr_data;
    t.setData({
      qrcode_bg: true,
      qrcode_url: qrurl_h
    });
    console.log(qrurl_h);
  },
  hide_qrcode: function () {
    let t = this;
    t.setData({
      qrcode_bg: false
    });
  },
  //未支付的订单发起支付
  payOrder: function (e) {
    let orderId = e.currentTarget.dataset.orderId;
    let api = secKillAPI.payOrder;
    api.data.orderId = orderId;
    api.data.openid = app.globalData.UserInfo.WeiXinOpenId;
    api.success = function (resp) {
      let payObj = resp.data;
      //有支付参数，发起支付
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
      }
    };
    wx.request(api);
    // wx.showActionSheet({
    //   itemList: ['微信支付', '余额支付'],
    //   success: function (res) {
    //     console.log(res.tapIndex);
    //     if (res.tapIndex == 0) {
    //       let api = secKillAPI.payOrder;
    //       api.data.orderId = orderId;
    //       api.data.openid = app.globalData.UserInfo.WeiXinOpenId;
    //       api.success = function (resp) {
    //         let payObj = resp.data;
    //         //有支付参数，发起支付
    //         if (payObj.package) {
    //           payObj.success = function (resp2) {
    //             wx.showModal({
    //               title: '成功',
    //               content: '支付成功',
    //               showCancel: 0,
    //               success: function (res) {
    //                 if (res.confirm) {
    //                   console.log('用户点击确定');
    //                   //跳转到订单详情页面
    //                   wx.redirectTo({
    //                     url: '/pages/seckill/seckill?index=1'
    //                   });
    //                 }
    //               }
    //             });
    //           };
    //           payObj.fail = function (resp2) {
    //             console.log('支付方法调用失败,错误信息如下');
    //             console.log(resp2);
    //           };
    //           wx.requestPayment(payObj);
    //         }
    //       };
    //       wx.request(api);
    //     } else if (res.tapIndex == 1) {
    //       //设置跳转链接
    //       wx.setStorageSync('vip_pay_redirect', '/pages/seckill/seckill?index=1');
    //       wx.navigateTo({
    //         url: `/pages/payment/payment?type=seckill&orderid=${orderId}`
    //       });
    //     }
    //   },
    //   fail: function (res) {
    //     console.log(res.errMsg);
    //   }
    // });
  },
  cancelOrder: function (e) {
    let that = this;
    wx.showModal({
      title: '确认',
      content: '确定取消订单吗？',
      success: function (confirm) {
        if (confirm.confirm) {
          let orderId = e.currentTarget.dataset.orderId;
          let api = secKillAPI.cancelOrder;
          api.data.openid = app.globalData.UserInfo.WeiXinOpenId;
          api.data.orderId = orderId;
          api.success = function (resp) {
            that.orderList();
          };
          wx.request(api);
        }
      }
    });
  }
}));