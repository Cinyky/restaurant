var app = getApp();
let bargainAPI = require("../../api/bargainAPI.js");
let WxParse = require("../../wxParse/wxParse.js");
var num_util = require('../../utils/num_util.js');
Page({
  data: {},

  // 加载完成之后
  onLoad: function(options) {
    var t = this;
    app.globalData.getTop(t);
    var that = this;
    console.log('onload参数', options);
    //上一个页面传来了index参数
    // let pageStack = getCurrentPages();
    // console.log('当前页面栈', pageStack);
    // if (options['index']) {
    //   console.log('准备直接从上一个页面取出商品信息');
    //   let prevPage = pageStack[pageStack.length - 2];
    //   console.log('上一个页面', prevPage);
    //   let product = prevPage.data.productList[options['index']];
    //   console.log(product);
    //   // 测试时间结束
    //   that.setData({
    //     product: product,
    //     goodsid: options.id
    //   });


    //   //解析富文本
    //   WxParse.wxParse("info", "html", product.goods_ms, that);
      
    // }
    // 数据H
      that.setData({
        goodsid: options.id
      });
    let api = bargainAPI.getGoodsDetail;
    console.log(t.data);
    wx.request({
      url: api.url,
      data: {
        wid: api.data.wid,
        goodsid: t.data.goodsid
      },
      method: 'POST',
      success(res) {
        console.log(res);
        t.setData({
          Tdata_h: res.data
        });
        WxParse.wxParse("info", "html", res.data.goods_ms, that);
        console.log(t.data);
        console.log(t.data.Tdata_h)
        // 测试时间
        let ddd = t.data.Tdata_h.goods_date_e;
        let ccc = t.getLocalTime(ddd);
        let bbb = Date.parse(new Date()) / 1000;
        let aaa = t.getLocalTime(bbb);
        let eee = ddd - bbb;
        console.log('结束时间', ccc);
        console.log('当前时间', aaa);
        that.count_down(eee * 1000);
      }
    })
  },
  getLocalTime: function(nS) {
    return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
  },
  count_down: function(shengTime) {
    let t = this;
    // 渲染倒计时时钟
    this.setData({
      clock: this.date_format(shengTime)
    });
    // console.log(this.data.clock);
    if (shengTime <= 0) {
      this.setData({
        clock: "已经截止"
      });
      // timeout则跳出递归
      return;
    }
    setTimeout(function() {
      // 放在最后--
      shengTime -= 10;
      t.count_down(shengTime);
    }, 10)
  },
  // 时间格式化输出，如03:25:19 86。每10ms都会调用一次
  date_format: function(micro_second) {
    // 秒数
    var second = Math.floor(micro_second / 1000);
    // 小时位
    var hr = Math.floor(second / 3600);
    // 分钟位
    var min = this.fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
    // 秒位
    var sec = this.fill_zero_prefix((second - hr * 3600 - min * 60)); // equal to => var sec = second % 60;
    // 毫秒位，保留2位
    var micro_sec = this.fill_zero_prefix(Math.floor((micro_second % 1000) / 10));

    return hr + ":" + min + ":" + sec;
  },

  // 位数不足补零
  fill_zero_prefix: function(num) {
    return num < 10 ? "0" + num : num
  },
  // 转发
  onShareAppMessage: function(res) {
    let t = this;
    console.log(this.data.goodsid);
    if (res.from === 'button') {
      console.log(res);
      console.log("来自页面内转发按钮");
      console.log(res.target);
    } else {
      console.log("来自右上角转发菜单")
    }
    return {
      title: '帮我砍个价吧',
      path: '/pages/bargaindetail/bargaindetail?id=' + t.data.goodsid,
      success: (res) => {
        console.log("转发成功", res);
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }

  },
  return_index_h: function() {
    wx.reLaunch({
      url: '/pages/index/index',
    });
  },
  //去提交订单
  beginBargain: function(e) {
    let that = this;
    let goodsid = e.currentTarget.dataset.goodsid;
    console.log('商品id', goodsid);
    const api = bargainAPI.submitOrder;
    wx.request({
      url: api.url,
      data: {
        wid: api.data.wid,
        openid: app.globalData.UserInfo.WeiXinOpenId,
        goodsid: goodsid
      },
      method: 'POST',
      success(resp) {
        console.log('订单信息：', resp.data);
        if (resp.data.status === 'success') {
          wx.showModal({
            title: '成功',
            content: resp.data.msg,
            showCancel: 0,
            success: function(e) {
              console.log('订单id：', resp.data.data);
              //跳转到该商品的砍价信息页面
              wx.navigateTo({
                url: "/pages/bargainshare/bargainshare?orderid=" + resp.data.data
              });
            }
          });
        } else if (resp.data.status === 'error') {
          wx.showModal({
            title: '失败',
            content: resp.data.msg,
            showCancel: false,
          })
        }
      },
    });
  },
});