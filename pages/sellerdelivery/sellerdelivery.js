const app = getApp();
const templateMethods = require("../../utils/template_methods.js");
const sellerAPI = require('../../api/sellerAPI');
Page(Object.assign({}, {
  data: {
    need: true,  //是否需要物流
    LogisticsNames: ['EMS', '申通快递', '顺丰快递', '圆通快递', '韵达快递', '中通快递', '汇通快递', '天天快递', '全峰快递', '宅急送', '快捷快递', '高铁快递', '德邦物流', '德邦快递', '天天快递', '优速快递', '国通快递'
    ],
    LogisticsNameIdx: 0,
    LogisticsNum: null,
    orderid: null
  },
  onLoad(e) {
    let t = this;
    app.globalData.getTop();
    // 检查是否已登录
    if (wx.getStorageSync('seller_login_flag') == '') {
      wx.redirectTo({url: '/pages/sellerlogin/sellerlogin'});
    }
    this.setData({
      orderid: e.orderid
    });
  },
  onShow() {
  },
  formSubmit(e) {
    let t = this;
    let tData = this.data;
    let deObj = sellerAPI.delivery;
    deObj.data = Object.assign({}, deObj.data, {
      orderid: tData.orderid,
      LogisticsName: tData.LogisticsNames[tData.LogisticsNameIdx],
      LogisticsNum: tData.LogisticsNum
    });
    deObj.success = function (resp) {
      let data = resp.data;
      console.log(data);
      if (data.status == 'success') {
        wx.showModal({
          title: '发货成功',
          content: data.msg,
          showCancel: false
        });
      } else {
        wx.showModal({
          title: '错误',
          content: data.msg,
          showCancel: false
        });
      }
    };
    wx.request(deObj);
  },
  changeMode(e) {
    console.log(e);
    this.setData({
      need: e.detail.value
    });
  },
  LogisticsNameChange(e) {
    console.log(e);
    this.setData({
      LogisticsNameIdx: e.detail.value
    });
  },
  LogisticsNumInput(e) {
    console.log(e);
    this.setData({
      LogisticsNum: e.detail.value
    });
  }
}, templateMethods));