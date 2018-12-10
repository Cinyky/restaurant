var app = getApp();
let zhctApi = require('../../api/zhctAPI');
let myTools = require('../../utils/myTools');
let templateMethods = require("../../utils/template_methods.js");
Page(Object.assign({}, {
  data: {
    orderList: [],
    orderStatus: -1,//全部订单，0未确认，1已确认，2已完成
    page: 0,
    hasMore: true,
    this_group_val:-1,
    show_payMethod: false,
  },
  onLoad() {
    let t = this, td = t.data;
    this.setMenu(this);
    app.globalData.getTop();
    // 获取配色设置
    let main_color = wx.getStorageSync('zhct_main_color');
    if (!main_color) {
      wx.setStorageSync('main_color', '#fe5848');
      main_color = '#fe5848';
    }
    this.setData({
      main_color: main_color,
      editData_h: app.globalData.editData_h
    });
    let api = zhctApi.getInfo;
    wx.request({
      url: api.url,
      data: {
        wid: api.data.wid
      },
      method: 'POST',
      success(resp) {
        let rData = resp.data;
        t.setData({
          pay_wx: rData.data.pay_wx,
          pay_ye: rData.data.pay_ye
        });
      },
      
    });
    console.log(t.data)
  },
  onShow: function () {
    // 加载商品
    this.loadOrder(true);
  },
  loadOrder(reload = false) {
    let t = this, td = t.data;
    if (reload) {
      t.setData({
        page: 0,
        hasMore: true,
      });
    }
    let api = zhctApi.getOrderList;
    if (td.isLoading || !td.hasMore) {
      return false;
    }
    t.setData({isLoading: true});
    wx.showLoading({title: '加载中', mask: true});
    wx.request({
      url: api.url,
      method: api.method,
      data: {
        wid: api.data.wid,
        openid: app.globalData.UserInfo.WeiXinOpenId,
        page: td.page,
        orderStatus: td.orderStatus,
      }, success(res) {
        let r = res.data, rd = r.data;
        if (r.status == 'success') {
          if (reload) {
            // 清空当前的数据
            t.setData({
              orderList: [],
              page: 0,
              hasMore: true,
            });
          }
          // 处理新数据
          let hasMore = rd.length!= 0;
          let orderList2 = [...td.orderList, ...rd];
          let page = td.page + 1;
          t.setData({
            hasMore: hasMore,
            page: page,
            orderList: orderList2
          });
        } else {
          wx.showModal({
            title: '错误',
            content: r.msg,
            showCancel: false,
          });
        }
      }, fail() {
        wx.showModal({
          title: '错误',
          content: '加载失败',
          showCancel: false,
        });
      }, complete() {
        t.setData({isLoading: false});
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }

    });

  },
  //订单状态切换
  select_status_show: function (e) {
    let val=e.currentTarget.dataset.val;
    this.setData({
      orderStatus: val,
      this_group_val:val
    });
    this.loadOrder(true);
  },
  bind_order_cancel(e) {
    let t = this, td = t.data, ds = e.currentTarget.dataset;
    let cancelFunc = function () {
      let orderId = ds.id;
      let api = zhctApi.orderCancel;
      wx.showLoading({title: '加载中', mask: true});
      wx.request({
        url: api.url,
        method: api.method,
        data: {
          wid: api.data.wid,
          openid: app.globalData.UserInfo.WeiXinOpenId,
          orderId: orderId,
        }, success(resp) {
          let r = resp.data, rd = r.data;
          if (r.status == 'success') {
            t.loadOrder(true);
          } else {
            wx.showModal({
              title: '提示',
              content: r.msg,
              showCancel: false,
            });
          }
        }, fail() {
          wx.showModal({
            title: '提示',
            content: '网络错误',
            showCancel: false,
          });
        }, complete() {
          wx.hideLoading();
        }
      });
    };
    wx.showModal({
      title: '提示',
      content: '确认取消订单吗？',
      success(res) {
        if (res.confirm) {
          cancelFunc();
        }
      }
    });
  },
  bind_order_ok(e) {
    let t = this, td = t.data, ds = e.currentTarget.dataset;
    let orderId = ds.id;
    let api = zhctApi.orderOK;
    wx.showLoading({title: '加载中', mask: true});
    wx.request({
      url: api.url,
      method: api.method,
      data: {
        wid: api.data.wid,
        openid: app.globalData.UserInfo.WeiXinOpenId,
        orderId: orderId,
      }, success(resp) {
        let r = resp.data, rd = r.data;
        if (r.status == 'success') {
          t.loadOrder(true);
        } else {
          wx.showModal({
            title: '提示',
            content: r.msg,
            showCancel: false,
          });
        }
      }, fail() {
        wx.showModal({
          title: '提示',
          content: '网络错误',
          showCancel: false,
        });
      }, complete() {
        wx.hideLoading();
      }
    });
  },
  bind_order_pay(e) {
    let t = this, td = t.data, ds = e.currentTarget.dataset;
    console.log(ds);
    let formId = e.detail.formId;
    let orderId = ds.id;
    let api = zhctApi.orderPay;
    wx.showLoading({title: '加载中', mask: true});
    wx.request({
      url: api.url,
      method: api.method,
      data: {
        wid: api.data.wid,
        openid: app.globalData.UserInfo.WeiXinOpenId,
        orderId: orderId,
        formId: formId
      }, success(resp) {
        let r = resp.data, rd = r.data;
        if (r.status == 'success') {
          // 调起支付
          let payParams = rd;
          payParams.success = function () {
            t.loadOrder(true);
          };
          payParams.fail = function () {
            t.loadOrder(true);
          };
          wx.requestPayment(payParams);
        } else {
          wx.showModal({
            title: '提示',
            content: r.msg,
            showCancel: false,
          });
        }
      }, fail() {
        wx.showModal({
          title: '提示',
          content: '网络错误',
          showCancel: false,
        });
      }, complete() {
        wx.hideLoading();
      }
    });
  },

  //订单详情
  user_orderinfo_bind: function (e) {
    let t = this, td = t.data, ds = e.currentTarget.dataset;
    let orderId = ds.id;
    console.log(orderId);
    wx.navigateTo({
      url: '/pages/zhct_orderinfo/zhct_orderinfo?orderId=' + orderId
    });
  },
  //下拉刷新
  onPullDownRefresh: function () {
    this.loadOrder(true);
  },
  // 显示支付方式
  show_payMethod: function (e) {
    let t = this;
    let ds = e.currentTarget.dataset;
    t.setData({
      orderid_h: ds.id,
      show_payMethod: true
    })
    console.log(t.data);
  },
  hide_payMethod: function () {
    let t = this;
    t.setData({
      show_payMethod: false
    })
  },
  // 余额支付
  payMethod_Submit: function (e) {
    let t = this, td = t.data;
    // 收集提交订单所需的参数
    let orderid_h = e.currentTarget.dataset.id;
    console.log(orderid_h);
    wx.navigateTo({
      url: "/pages/payment/payment?type=zhct&orderid=" + orderid_h
    });
  },


  //评价
  order_go_comment_bind: function (e) {
    var ord_id = e.currentTarget.dataset.id;
    console.log(ord_id);
    wx.navigateTo({
      url: '/pages/zhct_order_comment/zhct_order_comment?orderId=' + ord_id
    });
  },
  onReachBottom(){
    this.loadOrder();
  }
}, templateMethods));