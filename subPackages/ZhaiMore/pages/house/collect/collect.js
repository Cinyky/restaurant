
function e(e) {
  return e && e.__esModule ? e : {
    default: e
  };
}

var t = e(require("../../../utils/dg.js")), a = e(require("../../../utils/data.js")), i = e(require("../../../utils/requestUtil.js")), n = e(require("../../../utils/underscore.js")), o = (e(require("../../../utils/util.js")),
a.default.duoguan_host_api_url + "/index.php/addon/DuoguanHouse");
let app             = getApp();
let templateMethods = require("../../../../../utils/template_methods.js");
let myTools         = require('../../../../../utils/myTools');
let common          = require('../../../scripts/common');
let apiList         = require('../../../scripts/apiList');

Page(Object.assign({}, {
    data  : {},
    onLoad: function (e) {
      let t = this;
      t.setMenu(t);
      app.globalData.getTop(t);
      app.GetUserInfo(function () {
        console.log("获取到的openid", app.globalData.UserInfo.WeiXinOpenId);
        // t.setData({
        //   otheropenid:app.globalData.UserInfo.WeiXinOpenId
        // });
        let api = apiList.getFaBu;
        wx.request({
          url   : api.url,
          method: api.method,
          data  : {
            wid   : api.data.wid,
            openid: app.globalData.UserInfo.WeiXinOpenId
            // openid: app.globalData.UserInfo.WeiXinOpenId,
          },
          success(resp) {
            let r = resp.data, rd = r.data;
            console.log('返回的房源：', rd.collect);
            if (r.status != 'success') {
              wx.showModal({title: '错误', content: r.msg || '未知错误'});
              return false;
            }
            t.setData({
              zushouList: rd.collect
            });
            //解析富文本
            // WxParse.wxParse("info", "html", t.data.agentInfo.intro, t);
          },
          fail() {
            wx.showModal({title: '错误', content: '网络错误'});
          }
        });
      });
    },
  //跳转至信息具体页面
  navigateTo: function(e) {
    var a = "../detail/detail?id=" + e.currentTarget.dataset.id;
    t.default.navigateTo({
      url: a,
      fail: function(e) {
        t.default.redirectTo({
          url: a
        });
      }
    });
  },
}, templateMethods, common));