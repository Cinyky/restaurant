const app = getApp();
const applet_id = app.globalData.applet_id;
var $ = require("../../utils/util.js"),
  api = require("../../api/orders.js")
Page({
	data: {
    num: ['1', '2', '3', '4'],
    key:'0',
    fuwu:'请选择服务',
    time:'',
    hour:'',
    num_i:'0'
	},
	onLoad: function (options) {
    var that=this;
    var mydate = new Date();
    var y = mydate.getFullYear();
    var m = mydate.getMonth() + 1;
    var d = mydate.getDate();
    var h = mydate.getHours();
    var i = mydate.getMinutes();
    if (m - 12 > 0) {
      y = y + 1;
    }
    var time = y + '-' + m + '-' + d;
    var hour = h + ':' + i;
    // that.setData({
    //   time: time,
    //   hour: hour
    // })
    var id = options.id;
    this.setData({
      id: id
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
  },

  loadBanner: function () {
    // 获取详情信息
    app.globalData.getTop(); 
    var that = this,
    details = wx.getStorageSync('details'),
    service = wx.getStorageSync('service'),
    ser = [];
    service.forEach(function (value, index, array) {
      ser.push(value.name)
    });
    console.log(ser[0])
        that.setData({
          data: details,
          index:ser,
          service: service
        })
  },
  //获取服务选项key值
  bindPickerChange:function(e){
    var that=this;
    console.log(e.detail.value)
    that.setData({
      key: e.detail.value
    })
  },
  //选择日期
  date:function(e){
    var that=this;
    that.setData({
      time: e.detail.value
    })
  },
  //选择时间
  hour: function (e) {
    var that = this;
    that.setData({
      hour: e.detail.value
    })
  },
  //选择人数
  num:function(e){
    var that = this;
    console.log(that.data.num[e.detail.value])
    that.setData({
      num_i: e.detail.value
    })
  },
  //获取表单
  add:function(e){
    console.log(e)
    var that=this;
    e.detail.value.serviceId = that.data.service[that.data.key].id;
    e.detail.value.reserveId=that.data.id;
    e.detail.value.num = e.detail.value.number;
    e.detail.value.openid = app.globalData.UserInfo.WeiXinOpenId;
    e.detail.value.users = e.detail.value.names;
    console.log(app.globalData.UserInfo.WeiXinOpenId)
    console.log(e.detail.value.telephone)
    let reg = /^1[3|4|5|6|7|8][0-9]{9}$/;
    let flag = reg.test(e.detail.value.telephone);
    console.log(flag);
    if (e.detail.value.names == '') {
      wx.showToast({
        icon: 'none',
        title: '请输入姓名'
      })
      return false;
    }
    if (!flag) {
      wx.showToast({
        icon: 'none',
        title: '请输入正确的手机号'
      })
      return false;
    }
    if (e.detail.value.date == '') {
      wx.showToast({
        icon: 'none',
        title: '请选择日期'
      })
      return false;
    }
    if (e.detail.value.time == '') {
      wx.showToast({
        icon: 'none',
        title: '请输入时间'
      })
      return false;
    }
    e.detail.value.times = e.detail.value.date +e.detail.value.time
    $.xsr($.makeUrl(api.orderadd, e.detail.value),
      function (res) {
        console.log(res)
        if (res.errcode == 0) {
          wx.showToast({
            title: res.errmsg,
            icon: 'success',
            duration: 1000
          })
          setTimeout(function () {
            wx.navigateTo({
              url: '/pages/log/log',
            })
          }, 1000)
        }else{
          wx.showToast({
            title: res.errmsg,
            icon: 'loading',
            duration: 1000
          })
        }
      });
    // wx.request({
    //   //url: CONFIG.API_URL.order_add,
    //   url: app.globalData.url + '/weidogs/meirong/public/index/api/order_add',
    //   method: 'post',
    //   header: { 'Content-Type': 'application/json' },
    //   data: { openid: app.globalData.userInfo.openid, data: e.detail.value, applet_id: app.globalData.applet_id},
    //   success: function (res) {
    //     if(res.data.status == 1){
    //       wx.showToast({
    //         title: res.data.message,
    //         icon: 'success',
    //         duration: 1000
    //       })
    //       setTimeout(function () {
    //         wx.navigateTo({
    //           url: '/pages/log/log',
    //         })
    //       }, 1000)
    //     }else{
    //       wx.showToast({
    //         title: res.data.message,
    //         icon: 'loading',
    //         duration: 1000
    //       })
    //     }
    //   }
    // })
  }

})