let app = getApp(), $ = require("../../utils/util.js"), groupByAPI = require("../../api/groupBuyAPI.js");
var templateMethods = require("../../utils/template_methods.js");
var qiyeapi = require("../../api/supercard.js");
let cf2 = require("../../config.js");
Page(Object.assign({}, templateMethods, {
  data: {
    qrcode_bg: false,
  },
  onLoad: function (options) {
    this.setMenu(this);
    this.setData({tempE:options});
  },
  onShow(){
    let that = this;
    let options=that.data.tempE;
    app.GetUserInfo(function () {
      app.globalData.getTop();
      if (options['index'] == 1) {
        that.orderList();
      } else {
        //切换到商品列表标签
        that.productList();
      }
    });
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
        type:'groupBy',
        content:'拼团商品',
      }, qiyeapi.sendQiYeMessage.data),
      method: 'POST',
      success: res => {
        if (res.data.status) {
          console.log('日志发送成功!');
        } else {
          console.log('日志发送失败!');
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
    let api = groupByAPI.getProductList;
    api.data = Object.assign(api.data, {
      openid: app.globalData.UserInfo.WeiXinOpenId,
      page: that.data.page
    });
    api = Object.assign(api, {
      success: function (resp) {
        console.log('商品列表', resp);
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
      url: '/pages/groupbuydetail/groupbuydetail?id=' + id + '&index=' + index
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
    let api = groupByAPI.getOrderList;
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
  show_qrcode: function(e){
    let t = this;
    let qr_data = e.currentTarget.dataset.code;
    let qrurl_h = cf2.config.configUrl + "seller/qrcode.html?data=" + qr_data;
    t.setData({
      qrcode_bg: true,
      qrcode_url: qrurl_h
    });
    console.log(qrurl_h);
  },
  hide_qrcode:function(){
    let t = this;
    t.setData({
      qrcode_bg: false
    });
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
          let api = groupByAPI.receive;
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
  }
}));