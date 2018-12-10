var app = getApp();
let myTools = require('../../utils/myTools');
let templateMethods = require("../../utils/template_methods.js");
let tc_common = require('../../utils/tc_common');
let tcApi = require('../../api/tcApi');
Page(Object.assign({}, {
  data: {
    msg: null,
    // user:null,
    distance: '???',
  },
  onLoad: function (option) {
    let t = this, ts = t.data;
    this.setMenu(this);
    app.globalData.getTop(t);
    t.setData({msg_id: option.id});
  },
  onShow(){
    let t = this, ts = t.data;
    app.GetUserInfo(function () {
      t.loadSetting();
      // 加载消息
      let api2 = tcApi.getMsgById;
      wx.request({
        url: api2.url,
        data: {
          wid: api2.data.wid,
          openid: app.globalData.UserInfo.WeiXinOpenId,
          msg_id: t.data.msg_id,
          add_read: true
        },
        method: api2.method,
        success(resp) {
          let r = resp.data, rd = r.data;
          if (r.status == 'success') {
            t.setData({msg: rd});
            // 计算距离
            wx.getLocation({
              success: res => {
                let dist = myTools.geoDistance(res.latitude, res.longitude, rd.lat, rd.lng);
                console.log(dist);
                t.setData({distance: dist.toFixed(2)});
              }
            });
          } else {
            wx.showToast({title: r.msg, mask: 1});
          }
        }, fail() {
          wx.showToast({title: '网络异常', mask: 1});
        }
      });
    });
  },
  onShareAppMessage: function () {

  },
}, templateMethods, tc_common));
