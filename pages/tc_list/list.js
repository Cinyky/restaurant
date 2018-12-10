var app = getApp();
var url = app.globalData.url;
var applet_id = app.globalData.applet_id;
Page({
  data: { 
     name: "",
      Res:[],
      ca_id: "",
      name:"",
  },
  onLoad: function (option) {
  
    var ca_id = option.id;
    var name = option.name+'详细列表页';
    var that = this;
    var url = app.globalData.url;
    wx.setNavigationBarTitle({
      title: name
    });
    this.setData({
     name:name,
     ca_id: ca_id,
     
    });
    wx.request({
      url: url +'/weidogs/tonchengPro/public/app/Tongcheng/gettypedetail',
      header: {
        "Content-Type": "json"
      },
      method: 'POST',
      data:{
         ca_id:ca_id,
         applet_id: applet_id
      },
      success: function (res) {
        var Res = res.data; 
        console.log(Res);
      that.setData({    
         Res:Res, 
         naem:name,
         url: url
   }) 
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    });
    wx.request({
      url: url +'/weidogs/tonchengPro/public/app/Tongcheng/getissue',
      header: {
        "Content-Type": "json"
      },
      method: 'get',
      data: {
        ca_id: ca_id,
        applet_id: applet_id,my_id:wx.getStorageSync('meID')
      },
      success: function (res) {
    
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    });
  },
    onReady: function (event) {
    wx.setNavigationBarTitle({
      title: this.data.name
    })
  },

 
  Faglst1: function (event) {
    var id = event.currentTarget.dataset.idx;
    var Res = this.data.Res;
       Res[id].flag = 'none';
       Res[id].flaga = 'inline-block';
    this.setData({
    Res:Res
    });
    wx.showToast({
      title: "点赞成功",
      duration: 1000,
      icon: "success"
    })
  },
  Faglst2: function (event) {
    var id = event.currentTarget.dataset.idx;
    var Res = this.data.Res;
    Res[id].flag = 'inline-block';
    Res[id].flaga = 'none';
    this.setData({
      Res: Res
    });
    wx.showToast({
      title: "取消成功",
      duration: 1000,
      icon: "success"
    })
  },
 ontack1: function (event) {
   var id = event.currentTarget.dataset.idx;
   var Res = this.data.Res;
   Res[id].flagaa = !(Res[id].flagaa);
   this.setData({
  Res:Res
   })
  },
  Ondetail: function (event) {
     var phone = event.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  onlist: function(event) {
    var id = event.currentTarget.dataset.idx;
   var ca_id = this.data.ca_id;
   var url = app.globalData.url;
    wx.navigateTo({
      url: "/pages/common/common?id=&ca_id=" + id + '/' + ca_id
    })
  },
  bindKeyInput: function (event) {
    var co_user_id = wx.getStorageSync('meID');
    var user_id = wx.getStorageSync('meID1');
    var that = this;
    var Res = this.data.Res;
    var idx = event.currentTarget.dataset.idx;
    var in_id = Res[idx].id;
    var ca_id = Res[idx].ca_id;
    var tc_user_id = Res[idx].tc_user_id;
    var co_content = event.detail.value;
    var id = event.currentTarget.dataset.id;
    var ca_id = this.data.ca_id; 
    var name = this.data.name.slice(0,4);
    var url = app.globalData.url;
    // var str = this.data.str;
    if (co_content == "") {
      return false;
    } else {
      wx.request({
        url: url +'/weidogs/tonchengPro/public/app/Tongcheng/insertcomment',
        method: 'POST',
        header: {
          "Content-Type": "json"
        },
        data: {
          co_user_id: co_user_id,
          user_id: user_id,
          co_content: co_content,
          tc_user_id: tc_user_id,
          in_id: in_id,
          ca_id: ca_id,
          applet_id: applet_id
        },
        success: function (res) {
          if (res.data == 1) {
            wx.showToast({
              title: "评论成功",
              duration: 1000,
              icon: "success"
            });
            wx.redirectTo({
              url: '/pages/list/list?id=&name=' + ca_id + '/'+name
            });

          }
        },
        fail: function (e) {
          wx.showToast({
            title: '网络异常！',
            duration: 2000
          });
        },
      });

    }
  },
  showImg: function (event) {
    var Res = this.data.Res;
    var idx = event.currentTarget.dataset.idx;
    var img = Res[idx].in_picture[0];
    var img1 = Res[idx].in_picture[1];
    var img2 = Res[idx].in_picture[2];
    var src = url+'/weidogs/tonchengPro/public/' + img
    var src1 = url +'/weidogs/tonchengPro/public/' + img1
    var src2 = url +'/weidogs/tonchengPro/public/' + img2
    wx.previewImage({
      current: src,
      urls: [src, src1,src2]
    })
  },
})