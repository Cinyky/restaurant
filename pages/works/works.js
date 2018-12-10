const app = getApp();
const applet_id = app.globalData.applet_id;
var $ = require("../../utils/util.js"),
  api = require("../../api/orders.js")
Page({
	data: {
    page:1
	},
	onLoad: function (options) {
    var id = options.id
    this.setData({
      id:id
    })
	},
  onShow:function(){
    this.loadBanner();
  },

  loadBanner: function () {
    var _this = this,
      vdata = { pageindex: this.data.page , reserveId:this.data.id}
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
  img:function(e){
    var that=this;
    var key = e.currentTarget.dataset.key;
    var img = [];
    console.log(that.data.list[key].pics.length)
    for (var i = 0; i < that.data.list[key].pics.length;i++){
      img.push(that.data.list[key].pics[i].src);
    }
    console.log(img);
    wx.previewImage({
      current: '', // 当前显示图片的http链接
      urls: img // 需要预览的图片http链接列表
    })
  }

})