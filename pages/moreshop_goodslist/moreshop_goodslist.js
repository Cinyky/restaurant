let app = getApp(), $ = require("../../utils/util.js"), moreshopApi = require("../../api/moreshopApi.js");
var templateMethods = require("../../utils/template_methods.js");
let WxParse = require("../../wxParse/wxParse.js");
let moreshop_common = require('../../utils/moreshop_common');
Page(Object.assign({},{
  data: {
    // is_refund_text:'申请退款',
    shopid:''
  },
  onLoad: function (options) {
    app.globalData.getTop();
    let that = this;
    let shopid = options.shopid;
    that.setData({
      shopid:shopid
    });
    if(options['index']==1){
      that.comment();
    }else{
      //切换到商品列表标签
      that.productList();
    }
  },
  //清除data
  // cleanData: function () {
  //   let that = this;
  //   for (let attr in that.data) {
  //     if (that.data.hasOwnProperty(attr) && attr != '__webviewId__') {
  //       that.data[attr] = undefined;
  //     }
  //   }
  //   that.setData(that.data);
  // },
  //商品列表点击事件
  productList: function () {
    let that = this;
    //切换标签
    //重置页面数据
    // that.cleanData();
    that.setData({
      tabIndex: 0,
      page: 1,
      hasMore: 1,
      productList: []
    });
    //获取商品列表
    that.loadProduct(that.data.shopid);
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
      url: '/pages/moreshop_gdetail/moreshop_gdetail?id=' + id + '&index=' + index
    });
  },
  //切换标签页之评论列表
  comment: function () {
    let that = this;
    //切换标签
    //重置页面数据
    // that.cleanData();
    that.setData({
      tabIndex: 1,
      page: 1,
      hasMore: 1,
      comment: []
    });
    //获取评论
    // that.loadOrder();
  },
  // loadOrder: function () {
  //   let that = this;
  //   let api = moreshopApi.getcomment;
  //   api.data = Object.assign(api.data, {
  //     openid: app.globalData.UserInfo.WeiXinOpenId,
  //     page: that.data.page
  //   });
  //   api = Object.assign(api, {
  //     success: function (resp) {
  //       // let comment = that.data.comment;
  //       // comment = comment.concat(resp.data);
  //       let comment = resp.data.data;
  //       console.log('订单列表', comment);
  //       // let hasMore = resp.data.length != 0;
  //       that.setData({
  //         comment: comment,
  //         // hasMore: hasMore,
  //         // page: that.data.page + 1
  //       });
  //     },
  //     error: function () {
  //       wx.showModal({
  //         title: 'Error',
  //         content: '加载失败',
  //         showCancel: 0
  //       });
  //     }
  //   });
  //   wx.request(api);
  // },
  // 收货
  // receive: function (e) {
  //   let that = this;
  //   wx.showModal({
  //     title: '确认',
  //     content: '确定要确认收货吗？',
  //     success: function (res) {
  //       if (res.confirm) {
  //         console.log('用户点击确定');
  //       let orderId = e.currentTarget.dataset.orderId;
  //       let orderIndex = e.currentTarget.dataset.orderIndex;
  //       let api = moreshopApi.receive;
  //       api.data.orderId = orderId;
  //       api.success = function (resp) {
  //         let data = resp.data;
  //         if (data.is_receive == 1) {
  //           that.data.comment[orderIndex]['order']['status'][0] = 3;
  //           that.data.comment[orderIndex]['order']['status'][1] = '已收货';
  //           that.setData({
  //             comment: that.data.comment
  //           });
  //         }
  //       };
  //       wx.request(api);
  //       }
  //     }
  //   });
  // },
  // 申请退款
  // refundMoney: function (e) {
  //   let that = this;
  //   wx.showModal({
  //     title: '确认',
  //     content: '确定要申请退款吗？',
  //     success: function(res) {
  //       if (res.confirm) {
  //         console.log('用户点击确定');
  //         let orderId = e.currentTarget.dataset.orderId;
  //         let orderIndex = e.currentTarget.dataset.orderIndex;
  //         let api = moreshopApi.refundMoney;
  //         api.data.orderId = orderId;
  //         api.success = function (resp) {
  //           wx.showToast({
  //             title: '申请成功',
  //             icon: 'success',
  //             duration: 2000
  //           });
  //           let data = resp.data;
  //           console.log(data);
  //         };
  //         wx.request(api);
  //       }
  //     }
  //   })
  // },
},templateMethods,moreshop_common));