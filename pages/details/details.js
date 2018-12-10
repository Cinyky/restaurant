const app = getApp();
const applet_id = app.globalData.applet_id;
var $ = require("../../utils/util.js"),
  api = require("../../api/orders.js")
Page({
	data: {
    id:'',
    service:'',
    praise:'',
    page: 1,
    num:0
	},
	onLoad: function (options) {
    var id = options.id;
    this.setData({
      id:id,
      praise:options.pr
    })
    var a = wx.getStorageSync('navigation');
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: a.selectedColor || '#000'
    });
    this.setData({ __wechat_main_color: a.selectedColor });
	},
  onShow:function(){
    this.loadBanner();
    this.loadBanners();
  },

	loadBanner: function () {
    // 获取详情信息
    var _this = this,
      data = { id: _this.data.id }
    console.log(_this.data.id)
    app.globalData.getTop(); 
      $.xsr($.makeUrl(api.orderdeta,data),
      function (res) {
        console.log(res);
        var num = res.service.length ? res.service.length-1:0;
        _this.setData({
          data: res.dataList,
          service: res.service,
          num: num
        })
        wx.setStorage({
          key: "details",
          data: res.dataList
        })
        wx.setStorage({
          key: "service",
          data: res.service
        })
      });
    // wx.request({
    //   //url: CONFIG.API_URL.details,
    //   url: app.globalData.url + '/weidogs/meirong/public/index/api/details',
    //   method: 'post',
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded'
    //   },
    //   data: { id: that.data.id, applet_id: applet_id},
    //   success:function(res){
    //     var data = res.data
    //     console.log(res);
    //     that.setData({
    //       data: data
    //     })
    //   }
    // })
	},
  //店铺服务
  serve: function () {
    wx.navigateTo({
      url: '/pages/serve/serve'
    })
  },
  
  //跳转预约页面
  confirmOrder:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/order/order?id=' + id,
    })
  },
    //跳转预约页面
  works: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/works/works?id=' + id,
    })
  },

  loadBanners: function () {
    var _this = this,
      vdata = { pageindex: this.data.page, reserveId: this.data.id }
    app.globalData.getTop();
    $.xsr($.makeUrl(api.orderwork, vdata),
      function (res) {
        console.log(res);
        _this.setData({
          list: res.dataList
        })
      });
  },
  //图片显示
  img: function (e) {
    var that = this;
    var key = e.currentTarget.dataset.key;
    var img = [];
    console.log(that.data.list[key].pics.length)
    for (var i = 0; i < that.data.list[key].pics.length; i++) {
      img.push(that.data.list[key].pics[i].src);
    }
    console.log(img);
    wx.previewImage({
      current: '', // 当前显示图片的http链接
      urls: img // 需要预览的图片http链接列表
    })
  }

})