var app = getApp();
var $ = require("../../utils/util.js");
let bargainAPI = require("../../api/bargainAPI.js");
let WxParse = require("../../wxParse/wxParse.js");
var num_util = require('../../utils/num_util.js');
Page({
  data:{
    orderdetaildata:[],
    is_kan:0,
    otheropenid:'',
    goodsid:'',
    orderid:''
  },
  onLoad(resp){
    this.setData({tempE:resp})
  },
  onShow: function () {
    var resp=this.data.tempE;
    app.globalData.getTop();
    var that = this;
    //传递过来的订单id
    console.log('resp:', resp);
    that.setData({
      orderid:resp.orderid
    });
    if(resp.is_kan){
      //他人帮砍，获取openid
      app.GetUserInfo(function(){
        console.log("获取到的openid",app.globalData.UserInfo.WeiXinOpenId);
        that.setData({
          otheropenid:app.globalData.UserInfo.WeiXinOpenId,
          is_kan:resp.is_kan
        });
      });
    }
    app.GetUserInfo(function(){
      console.log("获取到的openid",app.globalData.UserInfo.WeiXinOpenId);
      let orderid = that.data.orderid;
      const api = bargainAPI.getOrderDetail;
      wx.request({
        url:api.url,
        data:{
          wid:api.data.wid,
          openid:app.globalData.UserInfo.WeiXinOpenId,
          orderid:orderid
        },
        method:'POST',
        success:function (resp) {
          console.log('返回值',resp.data);
          //计算剩余时间,判断砍价时间是否已经结束(时间戳)
          let etime = parseInt(resp.data['orderinfo']['sdate']) + 86400*parseInt(resp.data['goodsinfo']['limit_day']);
          if(num_util.getTimeOut(etime) === false){
            that.setData({
              clock:'砍价已结束，请在活动时间内购买！'
            });
            // resp.data['goodsinfo']['timeout'] = '砍价已结束，请在活动时间内购买！'
          }else{
            //获取剩余时间
            resp.data['goodsinfo']['timeout'] = '剩余时间：'+num_util.getTimeOut(etime);
            let curr_time = Date.parse(new Date()) / 1000; //当前的时间戳
            let surplus_time = parseInt(etime) - curr_time;
            console.log('计时器时间：',surplus_time*1000);
            that.count_down(surplus_time*1000);
          }
          that.setData({
            orderdetaildata:resp.data,
            goodsid:resp.data['goodsinfo']['id']
          });
          console.log('剩余时间：',that.data.orderdetaildata);
        }
      });
    });
  },
  count_down: function (shengTime) {
    let t = this;
    // 渲染倒计时时钟
    this.setData({
      clock: "剩余时间："+this.date_format(shengTime)
    });
    // console.log(this.data.clock);
    if (shengTime <= 0) {
      this.setData({
        clock: "已经截止"
      });
      // timeout则跳出递归
      return;
    }
    setTimeout(function () {
      // 放在最后--
      shengTime -= 10;
      t.count_down(shengTime);
    }, 10)
  },
// 时间格式化输出，如03:25:19 86。每10ms都会调用一次
  date_format:function(micro_second) {
  // 秒数
  var second = Math.floor(micro_second / 1000);
  // 小时位
  var hr = Math.floor(second / 3600);
  // 分钟位
  var min = this.fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
  // 秒位
  var sec = this.fill_zero_prefix((second - hr * 3600 - min * 60));// equal to => var sec = second % 60;
  // 毫秒位，保留2位
  var micro_sec = this.fill_zero_prefix(Math.floor((micro_second % 1000) / 10));
  
  return hr + ":" + min + ":" + sec;
},

// 位数不足补零
fill_zero_prefix:function(num) {
  return num < 10 ? "0" + num : num
},
  // InitPage: function (resp) {
  //   let that = this;
  //   //传递过来的订单id
  //   console.log('resp:', resp);
  //   that.setData({
  //     orderid:resp.orderid
  //   });
  //   if(resp.is_kan){
  //     //他人帮砍，获取openid
  //     wx.login({
  //       success: function (loginCode) {
  //         let appid = 'wx31466cb58bf77444'; //填写微信小程序appid
  //         let secret = '06bfd461a9e2d59a6fa661e7b9f9f0a8'; //填写微信小程序secret
  //         //调用request请求api转换登录凭证
  //         wx.request({
  //           url: 'https://api.weixin.qq.com/sns/jscode2session',
  //           data:{
  //             appid:appid,
  //             secret:secret,
  //             js_code:loginCode.code,
  //             grant_type:'authorization_code'
  //           },
  //           method:'GET',
  //           success: function(res) {
  //             console.log('openid为：',res.data.openid); //获取openid
  //             that.setData({
  //               otheropenid:res.data.openid,
  //               is_kan:resp.is_kan
  //             });
  //           }
  //         })
  //       }
  //     });
  //   }
  //   let orderid = that.data.orderid;
  //   const api = bargainAPI.getOrderDetail;
  //   wx.request({
  //     url:api.url,
  //     data:{
  //       wid:api.data.wid,
  //       openid:app.globalData.UserInfo.WeiXinOpenId,
  //       orderid:orderid
  //     },
  //     method:'POST',
  //     success:function (resp) {
  //       console.log('返回值',resp.data);
  //       //计算剩余时间,判断砍价时间是否已经结束
  //       let etime = parseInt(resp.data['orderinfo']['sdate']) + 86400*parseInt(resp.data['goodsinfo']['limit_day']);
  //       if(num_util.getTimeOut(etime) === false){
  //         resp.data['goodsinfo']['timeout'] = '砍价已结束，请在活动时间内购买！'
  //       }else{
  //         resp.data['goodsinfo']['timeout'] = '剩余时间：'+num_util.getTimeOut(etime);
  //       }
  //       that.setData({
  //         orderdetaildata:resp.data,
  //         goodsid:resp.data['goodsinfo']['id']
  //       });
  //       console.log('剩余时间：',that.data.orderdetaildata);
  //     }
  //   });
  // },
  onShareAppMessage: function () {
    let t = this;
    //分享
    return {
      desc   : '快来帮我砍价吧！',
      path   : "/pages/bargainshare/bargainshare?orderid="+t.data.orderdetaildata.orderinfo.id+"&is_kan="+1,
      success: function () {
        console.log('我已经分享啦~等待小伙伴们砍价中。。。');
      },
      fail   : function () {
        console.log('我分享失败了！');
        wx.showModal({
          title     : '错误',
          content   : '分享错误',
          showCancel: false,
          success() {
            wx.navigateBack();
          }
        });
      }
    };
  },
  //帮忙发起砍价
  helpKan:function () {
    let t = this;
    const api = bargainAPI.saveHelpKan;
    wx.request({
      url:api.url,
      data:{
        wid:api.data.wid,
        orderid:t.data.orderid,
        goodsid:t.data.goodsid,
        otheropenid:t.data.otheropenid
      },
      method:'POST',
      success: function (e) {
        console.log('帮砍返回的信息：',e);
        if(e.data.status==='success'){
          wx.showModal({
            title:'帮砍提示',
            content:e.data.msg,
            showCancel:false,
            success:function () {
              wx.navigateTo({
                url:'/pages/bargaingoodslist/goodslist'
              });
            }
          });
        }else if(e.data.status === 'error'){
          wx.showModal({
            title:'帮砍提示',
            content:e.data.msg,
            showCancel: false,
          });
        }
      }
    })
  },
  //购买，跳转到填写信息页面
  buyNow:function (e) {
    let t = this;
    let orderId = e.currentTarget.dataset.orderId;
    const api = bargainAPI.getOrderDetail;
    wx.request({
      url:api.url,
      data:{
        wid:api.data.wid,
        orderid:orderId
      },
      method:'POST',
      success: function (resp) {
        console.log(resp);
        //计算剩余时间,判断活动时间是否已经结束
        let etime = parseInt(resp.data['goodsinfo']['goods_date_e']);
        if(num_util.getTimeOut(etime) === false){
          //活动已结束，无法购买
          wx.showModal({
            title:'结束提示',
            content:'活动已结束，请浏览其他商品！',
            showCancel: false,
          });
        }else if(resp.data['orderinfo']['is_pay'] == '1'){//判断是否已买
          wx.showModal({
            title:'结束提示',
            content:'您已购买该商品，不得重复购买！',
            showCancel: false,
          });
        }else{
          wx.navigateTo({
            url:'/pages/bargainordersubmit/bargainordersubmit'
          });
        }
      }
    })
  }
});