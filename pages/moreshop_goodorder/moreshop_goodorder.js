var app = getApp(),
  $ = require("../../utils/util.js"),
  moreshopApi = require("../../api/moreshopApi.js"),
  notice = require("../../utils/notice.js"),
  orderapi = require("../../api/orderAPI.js")
Page({
  data: {
    product: {}
  },
  onLoad: function (options) {
    app.globalData.getTop();
    let that = this;
    let pageStack = getCurrentPages();
    let prevPage = pageStack[pageStack.length - 2];
    let prevData = prevPage.data.product;
    //商品信息
    console.log('商品信息：',prevData);
    let product = prevData;
    //获取原价
    let perPrice = product.price;
    //获取实付商品价格
    let reallyPrice = product.price;
    //带运费价格
    let allPrice = parseFloat(reallyPrice) + parseFloat(product.trans_money);
    that.setData({
      prevData: prevData,
      product: product,
      perPrice: perPrice,
      reallyPrice:reallyPrice,
      num: 1,
      allPrice: allPrice
    });
    that.getPayType();
  },
  //获取支付方式
  getPayType:function(){
    let t = this;
    let api = orderapi.GetPayType;
    wx.request({
      url:api.url,
      data:{
        wid:api.data.wid
      },
      method:"POST",
      success: function (e) {
        console.log('支付方式回调：',e.data.data);
        t.setData({
          payTypeArr:e.data.data
        })
      }
    })
  },
  //设置收货地址
  selectAddress: function () {
    var that = this;
    wx.chooseAddress({
      success: function (addr) {
        console.log('选择的收货地址', addr);
        that.setData({
          receiver: addr.userName,
          phone: addr.telNumber,
          FullAddress: addr.provinceName + addr.cityName + addr.countyName + addr.detailInfo
        });
      }
    });
  },
  //备注信息
  remarkInput: function (e) {
    let that = this;
    let remark = e.detail.value;
    if (remark.length > 200) {
      that.setData({
        remark: that.data.remark
      });
    } else {
      this.setData({
        remark: remark
      });
    }
  },
  //提交订单
  submitOrder: function () {
    let that = this;
    console.log(that.data);
    if (!that.data.FullAddress) {
      that.selectAddress();
      return false;
    }
    let api = moreshopApi.subOrder;
    app.GetUserInfo(function() {
      console.log("获取到的openid", app.globalData.UserInfo.WeiXinOpenId);
      //整理订单数据
      api.data = Object.assign(api.data, {
        wid:api.data.wid,
        openid: app.globalData.UserInfo.WeiXinOpenId,
        //订单参数
        goodsid: that.data.product.id,//商品id
        shopid: that.data.product.shopid,//商店id
        remark: that.data.remark,//备注
        receiver: that.data.receiver,//收件人
        phone: that.data.phone,//手机号
        address: that.data.FullAddress,//收货地址
        // orderid: that.data.prevData.orderinfo.id,//订单id
        allPrice:that.data.allPrice,//总费用
      });
      //设置回调
      api = Object.assign(api, {
        success: function (resp) {
          console.log(resp);
          // 进行支付方式的选择
          var itemlist;
          // if(that.data.payTypeArr[1]){
          //   itemlist=['微信支付', '余额支付']
          // }else if(that.data.payTypeArr[0] == 1){
            itemlist=['微信支付'];
          // }else{
          //   itemlist=['余额支付']
          // }
          wx.showActionSheet({
            itemList: itemlist,
            success: function (res) {
              console.log(res.tapIndex);
              if(that.data.payTypeArr[1]){
                if(res.tapIndex==0){
                  // 微信支付
                  let payObj = resp.data.payObj;
                  if (payObj.package) {
                    payObj.success = function (resp2) {
                      wx.showModal({
                        title: '成功',
                        content: '支付成功',
                        showCancel: 0,
                        success: function (res) {
                          if (res.confirm) {
                            console.log(res);
                            //跳转到订单详情页面
                            wx.redirectTo({
                              url: '/pages/moreshop_orderlist/moreshop_orderlist?shopid='+that.data.product.shopid
                            });
                          }
                        }
                      });
                    };
                    payObj.fail = function (resp2) {
                      console.log('支付方法调用失败,错误信息如下');
                      console.log(resp2);
                    };
                    wx.requestPayment(payObj);
                  }
                }else if(res.tapIndex==1){
                  // 设置支付后跳转链接
                  wx.setStorageSync('vip_pay_redirect','/pages/moreshop_orderlist/moreshop_orderlist?shopid='+that.data.product.shopid);
                  wx.navigateTo({
                    url:`/pages/payment/payment?type=normal&orderid=${that.data.orderid}`
                  });
                }
              }else if(that.data.payTypeArr[0] == 1){
                // 微信支付
                let payObj = resp.data.payObj;
                if (payObj.package) {
                  payObj.success = function (resp2) {
                    wx.showModal({
                      title: '成功',
                      content: '支付成功',
                      showCancel: 0,
                      success: function (res) {
                        if (res.confirm) {
                          console.log(res);
                          //跳转到订单详情页面
                          wx.redirectTo({
                            url: '/pages/moreshop_orderlist/moreshop_orderlist?shopid='+that.data.product.shopid
                          });
                        }
                      }
                    });
                  };
                  payObj.fail = function (resp2) {
                    console.log('支付方法调用失败,错误信息如下');
                    console.log(resp2);
                  };
                  wx.requestPayment(payObj);
                }
              }else{
                // 设置支付后跳转链接
                wx.setStorageSync('vip_pay_redirect',`/pages/orderdetail/orderdetail?orderid=${that.data.orderid}`);
                wx.navigateTo({
                  url:`/pages/payment/payment?type=normal&orderid=${that.data.orderid}`
                });
              }
            },
            fail: function (res) {
              console.log(res.errMsg);
            }
          });
        },
        error: function () {
          wx.showModal({
            title: 'Error',
            content: '网络错误',
            showCancel: 0
          });
        }
      });
      wx.request(api);
    });
  }
});