function t(t) {
  return t && t.__esModule ? t : {
    default: t
  };
}

var e                                      = t(require("../../../utils/dg")), i = t(require("../../../utils/data.js")), a = t(require("../../../utils/requestUtil.js")), o = (t(require("../../../utils/underscore.js")),
  t(require("../../../utils/util.js"))), n = i.default.duoguan_host_api_url + "/index.php/addon/DuoguanHouse";

o.default.getMapSdk();
let app             = getApp();
let templateMethods = require("../../../../../utils/template_methods.js");
let myTools         = require('../../../../../utils/myTools');
let common          = require('../../../scripts/common');
let apiList         = require('../../../scripts/apiList');
Page(Object.assign({}, {
  videoContext     : {},
  data             : {
    isAli          : e.default.os.isAlipay(),
    zushouList           : {},
    swiper         : {
      indicatorDots: !0,
      autoplay     : !0,
      interval     : 3e3,
      duration     : 1e3
    },
    vill_id        : null,
    marker         : [],
    swiperUrls     : [],
    collect        : !1,
    makeAppointment: !1,
    hasVideoUrl    : !1,
    video          : {
      isShow  : !1,
      autoplay: !1,
      text    : "轮播图"
    }
  },
  onLoad           : function (t) {
    this.setMenu(this);
    app.globalData.getTop(this);
    //获取租房，售房信息
    this.getFang(t.id);
  },
  //打电话
  makePhoneCall    : function (t) {
    e.default.makePhoneCall({
      phoneNumber: t.currentTarget.dataset.mobile || ""
    });
  },
  //打开经纪人详细页
  openAgencerDetail: function (t) {
    if (this.data.isAli) return !1;
    var i = "../agencer-detail/agencer-detail?id=" + t.currentTarget.dataset.id;
    e.default.navigateTo({
      url : i,
      fail: function (t) {
        e.default.redirectTo({
          url: i
        });
      }
    });
  },
  //分享本页
  toSharePage: function(t) {
    var i = "../share/share?id=" + this.data.zushouList.id;
    e.default.navigateTo({
      url: i
    });
  },
  //预览图片
  previewImage: function(t) {
    e.default.previewImage({
      current: this.data.zushouList.pics[0],
      urls: this.data.zushouList.pics
    });
  },
  //地图导航
  // openLocation: function(t) {
  //   var i = t.currentTarget.dataset.latitude, a = t.currentTarget.dataset.longitude, o = t.currentTarget.dataset.name, n = t.currentTarget.dataset.address;
  //   e.default.openLocation({
  //     latitude: parseFloat(i),
  //     longitude: parseFloat(a),
  //     name: o,
  //     address: n,
  //     scale: 28
  //   });
  // },
  //收藏
  collect: function(t) {
    let that = this;
    console.log(that.data.zushouList.id);
    console.log(that.data.zushouList.person.id);
    this.setData({
      collect: 0 == this.data.collect
    });
    let api = apiList.collect;
    wx.request({
      url   : api.url,
      method: api.method,
      data  : {
        wid     : api.data.wid,
        fangid:that.data.zushouList.id,
        userid:that.data.zushouList.person.id,
        // openid: app.globalData.UserInfo.WeiXinOpenId,
      },
      success(resp) {
        console.log(resp);
        let r = resp.data;
        // console.log('收藏：', rd);
        if (r.status != 'success') {
          wx.showModal({
            title:'成功',
            content:r.msg,
            success:function () {
              that.setData({
                collect:0
              })
            }
          });
        }else{
          wx.showModal({
            title:'成功',
            content:resp.data.msg,
            success:function () {
              that.setData({
                collect:1
              })
            }
          });
        }
        //解析富文本
        // WxParse.wxParse("info", "html", t.data.agentInfo.intro, t);
      },
      fail() {
        wx.showModal({title: '错误', content: '网络错误'});
      }
    });
    // var e = n + "/ResourceApi/setCollect", i = {
    //   id: this.data.info.id,
    //   is_sell: this.data.info.is_sell
    // };
    // a.default.post(e, i, function(t) {}, this, {
    //   isShowLoading: !1
    // });
  },
  //房贷计算器
  tocounter: function(t) {
    var i = "../counter/counter?house_total=" + this.data.zushouList.shoujia;
    e.default.redirectTo({
      url: i
    });
  },
  //查看周边全部设施
  // lookall: function(t) {
  //   var i = "../nearby/nearby?id=" + t.currentTarget.dataset.vid;
  //   e.default.navigateTo({
  //     url: i
  //   });
  // },
  // onShareAppMessage: function() {
  //     return {
  //         title: this.data.info.house_name,
  //         desc: this.data.info.vill_cityarea_name,
  //         path: "/" + this.route + "?id=" + this.data.info.id
  //     };
  // },

  
  

  
 
  // setmark: function(t) {
  //     var i = this, a = t.currentTarget.dataset.name, o = "../nearby/nearby?id=" + i.data.vill_id + "&keyword=" + a;
  //     e.default.navigateTo({
  //         url: o
  //     });
  // },

  
  // views: function(t) {
  //     var e = n + "/ResourceApi/views", i = {
  //         id: t
  //     };
  //     a.default.get(e, i, function(t) {}, this, {
  //         isShowLoading: !1
  //     });
  // },
  // webView: function(t) {
  //     if (this.data.isAli) e.default.alert("支付宝暂不支持！"); else {
  //         var i = t.currentTarget.dataset, a = i.url, n = i.title;
  //         o.default.webView(a, n);
  //     }
  // },
  // showSwiperOrVideo: function(t) {
  //     if ("{}" != JSON.stringify(this.videoContext) && !this.data.isAli) {
  //         var e = this.data.video;
  //         e.isShow ? (this.videoContext.pause(), e.text = "视频") : (this.videoContext.play(),
  //         e.text = "轮播图"), e.isShow = !e.isShow, this.setData({
  //             video: e
  //         });
  //     }
  // }
}, templateMethods, common));