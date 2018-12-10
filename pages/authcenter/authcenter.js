const app = getApp();
let templateMethods = require("../../utils/template_methods.js");
let api = require("../../api/indexAPI.js");
Page(Object.assign({}, {
  data: {},
  onLoad: function (options) {
    let t = this;
    t.setMenu(t);
    app.globalData.getTop(t);
  },
  onShow: function () {
  },
  getUserInfo(e) {
    let t=this;
    let s = e.detail;
    console.log(s);
    if(s.userInfo&&s.userInfo.nickName){
      wx.showModal({
        title:'恭喜',
        content:'登录成功',
        showCancel:0,
        success(){
          wx.navigateBack();
        }
      })
    }else{
      wx.showModal({
        title:'提示',
        content:'登录失败，请允许授权',
        showCancel:0,
        success(){
        }
      })
    }
    // wx.login({
    //   success: function (i) {
    //     console.log('success');
    //     var o = s.userInfo;
    //     var u = {
    //       NickName: o.nickName,
    //       sex: o.gender,
    //       photo: o.avatarUrl,
    //       WXCountry: o.country,
    //       WXCity: o.city,
    //       code: i.code,
    //       WXProvince: o.province,
    //     };
    //     console.log(u);
    //     $.xsr(
    //       $.makeUrl(api.AddNewUserAndGetShopInfo, u),
    //       function (res) {
    //         console.log('AddNewUserAndGetShopInfo接口数据', res);
    //         that.globalData.VendorInfo = res.dataList.ShopInfo;
    //         that.globalData.UserInfo = res.dataList.UserInfo;
    //         that.globalData.AdInfo = res.dataList.AdInfo;
    //
    //       }
    //     );
    //   }
    // });
  }
}, templateMethods));