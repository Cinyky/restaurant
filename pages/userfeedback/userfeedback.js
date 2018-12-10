var app = getApp(),
  $ = require("../../utils/util.js"),
  userapi = require("../../api/userAPI.js");
var templateMethods = require("../../utils/template_methods.js");
Page(Object.assign({}, templateMethods, {
  data: {
    remark: "",
    remarkLength: 0,
    wechat_id: "",
    Email: "",
    platform: ""
  },
  onLoad: function() {
    this.setMenu(this);
    app.globalData.getTop();
    this.setData({
      Email: ""
    });
    try {
      var e = wx.getSystemInfoSync();
      this.setData({
        platform: e.platform
      });
    } catch (t) {
      console.log(t);
    }
  },
  onShow: function () {
    var a = wx.getStorageSync('navigation');
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: a.selectedColor || '#000'
    });
    this.setData({ __wechat_main_color: a.selectedColor });
  },
  inputwechat: function(e) {
    this.setData({
      wechat_id: e.detail.value
    });
  },
  inputemail: function(e) {
    this.setData({
      Email: e.detail.value
    });
  },
  inputRemark: function(e) {
    this.setData({
      remark: e.detail.value,
      remarkLength: e.detail.value.length
    });
  },
  submitdata: function() {
    if ($.isNull(this.data.remark)) {
      $.alert("请输入您宝贵的意见");
      return;
    }
    let reg = /^1[3|4|5|6|7|8][0-9]{9}$/;
    let flag = reg.test(this.data.Email);
    console.log(flag);
    if (!flag) {
      wx.showToast({
        icon: 'none',
        title: '请输入正确的手机号'
      })
      return false;
    }
    var e = {
      Wechat: this.data.wechat_id,
      Suggestion: this.data.remark,
      Platform: this.data.platform,
      Email: this.data.Email,
      openId: app.globalData.UserInfo.WeiXinOpenId
    };
    console.log(e), $.xsr($.makeUrl(userapi.AddMiniUserSuggestion, e), function(e) {
      console.log(e), e.errcode == 0 ? ($.alert("提交成功！"), setTimeout(function() {
        $.backpage(1, function() {});
      }, 1e3)) : $.alert(e.errmsg);
    });
  }
}));