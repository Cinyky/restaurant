var app = getApp();
let zhctApi = require('../../api/zhctAPI');
let myTools = require('../../utils/myTools');
let templateMethods = require("../../utils/template_methods.js");
Page(Object.assign({}, {
  data: {
    orderList: [],
    orderStatus: -1,//-1全部订单，0dc，1wm
    page: 0,
    hasMore: true,
    this_group_val: -1,
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
  },
  onShow: function () {
    console.log(this.data);
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
    let api = zhctApi.sellerGetOrderList;
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
          let hasMore = rd.length != 0;
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
    let val = e.currentTarget.dataset.val;
    this.setData({
      orderStatus: val,
      this_group_val: val
    });
    this.loadOrder(true);
  },
  bind_order_send(e) {
    let t = this, td = t.data, ds = e.currentTarget.dataset;
    let orderId = ds.id;
    let api = zhctApi.sellerOrderSend;
    wx.showLoading({title: '加载中', mask: true});
    wx.request({
      url: api.url,
      method: api.method,
      data: {
        wid: api.data.wid,
        orderId: orderId,
      }, success(resp) {
        let r = resp.data, rd = r.data;
        if (r.status == 'success') {
          wx.showModal({
            title: '提示',
            content: r.msg,
            showCancel: false,
            success() {
              t.loadOrder(true);
            }
          });
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
      url: '/pages/zhct_orderinfo/zhct_orderinfo?orderId=' + orderId + '&seller=1'
    });
  },
  //下拉刷新
  onPullDownRefresh: function () {
    this.loadOrder(true);
  },
  onReachBottom() {
    this.loadOrder();
  }
}, templateMethods));