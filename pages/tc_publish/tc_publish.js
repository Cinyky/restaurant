var app = getApp();
let myTools = require('../../utils/myTools');
let templateMethods = require("../../utils/template_methods.js");
let tc_common = require('../../utils/tc_common');
let tcApi = require('../../api/tcApi');
Page(Object.assign({}, {
  /**
   * 页面的初始数据
   */
  data: {
    is_top: 0,
    latitude: null,
    longitude: null,
    address: null,
    img: [],
    content: "",
  },
  onLoad: function (option) {
    let t = this, ts = t.data;
    this.setMenu(this);
    app.globalData.getTop(t);
    t.setData({cate_id: option.id});
    t.loadSetting();
    t.loadCate(option.id);
  },
  onIsTopChange: function (e) {
    let t = this, td = t.data;
    this.setData({
      is_top: e.detail.value ? 1 : 0,
      top_time: td.setting.top_setting[0]['top_time'],
      top_money: td.setting.top_setting[0]['top_money']
    });
  },
  bindInputContent(e) {
    let t = this, val = e.detail.value;
    t.setData({content: val});
  },
  bindSelectAddress() {
    let t = this, td = t.data;
    wx.chooseLocation({
      success: function (res) {
        console.log(res);
        var latitude = res.latitude;
        var longitude = res.longitude;
        var address = res.address;
        t.setData({
          latitude: latitude,
          longitude: longitude,
          address: address
        });
      }, fail(e) {
        console.log(e);
        if (e.errMsg == 'chooseLocation:fail auth deny') {
          wx.showModal({
            title: '错误', content: '请授权位置信息', success(s) {
              if (s.confirm) {
                wx.openSetting();
              }
            }
          });
        }
      }
    });
  },
  bindSelectTopTime(e) {
    let t = this, td = t.data, idx = e.detail.value;
    t.setData({
      top_time: td.setting.top_setting[idx]['top_time'],
      top_money: td.setting.top_setting[idx]['top_money']
    });
  },
  bindSelectImg(e) {
    let t = this, api = tcApi.uploadImg;
    if (t.data.img.length >= 3) {
      wx.showToast({title: '最多3张图片'});
      return false;
    }
    wx.chooseImage({
      count: 3, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log(res);
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var imgSrc = res.tempFilePaths;
          for (var i = 0; i < imgSrc.length; i++) {
            wx.uploadFile({
            url: api.url,
            filePath: imgSrc[i],
            name: 'img',
            method: 'post',
            success: function (resp) {
              let r = JSON.parse(resp.data), url = r.data;
              console.log(url);
              let imgList = t.data.img;
              for (let i = 0; i < imgList.length; i++) {
                if (imgList[i] == url) {
                  wx.showToast({title: '图片已存在'});
                  return false;
                }
              }
              imgList.push(url);
              t.setData({img: imgList});
            },
            fail: function () {
              wx.showToast({
                title: '图片上传失败'
              });
            }
          });
        }
      }
    });
  },
  bindDeleteImg(e) {
    let t = this, idx = e.currentTarget.dataset.index;
    let imgList = t.data.img;
    imgList.splice(idx, 1);
    t.setData({img: imgList});
  },
  bindPreviewImg(e) {
    let t = this, idx = e.currentTarget.dataset.index;
    let imgList = t.data.img;
    wx.previewImage({urls: [imgList[idx]]});
  },
  bindPublish(e) {
    let t = this, td = t.data;
    // 判断
    if (td.content == "") {
      wx.showToast({title: '请输入内容', mask: 1});
      return false;
    }
    if (!td.address || !td.latitude || !td.longitude) {
      wx.showToast({title: '请重新选择地址', mask: 1});
      return false;
    }
    // 请求
    let api = tcApi.submitMsg;
    wx.request({
      url: api.url,
      method: api.method,
      data: {
        wid: api.data.wid,
        openid: app.globalData.UserInfo.WeiXinOpenId,
        cate_id: td.cate_id,
        content: td.content,
        img: td.img,
        lat: td.latitude,
        lng: td.longitude,
        address: td.address,
        is_top: td.is_top,
        top_time: td.top_time,
      }, success(resp) {
        let r = resp.data, rd = r.data;
        if (r.status == 'success') {
          // 判断是否需要支付
          if (rd.need_pay) {
            // 需要支付则调起支付（支付完成之后跳转）
            console.log('调起支付');
            t.doPayment(rd.pay_params);
          } else {
            // 不需要支付则调起跳转
            console.log('直接跳转');
            t.doRedirectToMyPublish();
          }
        } else {
          // 给出错误提示
          console.log('出错了');
          wx.showModal({title: '错误', content: r.msg || '未知错误', showCancel: false});
        }
      }
    });
  },
  // 调起支付
  doPayment(payParams) {
    let t = this;
    payParams.success = function () {
      wx.showModal({
        title: '成功',
        content: '支付成功',
        showCancel: 0,
        success() {
          t.doRedirectToMyPublish();
        }
      });
    };
    payParams.fail = function () {
      wx.showModal({
        title: '失败',
        content: '支付未完成，请稍后重新支付',
        showCancel: 0,
        success() {
          t.doRedirectToMyPublish();
        }
      });
    };
    wx.requestPayment(payParams);
  },
  // 跳转到·我的信息·页面
  doRedirectToMyPublish() {
    wx.navigateTo({url: '/pages/tc_lists/tc_lists?type=my&show_pay_btn=1'});
  }
}, templateMethods, tc_common));