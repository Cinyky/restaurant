const app = getApp();
const applet_id = app.globalData.applet_id;
var $ = require("../../utils/util.js"),
api = require("../../api/orders.js")
Page({
	data: {
	},
	onLoad: function (options) {
   
	},
  onShow:function(){
    this.loadBanner();
  },

	loadBanner: function () {
    var _this = this,
    vdata = {pageindex:1}
    app.globalData.getTop();
    $.xsr($.makeUrl(api.orderserv, vdata),
      function (res) {
        console.log(res);
        _this.setData({
          list: res.dataList
        })
      });
    // 加载首页轮播图广告
		// var that = this;
    // wx.request({
    //   //url: CONFIG.API_URL.server,
    //   data: {applet_id: applet_id },
    //   method: 'post',
    //   header: { 'Content-Type': 'application/json' },
    //   url: app.globalData.url + '/weidogs/meirong/public/index/api/server',
    //   success:function(res){
    //     var data = res.data
    //     that.setData({
    //       data: data
    //     })
    //   }
    // })
	}

})