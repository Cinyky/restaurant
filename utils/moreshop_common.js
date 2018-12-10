let app = getApp();
let moreshopApi = require('../api/moreshopApi');
let myTools = require('../utils/myTools');
let WxParse = require("../wxParse/wxParse.js");
module.exports = {
  //商店列表
  shop_list:function (type,latitude,longitude,keywords=null) {
    let t = this;
    let api = moreshopApi.getShopList;
    wx.showLoading({title:'loading',mask:1});
    wx.request({
      url:api.url,
      data:{
        wid:api.data.wid,
        type:type,
        latitude:latitude,
        longitude:longitude,
        keywords:keywords
      },
      method:'POST',
      success: function (e) {
        if(e.data.status == 'error'){
          wx.showModal({
            title: '提示',
            content: e.data.msg,
            showCancel: 0,
            success: function() {
            }
          });
        }else{
          //获取成功
          console.log(e.data);
          t.setData({
            shopList:e.data.data
          });
        }
      },complete(){
        wx.hideLoading();
      }
    });
  },
  //加入付款
  paySellerIn: function (openid) {
    let t = this;
    //调用付款API
    let api = moreshopApi.paySellerIn;
    wx.request({
      url:api.url,
      data:{
        wid:api.data.wid,
        openid:openid
      },
      method:'POST',
      success: function (resp) {
        console.log('后台验证签名后获得的数据',resp);
        // if(resp.data.status == 'success'){
          wx.requestPayment({
            'timeStamp': resp.data.payObj.timeStamp,
            'nonceStr': resp.data.payObj.nonceStr,
            'package': resp.data.payObj.package,
            'signType': 'MD5',
            'paySign': resp.data.payObj.paySign,
            'success':function(r){
              console.log('调用wx.requestPayment支付API',r);
              wx.showModal({
                title: '成功',
                content: '支付成功',
                showCancel: 0,
              });
            },
            'fail':function(res2){
              console.log('支付方法调用失败,错误信息如下');
              console.log(res2);
            }
          })
        // }
        // else{
        //   wx.showModal({
        //     title: '成功',
        //     content: resp.data.msg,
        //     showCancel: 0,
        //   });
        // }
      }
    })
  },
  //获取商店具体信息
  getShopInfo: function (id) {
    let t = this;
    let api = moreshopApi.getShopInfo;
    wx.showLoading({title:'loading',mask:1});
    wx.request({
      url:api.url,
      data:{
        wid:api.data.wid,
        id:id
      },
      method:'POST',
      success: function (e) {
        console.log(e.data.data);
        t.setData({
          shopInfo:e.data.data,
        });
        //解析富文本
        WxParse.wxParse("info", "html", e.data.data.shop_intro, t);
        //设置页面顶部标题
        wx.setNavigationBarTitle({title:e.data.data.shop_name})
      },
      complete: function () {
        wx.hideLoading();
      }
    });
  },
  //获取商品列表
  loadProduct: function (shopid) {
    let that = this;
    let api = moreshopApi.getGoodsList;
    wx.request({
      url:api.url,
      data:{
        wid:api.data.wid,
        shopid:shopid
      },
      method:'POST',
      success: function (resp) {
        console.log('商品列表', resp.data.data)
        let productList = resp.data.data;
        that.setData({
          productList: productList
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
  }
};