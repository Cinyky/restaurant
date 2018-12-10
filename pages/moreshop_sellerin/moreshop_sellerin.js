var app             = getApp();
let moreshop_common = require('../../utils/moreshop_common');
let templateMethods = require("../../utils/template_methods.js");
let moreshopApi     = require('../../api/moreshopApi');
let WxParse         = require("../../wxParse/wxParse.js");
Page(Object.assign({}, {
  data      : {
    shopname   : '',
    logo       : '',
    logourl    : '',
    really     : [],
    certificate: [],
    //默认地点选择
    region     : ['广东省', '广州市', '海珠区']
  },
  onShow    : function (option) {
    let t = this;
    this.setMenu(this);
    app.globalData.getTop(t);
    app.GetUserInfo(function () {
      console.log("获取到的openid", app.globalData.UserInfo.WeiXinOpenId);
      t.setData({
        otheropenid: app.globalData.UserInfo.WeiXinOpenId
      });
    });
    t.reloadPage();
  },
  reloadPage: function () {
    let t   = this;
    let api = moreshopApi.getSetting;
    //获取配置信息
    wx.request({
      url    : api.url,
      data   : {
        wid: api.data.wid
      },
      method : 'POST',
      success: function (e) {
        console.log(e.data);
        t.setData({
          in_notice: e.data.in_notice,
          phone    : e.data.phone,
          ms_qq    : e.data.ms_qq,
          adminUrl : e.data.adminUrl
        });
        //解析富文本
        WxParse.wxParse("info", "html", t.data.in_notice, t);
      }
    });
  },
  
  //获取商家名称
  bindShopName: function (e) {
    console.log(e);
    this.setData({
      shopname: e.detail.value
    });
  },
  
  //获取商家电话
  bindShopPhone: function (e) {
    console.log(e);
    this.setData({
      shopphone: e.detail.value
    });
  },
  
  //获取商家qq
  bindShopQq: function (e) {
    console.log(e);
    this.setData({
      shopqq: e.detail.value
    });
  },
  
  // 上传logo
  chooseLogo : function (e) {
    var that = this;
    let api  = moreshopApi.uploadImg;
    wx.chooseImage({
      count     : 1,
      sizeType  : ['compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success   : function (resp) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          logo: resp.tempFilePaths[0]
        });
        console.log(that.data.logo);
        wx.uploadFile({
          url     : api.url,
          filePath: that.data.logo,
          name    : 'img',
          method  : 'POST',
          success : function (res) {
            let r = JSON.parse(res.data);
            console.log(r);
            var logourl = r.data;
            that.setData({logourl: logourl});
            console.log(that.data.logourl);
          }
        });
      }
    })
  },
  //显示logo
  previewLogo: function (e) {
    console.log(e);
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls   : this.data.logourl // 需要预览的图片http链接列表
    });
  },
  
  //省市区选择器
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      region: e.detail.value
    })
  },
  
  //选择经纬度
  openLocation: function () {
    let t = this;
    wx.chooseLocation({
      success: function (res) {
        var latitude  = res.latitude;
        var longitude = res.longitude;
        t.setData({
          latitude : latitude,
          longitude: longitude
        })
      }
    })
  },
  
  //获取商家详细地址
  bindShopAddr: function (e) {
    console.log(e);
    this.setData({
      shopaddr: e.detail.value
    });
  },
  
  //选择营业时间
  bindTimeChanges: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      times: e.detail.value
    })
  },
  //选择营业时间
  bindTimeChangee: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      timee: e.detail.value
    })
  },
  
  //商家实景
  chooseReally : function (e) {
    var that = this;
    let api  = moreshopApi.uploadImg;
    wx.chooseImage({
      count     : 6,
      sizeType  : ['compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success   : function (resp) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var reallyimg = resp.tempFilePaths;
        for (var i = 0; i < reallyimg.length; i++) {
          wx.uploadFile({
            url     : api.url,
            filePath: reallyimg[i],
            name    : 'img',
            method  : 'POST',
            success : function (res) {
              let r   = JSON.parse(res.data);
              let url = r.data;
              console.log('url为：', url);
              let reallyImg = that.data.really;
              for (let i = 0; i < reallyImg.length; i++) {
                if (reallyImg[i] == url) {
                  wx.showToast({title: '图片已存在'});
                  return false;
                }
              }
              reallyImg.push(url);
              that.setData({reallyImg: reallyImg});
            }
          });
        }
      }
    })
  },
  //显示实景
  previewReally: function (e) {
    wx.previewImage({
      urls: this.data.reallyImg // 需要预览的图片http链接列表
    });
  },
  
  //资质证书
  chooseCertificate : function (e) {
    var that = this;
    let api  = moreshopApi.uploadImg;
    wx.chooseImage({
      count     : 3,
      sizeType  : ['compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success   : function (resp) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var certificateimg = resp.tempFilePaths;
        for (var i = 0; i < certificateimg.length; i++) {
          wx.uploadFile({
            url     : api.url,
            filePath: certificateimg[i],
            name    : 'img',
            method  : 'POST',
            success : function (res) {
              let r   = JSON.parse(res.data);
              let url = r.data;
              console.log('url为：', url);
              let certificateImg = that.data.certificate;
              for (let i = 0; i < certificateImg.length; i++) {
                if (certificateImg[i] == url) {
                  wx.showToast({title: '图片已存在'});
                  return false;
                }
              }
              certificateImg.push(url);
              that.setData({certificateImg: certificateImg});
            }
          });
        }
      }
    })
  },
  //显示证书
  previewCertificate: function (e) {
    wx.previewImage({
      urls: this.data.certificateImg // 需要预览的图片http链接列表
    });
  },
  
  //获取提供服务
  bindShopProvide: function (e) {
    console.log(e);
    this.setData({
      shopprovide: e.detail.value
    });
  },
  
  //提交
  bindSub: function () {
    let t = this;
    console.log('商户名称', this.data.shopname);
    console.log('商户电话', this.data.shopphone);
    console.log('商户QQ', this.data.shopqq);
    console.log('商户logo', this.data.logourl);
    console.log('商户地址', this.data.region);
    console.log('商家坐标', this.data.latitude, '-', this.data.longitude);
    console.log('详细地址', this.data.shopaddr);
    console.log('营业时间', this.data.times, '-', this.data.timee);
    console.log('商家实景', this.data.reallyImg);
    console.log('资质证书', this.data.certificateImg);
    console.log('提供服务', this.data.shopprovide);
    let api = moreshopApi.getSellerin;
    wx.request({
      url    : api.url,
      data   : {
        wid           : api.data.wid,
        openid        : t.data.otheropenid,
        shop_name     : t.data.shopname,
        iphone        : t.data.shopphone,
        logo          : t.data.logourl,
        qq            : t.data.shopqq,
        address       : t.data.region,
        detailaddr    : t.data.shopaddr,
        stime         : t.data.times,
        etime         : t.data.timee,
        really_pic    : t.data.reallyImg,
        lat           : t.data.latitude,
        lng           : t.data.longitude,
        certificateImg: t.data.certificateImg,
        shopprovide   : t.data.shopprovide
      },
      method : "POST",
      success: function (e) {
        console.log(e.data);
        if (e.data.status == 'success') {
          wx.showModal({
            title     : '成功',
            content   : e.data.msg,
            showCancel: 0,
            success   : function () {
              wx.navigateTo({
                url: "/pages/moreshop_index/moreshop_index"
              });
            }
          })
        } else if (e.data.status == 'error') {
          wx.showModal({
            title     : '失败',
            content   : e.data.msg,
            showCancel: 0
          });
        }
      }
    });
  }
}, templateMethods, moreshop_common));