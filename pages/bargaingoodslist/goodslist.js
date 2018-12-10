let app = getApp(), $ = require("../../utils/util.js"), bargainAPI = require("../../api/bargainAPI.js");
var templateMethods = require("../../utils/template_methods.js");
var num_util = require('../../utils/num_util.js');
let WxParse = require("../../wxParse/wxParse.js");
let cf2 = require("../../config.js");
var qiyeapi = require("../../api/supercard.js");
Page(Object.assign({},templateMethods,{
  data: {
    is_refund_text:'申请退款',
    qrcode_bg: false,
  },
  onLoad: function (options) {
    this.setMenu(this);
    app.globalData.getTop();
    let that = this;
    if(options['index']==1){
      that.orderList();
    }else{
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
        type:'bargin',
        content:'砍价商品',
      }, qiyeapi.sendQiYeMessage.data),
      method: 'POST',
      success: res => {
        if (res.data.status) {
          console.log('日志发送成功!');
        } else {
          wx.showModal({
            title: '出错啦',
            content: '日志发送失败',
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
    let api = bargainAPI.getProductList;
    api.data = Object.assign(api.data, {
      openid: app.globalData.UserInfo.WeiXinOpenId,
      page: that.data.page
    });
    api = Object.assign(api, {
      success: function (resp) {
        console.log('商品列表', resp);
        let productList = resp.data;
        
        for(let i=0;i<productList.length;i++){
          //获取剩余时间，判断商品活动是否已结束
          let endtime = parseInt(productList[i]['goods_date_e']);
          let now = Date.parse(new Date()) / 1000;
          let seconds = endtime - now;
          if(seconds < 0){
            productList[i]['end'] = 0;
          }else{
            productList[i]['end'] = 1;
          }
        }
        that.setData({
          productList: productList,
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
  //跳转到砍价具体页面
  tobargainurl:function (e) {
    let orderid = e.currentTarget.dataset.orderId;
    wx.navigateTo({
      url:'/pages/bargainshare/bargainshare?orderid='+orderid
    });
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
      url: '/pages/bargaindetail/bargaindetail?id=' + id + '&index=' + index
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
    let api = bargainAPI.getOrderList;
    api.data = Object.assign(api.data, {
      openid: app.globalData.UserInfo.WeiXinOpenId,
      page: that.data.page
    });
    api = Object.assign(api, {
      success: function (resp) {
        // let orderList = that.data.orderList;
        // orderList = orderList.concat(resp.data);
        let orderList = resp.data.data;
        console.log('订单列表', orderList);
        // let hasMore = resp.data.length != 0;
        that.setData({
          orderList: orderList,
          // hasMore: hasMore,
          // page: that.data.page + 1
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
  receive: function (e) {
    let that = this;
    wx.showModal({
      title: '确认',
      content: '确定要确认收货吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');
        let orderId = e.currentTarget.dataset.orderId;
        let orderIndex = e.currentTarget.dataset.orderIndex;
        let api = bargainAPI.receive;
        api.data.orderId = orderId;
        api.success = function (resp) {
          let data = resp.data;
          if (data.is_receive == 1) {
            that.data.orderList[orderIndex]['order']['status'][0] = 3;
            that.data.orderList[orderIndex]['order']['status'][1] = '已收货';
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
  refundMoney: function (e) {
    let that = this;
    wx.showModal({
      title: '确认',
      content: '确定要申请退款吗？',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定');
          let orderId = e.currentTarget.dataset.orderId;
          let orderIndex = e.currentTarget.dataset.orderIndex;
          let api = bargainAPI.refundMoney;
          api.data.orderId = orderId;
          api.success = function (resp) {
            wx.showToast({
              title: '申请成功',
              icon: 'success',
              duration: 2000
            });
            let data = resp.data;
            console.log(data);
          };
          wx.request(api);
        }
      }
    })
  },
}));