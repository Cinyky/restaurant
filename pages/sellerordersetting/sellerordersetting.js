const app = getApp();
const templateMethods = require("../../utils/template_methods.js");
const sellerAPI = require('../../api/sellerAPI');
Page(Object.assign({}, {
  data: {
  },
  onLoad() {
    let t = this;
    app.globalData.getTop();
    // 检查是否已登录
    if (wx.getStorageSync('seller_login_flag') == '') {
      wx.redirectTo({url: '/pages/sellerlogin/sellerlogin'});
    }
    // 加载订单设置
    let settingObj = sellerAPI.orderSetting;
    settingObj.success = function (resp) {
      let data = resp.data;
      console.log(data);
      let settingData = data.data;
      console.log(settingData);
      if (data.status == 'success') {
        t.setData({
          setting: settingData,
        });
      } else {
        wx.showModal({
          title: '加载失败',
          content: data.msg,
          showCancel: 0
        });
      }
    };
    wx.request(settingObj);
  },
  onShow() {
  },
  formSubmit(e){
    let t=this;
    let tData=this.data;
    let formData=e.detail.value;
    console.log(formData);
    formData.save=true;
    let settingObj=sellerAPI.orderSetting;
    settingObj.data=Object.assign({},settingObj.data,formData);
    settingObj.success=function  (resp) {
      let data=resp.data;
      console.log(data);
      if(data.status=='success'){
        wx.showModal({
          title:'成功',
          content:data.msg,
          showCancel:false
        });
      }
    };
    wx.request(settingObj);
  }
}, templateMethods));