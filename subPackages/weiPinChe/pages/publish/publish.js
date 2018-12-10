let app = getApp();
let currDate = new Date();
let date_s = [currDate.getFullYear(), currDate.getMonth() + 1, currDate.getDate()].join('-');
let time_s = [(currDate.getHours() >= 10 ? '' : '0') + currDate.getHours(), (currDate.getMinutes() >= 10 ? '' : '0') + currDate.getMinutes()].join(':');
let templateMethods = require("../../../../utils/template_methods.js");
let myTools = require('../../../../utils/myTools');
let apiList = require('../../scripts/apiList');
let wpc_common = require('../../scripts/wpc_common');
Page(Object.assign({}, {
  data: {
    tabIndex: 0,
    formData: {
      date: date_s,
      time: time_s,
      gender: true,//男为true(1)女为false(0)
      type: 0,//发的类型，0=人找车，1=车找人
      people_num: 6//默认6人
    }
  },
  onLoad() {
    let t = this;
    t.setMenu(t);
    app.globalData.getTop(t);
  },
  // 人找车<>车找人 标签页切换
  toggleTab: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    if (index == 1) {
      
      that.setData({
        tabIndex: index
      });
    } else {
      that.setData({
        tabIndex: index
      });
    }
  },
  // 修改性别
  genderChange: function (e) {
    let that = this;
    that.data.formData.gender = e.currentTarget.dataset.value;
    that.setData({
      formData: that.data.formData
    });
  },
  // 日期选择
  bindDateChange: function (e) {
    let that = this;
    that.data.formData.date = e.detail.value;
    that.setData({
      formData: that.data.formData
    });

  },
  // 时间选择
  bindTimeChange: function (e) {
    let that = this;
    that.data.formData.time = e.detail.value;
    that.setData({
      formData: that.data.formData
    });
  },
  // 通用表单输入处理器
  formInput: function (e) {
    const that = this;
    const key = e.currentTarget.dataset.key;
    that.data.formData[key] = e.detail.value;
    that.setData({
      formData: that.data.formData
    });
  },
  //选择地址
  chooseLocation: function (e) {
    let that = this;
    const key = e.currentTarget.dataset.key;
    console.log('Key', key);
    wx.chooseLocation({
      success: function (resp) {
        that.data.formData[key] = resp.address + resp.name;
        that.setData({
          formData: that.data.formData
        });
      },
      fail: function () {
        app.resetAuth();
      }
    });
  },
  // 执行发信息
  publish: function () {
    let t = this;
    let api = apiList.publish;
    let formData = t.data.formData;
    formData.type = t.data.tabIndex;
    wx.myRequest({
      url: api.url,
      data: formData,
      method:api.method,
      success(resp) {
        let r = resp.data, rd = r.data;
        if (r.status != 'success') {
          wx.showModal({title: '提示', content: r.msg || '未知错误'});
        } else {
          wx.showModal({
            title: '提示',
            content: r.msg || '未知错误',
            showCancel: 0,
            success() {
              wx.redirectTo({url:'/subPackages/weiPinChe/pages/published/published'});
              console.log('跳转到published');
            }
          });
        }
      }
    });
  }
}, templateMethods, wpc_common));
