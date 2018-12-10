var app = getApp(),
  $ = require("../../utils/util.js"),
  api = require("../../api/indexAPI.js");
var templateMethods = require("../../utils/template_methods.js"),
  userapi = require("../../api/userAPI.js");;
Page(Object.assign({}, templateMethods, {
  data: {
    indexArray: [],
    ServiceContent: {
      array: [],
      index: 0,
      content: '',
    },
    ServicePersonal: {
      array: [],
      index: 0,
      content: '',
    },
    onlinebookingData: {
      date_h: '2018-09-01',
    }
  },
  onLoad: function(e) {
    this.setMenu(this);
    app.globalData.getTop();
    console.log(e);
    this.setData({
      PageId: e.PageId,
    })
    var that = this;

    that.initData();
    console.log(app.globalData)
    var vdata = {
      PageId: e.PageId,
      lat: app.globalData.latitude_H,
      lng: app.globalData.longitude_H
    };
    console.log(vdata);
    $.xsr($.makeUrl(api.GetIndexData, vdata), function(res) {
      console.log(res.dataList);
      let indexArray = res.dataList.indexArray;
      for (let i = 0; i < indexArray.length; ++i) {
        let item = indexArray[i];
        if (item.name == 'onlinebooking') {
          let ServiceContentArray = 'ServiceContent.array';
          let ServiceContent = [];
          let ServicePersonalArray = 'ServicePersonal.array';
          let ServicePersonal = [];
          let onlinebookingData_Cid = 'onlinebookingData.cid'
          for (let i = 0; i < item.bespeak.length; i++) {
            console.log(i);
            console.log(item.bespeak[i].title);
            ServiceContent[i] = item.bespeak[i].title
            console.log(that.data)
          }
          for (let j = 0; j < item.service.length; j++) {
            console.log(j);
            console.log(item.service[j].title);
            ServicePersonal[j] = item.service[j].title
            console.log(that.data)
          }
          let onlinebooking_StorageSync = {
            Service_ContentArray: ServiceContent,
            Service_PersonalArray: ServicePersonal,
            onlinebooking_Data_Cid: item.bespeak[0].cid,
          }
          console.log(onlinebooking_StorageSync);
          wx.setStorageSync('onlinebooking_StorageSync', onlinebooking_StorageSync);
          that.setData({
            [ServiceContentArray]: ServiceContent,
            [ServicePersonalArray]: ServicePersonal,
            [onlinebookingData_Cid]: item.bespeak[0].cid
          })
          console.log(that.data);
        }
      }
      // if (item.name == 'onlinebooking'){
      //   console.log('123');
      // }
      that.setData({
        indexArray: res.dataList.indexArray
      }), wx.setNavigationBarTitle({
        title: res.dataList.ShopName
      });
    });
    try {
      var e = wx.getSystemInfoSync();
      this.setData({
        platform: e.platform
      });
    } catch (t) {
      console.log(t);
    }
    console.log(this.data);
  },
  onShow: function () {
    let that = this;
    app.globalData.getTop(that);
    // var onlinebooking_StorageSync_h = wx.getStorageSync('onlinebooking_StorageSync');
    // console.log(onlinebooking_StorageSync_h);
    // let ServiceContentArray = 'ServiceContent.array';
    // let ServicePersonalArray = 'ServicePersonal.array';
    // let onlinebookingData_Cid = 'onlinebookingData.cid';
    // if (!that.data.onlinebookingData.cid) {
    //   that.setData({
    //     [ServiceContentArray]: onlinebooking_StorageSync_h.Service_ContentArray,
    //     [ServicePersonalArray]: onlinebooking_StorageSync_h.Service_PersonalArray,
    //     [onlinebookingData_Cid]: onlinebooking_StorageSync_h.onlinebooking_Data_Cid
    //   });
    // }
  },
  initData: function() {
    var that = this;
    wx.setNavigationBarTitle({
      title: app.globalData.VendorInfo.ShopName
    });
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
  onShareAppMessage: function() {
    let shareInfo = {
      title: this.data.pname,
      desc: this.data.desc,
      path: "/pages/main/main?id=" + this.data.PageId + "&uid=" + app.globalData.UserInfo.Id
    };
    console.log(shareInfo);
    return shareInfo;
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
  },
  bindPickerChange_ServiceContent: function (e) {
    let that = this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let ServiceContentIndex = 'ServiceContent.index';
    let ServiceContentContent = 'ServiceContent.content';
    this.setData({
      [ServiceContentIndex]: e.detail.value,
      [ServiceContentContent]: this.data.ServiceContent.array[e.detail.value],
    })
    console.log(this.data);
  },
  bindPickerChange_ServicePersonal: function (e) {
    let that = this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let ServicePersonalIndex = 'ServicePersonal.index';
    let ServicePersonalContent = 'ServicePersonal.content';
    this.setData({
      [ServicePersonalIndex]: e.detail.value,
      [ServicePersonalContent]: this.data.ServicePersonal.array[e.detail.value],
    })
    console.log(this.data);
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let onlinebookingData_date = 'onlinebookingData.date_h';
    this.setData({
      [onlinebookingData_date]: e.detail.value
    })
    console.log(this.data)
  },
  getOnlinebooking_Name: function (e) {
    console.log(e.detail.value);
    let onlinebookingData_name = 'onlinebookingData.Name';
    this.setData({
      [onlinebookingData_name]: e.detail.value
    });
  },
  getOnlinebooking_phone: function (e) {
    console.log(e.detail.value);
    let onlinebookingData_phone = 'onlinebookingData.Phone';
    this.setData({
      [onlinebookingData_phone]: e.detail.value
    });
  },
  getOnlinebooking_submit: function () {
    let t = this, td = t.data;
    console.log(td)
    console.log('预约服务:' + td.ServiceContent.array[td.ServiceContent.index]);
    console.log('服务人员:' + td.ServicePersonal.array[td.ServicePersonal.index]);
    console.log('预约时间:' + td.onlinebookingData.date_h);
    console.log('姓名:' + td.onlinebookingData.Name);
    console.log('电话:' + td.onlinebookingData.Phone);
    console.log('cid:' + td.onlinebookingData.cid);
    console.log('platform:' + td.platform);
    if (!td.onlinebookingData.Name) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      })
      return;
    }
    if (!td.onlinebookingData.Phone) {
      wx.showToast({
        title: '请输入手机',
        icon: 'none'
      })
      return;
    }
    let e = {
      name: td.onlinebookingData.Name,
      Suggestion: '',
      Platform: td.platform,
      phone: td.onlinebookingData.Phone,
      mtime: td.onlinebookingData.date_h,
      service: td.ServicePersonal.array[td.ServicePersonal.index],
      Sbiaoti: td.ServiceContent.array[td.ServiceContent.index],
      cid: td.onlinebookingData.cid,
      openId: app.globalData.UserInfo.WeiXinOpenId
    };
    $.xsr($.makeUrl(userapi.AddMiniFkSuggestion, e), function (e) {
      console.log(userapi.AddMiniFkSuggestion), e.errcode == 0 ? ($.alert("提交成功！"), setTimeout(function () {
        $.backpage(1, function () { })
      }, 1e3)) : $.alert(e.errmsg)
    })
  }
}));