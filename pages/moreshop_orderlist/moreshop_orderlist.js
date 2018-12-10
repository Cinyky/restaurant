let app             = getApp(), $ = require("../../utils/util.js"), moreshopApi = require("../../api/moreshopApi.js");
var templateMethods = require("../../utils/template_methods.js");
var num_util        = require('../../utils/num_util.js');
let WxParse         = require("../../wxParse/wxParse.js");
Page(Object.assign({}, templateMethods, {
  data       : {
    is_refund_text: '申请退款',
    commentFlag:1
  },
  onLoad     : function (options) {
    // this.setMenu(this);
    app.globalData.getTop();
    let that = this;
    console.log(options);
    that.setData({
      shopid: options.shopid
    });
    //获取订单列表
    that.loadOrder();
  },
  //获取订单列表
  loadOrder  : function () {
    let that = this;
    let api  = moreshopApi.getOrderList;
    api.data = Object.assign(api.data, {
      wid   : api.data.wid,
      openid: app.globalData.UserInfo.WeiXinOpenId,
      shopid: that.data.shopid,
      page  : that.data.page
    });
    api      = Object.assign(api, {
      success: function (resp) {
        // let orderList = that.data.orderList;
        // orderList = orderList.concat(resp.data);
        let orderList = resp.data.data;
        console.log('订单列表', orderList);
        // let hasMore = resp.data.length != 0;
        that.setData({
          orderList: orderList
          // hasMore: hasMore,
          // page: that.data.page + 1
        });
      },
      error  : function () {
        wx.showModal({
          title     : 'Error',
          content   : '加载失败',
          showCancel: 0
        });
      }
    });
    wx.request(api);
  },
  receive    : function (e) {
    let that = this;
    wx.showModal({
      title  : '确认',
      content: '确定要确认收货吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');
          let orderId      = e.currentTarget.dataset.orderId;
          let orderIndex   = e.currentTarget.dataset.orderIndex;
          let api          = moreshopApi.receive;
          api.data.orderId = orderId;
          api.success      = function (resp) {
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
      title  : '确认',
      content: '确定要申请退款吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');
          let orderId      = e.currentTarget.dataset.orderId;
          // let orderIndex   = e.currentTarget.dataset.orderIndex;
          let api          = moreshopApi.refundMoney;
          api.data.orderId = orderId;
          api.success      = function (resp) {
            wx.showToast({
              title   : '申请成功',
              icon    : 'success',
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
  //发起付款
  bindPay    : function (e) {
    let orderId = e.currentTarget.dataset.orderId;
    console.log(orderId);
    let api  = moreshopApi.subOrder;
    //整理订单数据
    api.data = Object.assign(api.data, {
      wid    : api.data.wid,
      openid : app.globalData.UserInfo.WeiXinOpenId,
      //订单参数
      // goodsid: that.data.product.id,//商品id
      // shopid: that.data.product.shopid,//商店id
      // remark: that.data.remark,//备注
      // receiver: that.data.receiver,//收件人
      // phone: that.data.phone,//手机号
      // address: that.data.FullAddress,//收货地址
      orderid: orderId//订单id
      // allPrice:that.data.allPrice,//总费用
    });
    //设置回调
    api      = Object.assign(api, {
      success: function (resp) {
        console.log(resp);
        // 进行支付方式的选择
        wx.showActionSheet({
          itemList: ['微信支付'],
          success : function (res) {
            console.log(res.tapIndex);
            if (res.tapIndex == 0) {
              // 微信支付
              let payObj = resp.data.payObj;
              if (payObj.package) {
                payObj.success = function (resp2) {
                  wx.showModal({
                    title     : '成功',
                    content   : '支付成功',
                    showCancel: 0,
                    success   : function (res) {
                      if (res.confirm) {
                        console.log(res);
                        //跳转到订单详情页面
                        wx.redirectTo({
                          url: '/pages/moreshop_orderlist/moreshop_orderlist?shopid=' + that.data.product.shopid
                        });
                      }
                    }
                  });
                };
                payObj.fail    = function (resp2) {
                  console.log('支付方法调用失败,错误信息如下');
                  console.log(resp2);
                };
                wx.requestPayment(payObj);
              }
            }
          },
          fail    : function (res) {
            console.log(res.errMsg);
          }
        });
      },
      error  : function () {
        wx.showModal({
          title     : 'Error',
          content   : '网络错误',
          showCancel: 0
        });
      }
    });
    wx.request(api);
  },
  // 关闭遮罩层
  closePopView:function(){
    this.setData({
      flag:0
    })
  },
  //点击打开评论
  openComment:function (e) {
    console.log(e.currentTarget.dataset.orderId);
    this.setData({
      flag:1,
      commentOrderId:e.currentTarget.dataset.orderId
    })
  },
  //评论不关闭
  bindcomment: function (e) {
    // console.log(e);
  },
  //输入评论
  bindTextAreaBlur: function (e) {
    console.log(e.detail.value);
    this.setData({
      commentContent:e.detail.value
    })
  },
  subComment: function () {
    let t = this;
    console.log('评论内容',this.data.commentContent);
    console.log('订单号',this.data.commentOrderId);
    let api = moreshopApi.subComment;
    wx.request({
      url:api.url,
      data:{
        wid:api.data.wid,
        openid:app.globalData.UserInfo.WeiXinOpenId,
        orderid:this.data.commentOrderId,
        comment:this.data.commentContent
      },
      method:"POST",
      success:function (e) {
        if (e.data.status == 'success'){
          wx.showModal({
            title  : '成功',
            content: e.data.msg,
            showCancel: 0,
            success: function () {
              t.setData({
                commentFlag:0
              })
            }
          });
        }else{
          wx.showModal({
            title  : '失败',
            content: e.data.msg,
            showCancel: 0
          });
        }
      }
    })
  }
}));