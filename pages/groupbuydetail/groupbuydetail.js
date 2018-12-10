var app = getApp();
let groupByAPI = require("../../api/groupBuyAPI.js");
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
    // 是否隐藏页面拼团模块
    hideTuan: true,
    //商品信息
    product: {},
    groupList: [],
    joinGroupId: 0,
  },

  // 加载完成之后
  onLoad: function (options) {
    var that = this;
    app.globalData.getTop(that);
    console.log('onload参数', options);
    that.setData({options: options});
    //上一个页面传来了index参数
    // let pageStack = getCurrentPages();
    // console.log('当前页面栈', pageStack);
    // if (options['index']) {
    //   console.log('准备直接从上一个页面取出商品信息');
    //   let prevPage = pageStack[pageStack.length - 2];
    //   console.log('上一个页面', prevPage);
    //   let product = prevPage.data.productList[options['index']];
    //   console.log('对应的商品是', product);
    //   that.setData({
    //     product: product
    //   });
    //   //解析富文本
    //   WxParse.wxParse("info", "html", product.info, that);
    // }else if(options.id){
    // }
    // 获取转发设置
    // let api = groupByAPI.getShareInfo;
    // api = Object.assign(api, {
    //   success: function (resp) {
    //     that.setData({
    //       shareInfo: {
    //         title: resp.data.name,
    //         path: '/' + pageStack[pageStack.length - 1].route,
    //         imageUrl: resp.data.pic
    //       }
    //     });
    //   }
    // });
    // wx.request(api);
  },
  onShow: function () {
    let that = this;
    app.GetUserInfo(function () {
      app.globalData.getTop();
      let api = groupByAPI.getProduct;
      wx.request({
        url: api.url,
        method: api.method,
        data: {
          wid: api.data.wid,
          id: that.data.options.id,
        }, success(resp) {
          let product = resp.data;
          console.log(product);
          that.setData({
            product: product
          });
          //解析富文本
          WxParse.wxParse("info", "html", product.info, that);
          let api = groupByAPI.getGroupList;
          wx.request({
            url: api.url,
            method: api.method,
            data: {
              wid: api.data.wid,
              product_id: that.data.product['id']
            },
            success: function (resp) {
              console.log('获取到的group列表', resp.data);
              if (resp.status == 'error') {
                wx.showModal({title: '错误', content: '参数错误'});
                return false;
              }
              that.setData({
                groupList: resp.data
              });
              //计算剩余时间
              for (let i = 0; i < that.data.groupList.length; i++) {
                let curr_group = that.data.groupList[i];
                let now = Date.parse(new Date()) / 1000;
                let seconds = curr_group['end_time'] - now;
                let result = {
                  day: parseInt(seconds / 86400),
                  hour: parseInt((seconds % 86400) / 3600),
                  minute: parseInt((seconds % 3600) / 60),
                  second: parseInt(seconds % 60)
                };
                that.data.groupList[i]['timeout'] = num_util.getTimeOut(curr_group['end_time']);
              }
              that.setData({
                groupList: that.data.groupList
              });
            },
            fail: function () {
              console.log('获取当前团购表出错');
            }
          });
        }
      });
    });
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

  // 自定义底部弹出层
  showModal1: function (e = {}) {
    let type = e.currentTarget.dataset.type;
    let that = this;
    that.setData({
      type: type,
      joinGroupId: 0
    });
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
  showModal2: function (joinGroupId) {
    let that = this;
    let type = 'group';
    that.setData({
      type: type,
      joinGroupId: joinGroupId
    });
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
    return {
      title: that.data.product.sharename,
      path: '/pages/groupbuydetail/groupbuydetail?id=' + that.data.product.id,
      imageUrl: that.data.product.sharepic
    };
  },
  //去参团
  joinGroup: function (e) {
    let that = this;
    let groupId = e.currentTarget.dataset.groupId;
    console.log('要加入的团：', groupId);
    that.showModal2(groupId);
  },
  //去提交订单
  navigateToSubmitOrder: function () {
    wx.navigateTo({
      url: '/pages/groupbuyordersubmit/groupbuyordersubmit'
    });
  }
});