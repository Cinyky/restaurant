var app = getApp(),
  $ = require("../../utils/util.js"),
  orderapi = require("../../api/orderAPI.js"),
  sellerApi = require("../../api/sellerAPI.js");
Page({
  data: {
    OrderInfo: {},
    formId: "",
    isdata: !1,
    activities: '未知'
  },
  onLoad:function(e) {
    console.log(e);
    let t = this;
    app.globalData.getTop(t);
    let e_data = e.orderid.split('_');
    t.setData({
      activitiesType: e_data[0],
      orderId: e_data[1],
    });
    console.log(e_data[1]);
    if(e_data[0] == 1){
      console.log('拼团');
      let api = sellerApi.ptdetail;
      wx.request({
        url: api.url,
        data: {
          wid: api.data.wid,
          orderid: e_data[1],
        },
        method: 'POST',
        success(resp) {
          console.log(resp);
          let rData_1 = resp.data;
          console.log(rData_1.dataList);
          t.setData({
            dataList: rData_1.dataList,
            activities: '拼团'
          });
          console.log(t.data);
        },
        fail() {
          wx.showToast({
            title: '网络错误',
            mask: 1,
          });
        }
      });
    }
    if (e_data[0] == 2){
      console.log('砍价');
      let api = sellerApi.kjdetail;
      wx.request({
        url: api.url,
        data: {
          wid: api.data.wid,
          orderid: e_data[1],
        },
        method: 'POST',
        success(resp) {
          console.log(resp);
          let rData_2 = resp.data;
          console.log(rData_2.dataList);
          t.setData({
            dataList: rData_2.dataList,
            activities: '砍价'
          });
          console.log(t.data);
        },
        fail() {
          wx.showToast({
            title: '网络错误',
            mask: 1,
          });
        }
      });
    }
    if (e_data[0] == 3) {
      console.log('秒杀');
      let api = sellerApi.msdetail;
      wx.request({
        url: api.url,
        data: {
          wid: api.data.wid,
          orderid: e_data[1],
        },
        method: 'POST',
        success(resp) {
          console.log(resp);
          let rData_3 = resp.data;
          console.log(rData_3.dataList);
          t.setData({
            dataList: rData_3.dataList,
            activities: '秒杀'
          });
          console.log(t.data);
        },
        fail() {
          wx.showToast({
            title: '网络错误',
            mask: 1,
          });
        }
      });
    }
    // this.setData({
    //   tempE: e
    // })
  },
  onShow: function() {
    // var e = this.data.tempE;
    app.globalData.getTop();
    // 检查是否已登录
    // if (wx.getStorageSync('seller_login_flag') == '') {
    //   wx.redirectTo({
    //     url: '/pages/sellerlogin/sellerlogin'
    //   });
    // }
    // var t = this;
    // $.isNull(app.globalData.UserInfo) ? app.GetUserInfo(function() {
    //   t.InitPage(e);
    // }, e.uid) : t.InitPage(e);
  },
  InitPage: function(e) {
    var t = {
        orderid: e.orderid
      },
      n = this;
    let reqObj = sellerApi.getOrderByOrderId;
    reqObj.data = Object.assign({}, reqObj.data, t);
    reqObj.success = function(resp) {
      let e = resp.data;
      if (e.errcode == 0) {
        n.setData({
          OrderInfo: e.dataList,
          isdata: !0
        });
      } else {
        n.setData({
          isdata: !1
        });
      }
    };
    wx.request(reqObj);
  },
  confirm_qrcode: function(){
    let t = this;
    console.log(t.data.orderId);
    console.log(t.data);
    wx.showModal({
      title: '扫码提示',
      content: '确定要核销该订单？',
      success: function (res) {
        if (res.confirm) {
          console.log()
          if (t.data.activitiesType == 1) {
            console.log('拼团');
            let api = sellerApi.ptdetail;
            wx.request({
              url: api.url,
              data: {
                hx: 1,
                wid: api.data.wid,
                orderid: t.data.orderId,
              },
              method: 'POST',
              success(resp) {
                console.log(resp);
                wx.showToast({
                  title: resp.data.errmsg,
                  mask: 1,
                });
              },
              fail() {
                wx.showToast({
                  title: '网络错误',
                  mask: 1,
                });
              }
            });
          }
          if (t.data.activitiesType == 2) {
            console.log('砍价');
            let api = sellerApi.kjdetail;
            wx.request({
              url: api.url,
              data: {
                hx: 1,
                wid: api.data.wid,
                orderid: t.data.orderId,
              },
              method: 'POST',
              success(resp) {
                console.log(resp);
                wx.showToast({
                  title: resp.data.errmsg,
                  mask: 1,
                });
              },
              fail() {
                wx.showToast({
                  title: '网络错误',
                  mask: 1,
                });
              }
            });
          }
          if (t.data.activitiesType == 3) {
            console.log('秒杀');
            let api = sellerApi.msdetail;
            wx.request({
              url: api.url,
              data: {
                hx: 1,
                wid: api.data.wid,
                orderid: t.data.orderId,
              },
              method: 'POST',
              success(resp) {
                console.log(resp);
                wx.showToast({
                  title: resp.data.errmsg,
                  mask: 1,
                });
              },
              fail() {
                wx.showToast({
                  title: '网络错误',
                  mask: 1,
                });
              }
            });
          }
        } else if (res.cancel) {
          wx.showToast({
            title: '什么也没有发生~',
            icon: 'success',
            duration: 2000
          })
        }
      }
    })
  }
});