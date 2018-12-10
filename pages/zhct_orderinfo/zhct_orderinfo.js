var app = getApp();
let zhctApi = require('../../api/zhctAPI');
let myTools = require('../../utils/myTools');
let templateMethods = require("../../utils/template_methods.js");
Page(Object.assign({}, {
  data: {},
  onLoad: function (options) {
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
      orderId:options.orderId,
      seller:options.seller,
    });
    t.loadOrder();
  },
  loadOrder(){
    let t = this, td = t.data;
    let orderId=td.orderId;
    let api=zhctApi.getOrder;
    wx.showLoading({
      title:'加载中',mask:true
    });
    let dt={
      wid:api.data.wid,
      orderId:orderId,
    };
    if(td.seller==1){
      dt.is_seller=1;
    }else{
      dt.openid=app.globalData.UserInfo.WeiXinOpenId;
    }
    wx.request({
      url:api.url,
      method:api.method,
      data:dt,success(resp){
        let r=resp.data,rd=r.data;
        if(r.status=='success'){
          let cart=rd.cart;
          for(let i=0;i<cart.length;++i){
            let item=cart[i];
            item.price=myTools.toMoney(parseFloat(item.sp.price)*parseInt(item.num));
            cart[i]=item;
          }
          rd.cart=cart;
          t.setData({order:rd});
        }else{
          wx.showModal({
            title:'错误',
            content:r.msg,
            showCancel:false
          })
        }
      },fail(){
        wx.showModal({
          title:'错误',
          content:'网络错误',
          showCancel:false
        })
      },complete(){
        wx.hideLoading();
      }
    })
  },
  bind_order_send() {
    let t = this, td = t.data;
    let orderId = td.orderId;
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
              t.loadOrder();
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
}, templateMethods));