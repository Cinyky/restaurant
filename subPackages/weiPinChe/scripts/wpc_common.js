let app = getApp();
let myTools = require('../../../utils/myTools');
let wpcConfig = require('../scripts/config');
module.exports = {
  showRedirect() {
    wx.showActionSheet({
      itemList: [
        '首页',
        '发',
        '个人中心'
      ],
      success: function (res) {
        let tapIndex = res.tapIndex;
        console.log(tapIndex);
        let url='';
        if (tapIndex == 0) {
          url = `${wpcConfig.pathPrefix}pages/index/index`;
        } else if (tapIndex == 1) {
          url = `${wpcConfig.pathPrefix}pages/publish/publish`;
        } else if (tapIndex == 2) {
          url = `${wpcConfig.pathPrefix}pages/home/home`;
        }
        console.log(url);
        wx.redirectTo({url: url});
      },
      fail: function (res) {
        console.log(res.errMsg);
      }
    });
  },

  getSetting(callback = null) {
    let t = this;
    let api = jdApi.getSetting;
    wx.request({
      url: api.url,
      method: api.method,
      data: {
        wid: api.data.wid,
        openid: app.globalData.UserInfo.WeiXinOpenId,
      },
      success(resp) {
        let r = resp.data, rd = r.data;
        if (r.status != 'success') {
          wx.showModal({title: '错误', content: r.msg || '未知错误'});
          return false;
        }
        t.setData({setting: rd});
        callback && callback();
      },
      fail() {
        wx.showModal({title: '错误', content: '网络错误'});
      }
    });
  },
};