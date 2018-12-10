var app = getApp();
let secKillAPI = require("../../api/secKillAPI.js");
let WxParse = require("../../wxParse/wxParse.js");
var num_util = require('../../utils/num_util.js');
Page({
  data: {
    //购买数量
    num: 1,
    // 使用data数据对象设置样式名
    minusStatus: 'disabled',
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    //商品信息
    product: {},
    timeOut:'0天00:00:00'
  },
  onLoad(e){
    this.setData({tempE:e});
  },
  // 加载完成之后
  onShow: function () {
    var options=this.data.tempE;
    var that = this;
    app.globalData.getTop(that);
    console.log('onload参数', options);
    //上一个页面传来了index参数
    let pageStack = getCurrentPages();
    console.log('当前页面栈', pageStack);
    if (options['index']) {
      console.log('准备直接从上一个页面取出商品信息');
      let prevPage = pageStack[pageStack.length - 2];
      console.log('上一个页面', prevPage);
      let product = prevPage.data.productList[options['index']];
      console.log('对应的商品是', product);
      that.setData({
        product: product,
        is_start:product.is_start
      });
      //解析富文本
      WxParse.wxParse("info", "html", product.info, that);
    }else if(options['id']){
      app.GetUserInfo(function  () {
        let api = secKillAPI.getProductList;
        api.data = Object.assign(api.data, {
          openid: app.globalData.UserInfo.WeiXinOpenId,
          id: options['id']
        });
        api = Object.assign(api, {
          success: function (resp) {
            console.log('单个秒杀商品', resp);
            let product=resp.data;
            that.setData({
              product: product,
              is_start:product.is_start
            });
            //解析富文本
            WxParse.wxParse("info", "html", product.info, that);
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
      });
    }
    //设置定时器
    let interval = setInterval(function () {
      let timeOut = num_util.getTimeOut(that.data.product.start_time);
      if(!timeOut){
        clearInterval(interval);
        that.setData({
          is_start:1
        });
      }else{
        that.setData({
          timeOut:timeOut,
          is_start:0
        });
      }
    }, 1000);
    that.setData({
      interval: interval
    });
  },
  onHide: function () {
    this.clearItv();
  },
  onUnload: function () {
    this.clearItv();
  },
  //清除计时器
  clearItv: function () {
    let that = this;
    let interval = that.data.interval;
    clearInterval(interval);
  },
  bindMinus: function () {
    var num = this.data.num;
    if (num > 1) {
      num--;
    }
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  bindPlus: function () {
    var num = this.data.num;
    num++;
    var minusStatus = num < 1 ? 'disabled' : 'normal';
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  bindManual: function (e) {
    var num = e.detail.value;
    this.setData({
      num: num
    });
  },
  return_index_h: function () {
    wx.reLaunch({
      url: '/pages/index/index',
    });
  },
  // 自定义底部弹出层
  showModal1: function (e = {}) {
    let that = this;
    if(!that.data.is_start || that.data.product.num==0){
      return false;
    }
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    });
    this.animation = animation;
    animation.translateY(300).step();
    this.setData({
      animationData1: animation.export(),
      showModalStatus1: true
    });
    setTimeout(function () {
      animation.translateY(0).step();
      this.setData({
        animationData1: animation.export()
      });
    }.bind(this), 200);
  },
  //参团弹出
  hideModal1: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    });
    this.animation = animation;
    animation.translateY(300).step();
    this.setData({
      animationData1: animation.export()
    });
    setTimeout(function () {
      animation.translateY(0).step();
      this.setData({
        animationData1: animation.export(),
        showModalStatus1: false
      });
    }.bind(this), 200);
  },
  onShareAppMessage: function (e) {
    let that = this;
    let pageStack = getCurrentPages();
    console.log({
      title: that.data.product.sharename,
      path: '/' + pageStack[pageStack.length - 1].route+'?id='+that.data.product.id,
      imageUrl: that.data.product.sharepic
    });
    return {
      title: that.data.product.sharename,
      path: '/' + pageStack[pageStack.length - 1].route+'?id='+that.data.product.id,
      imageUrl: that.data.product.sharepic
    };
  },
  //去提交订单
  navigateToSubmitOrder: function () {
    wx.navigateTo({
      url: '/pages/seckillordersubmit/seckillordersubmit'
    });
  }
});