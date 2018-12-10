var app = getApp(),
  $ = require("../../utils/util.js"),
  api = require("../../api/indexAPI.js"),
  notice = require("../../utils/notice.js"),
  userapi = require("../../api/userAPI.js"),
  activityapi = require("../../api/bespeakivityAPI.js");
var templateMethods = require("../../utils/template_methods.js");
var adFirstAPI = require("../../api/adFirstAPI.js");
var shareAPI = require("../../api/shareAPI");
let mt = require("../../utils/myTools");
Page(Object.assign({}, templateMethods, {
  data: {
    loadingGIF_width_h: 0,
    loadingGIF_height_h: 0,
    indexArray: [],
    remark: "",
    remarkLength: 0,
    wechat_id: "",
    Email: "",
    platform: "",
    VendorInfo: getApp().globalData.VendorInfo,
    AdInfo: getApp().globalData.AdInfo,
    show_share_modal: false,
    markers: [{
      iconPath: '../../assets/others.png',
      latitude: '',
      longitude: '',
      width: 28,
      height: 28
    }],
    mask: false,
    // flag:false,
    musicHandle: {},
    textM: 0,
    textW: 0,
    textL: 50,
    Notice_showData: false,
    ServiceContent: {
      array: [],
      index: 0,
      content: '',
      cidContent: ""
    },
    ServicePersonal: {
      array: [],
      index: 0,
      content: '',
    },
    onlinebookingData: {
      date_h: '2018-09-01',
    },
    testcc:true
  },
  onLoad(e) {
    this.setData({
      tempE: e
    });
    let t = this;
    let api2 = api.GetIndexAnimation;
    console.log(api2);
    wx.request({
      url: api2.url,
      data: {
        wid: api2.postData.wid,
      },
      method: 'POST',
      success: function(res) {
        console.log(res.data.data);
        t.setData({
          gifAnimation_h: res.data.data
        })
      }
    });
    let api3 = api.GetIndexKeyWords;
    console.log(api3);
    wx.request({
      url: api3.url,
      data: {
        wid: api3.postData.wid,
      },
      method: 'POST',
      success: function(res) {
        console.log(res.data.data);
        app.globalData.editData_h = res.data.data;
      }
    });
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        let latitude = res.latitude;
        let longitude = res.longitude;
        app.globalData.latitude_H = res.latitude;
        app.globalData.longitude_H = res.longitude;
        console.log(app.globalData)
        t.setData({
          latitude_H: latitude,
          longitude_H: longitude
        })
      }
    })
  },
  onShow: function() {
    console.log(this.data);
    var that = this;
    let e = this.data.tempE;
    console.log('index进入参数', e);
    var onlinebooking_StorageSync_h = wx.getStorageSync('onlinebooking_StorageSync');
    console.log(onlinebooking_StorageSync_h);
    let ServiceContentArray = 'ServiceContent.array';
    let ServicePersonalArray = 'ServicePersonal.array';
    let onlinebookingData_Cid = 'onlinebookingData.cid';
    let ServiceContentArray_Cid = 'ServiceContent.cid';
    if (!that.data.onlinebookingData.cid) {
      that.setData({
        [ServiceContentArray]: onlinebooking_StorageSync_h.Service_ContentArray,
        [ServicePersonalArray]: onlinebooking_StorageSync_h.Service_PersonalArray,
        [ServiceContentArray_Cid]: onlinebooking_StorageSync_h.Service_ContentCidArray,
      });
    }
    var index_textN_h = wx.getStorageSync('index_textN');
    if (index_textN_h != "") {
      that.setData({
        textN: index_textN_h
      });
      let textM = 20;
      //获取屏幕宽度的封装方法
      let phoneWidth = wx.getSystemInfoSync().windowWidth;
      //文字宽度=文字长度+字体大小
      let textW = parseInt(Number(that.data.textN.length) * 12);
      that.setData({
        textW: textW,
        textL: phoneWidth
      });
      if (phoneWidth > textW) {
        let centerL = 0
        that.setData({
          textL: centerL
        });
      } else {
        let textTime = setInterval(function() {
          let textL = that.data.textL;
          if (textL < -(textW - 20)) {
            that.setData({
              textL: phoneWidth
            })
            return
          }
          textL -= 2;
          that.setData({
            textL: textL
          })
        }, 30)
      }
    }
    if (e.scene && e.scene.split('_')[0] == 'zhct') {
      console.log('跳转智慧餐厅');
      let table_id = e.scene.split('_')[1];
      e.scene = null;
      that.zhct_goto_dc(table_id);
    }
    console.log(e);
    if (e.scene && e.scene.split('_')[0] == 'user') {
      e.uid = e.scene.split('_')[1];
    }
    app.GetUserInfo(function() {
          console.log(app.globalData.VendorInfo);
          that.initData();
          var vdata = {
            lat: that.data.latitude_H,
            lng: that.data.longitude_H
          };
        if (that.data.tempE.scene && that.data.tempE.scene.split('_')[0] == 'supercard') {
          console.log('跳转超级名片');
          let card_id = that.data.tempE.scene.split('_')[1];
          let from_openid = that.data.tempE.scene.split('_')[2];
          that.data.tempE.scene = null;
          that.supercard_detail(card_id, from_openid);
        }
        console.log(vdata);
          $.xsr($.makeUrl(api.GetIndexData, vdata),
            function(res) {
              that.setData({
                mask: true
              });
              console.log('首页数据', res.dataList);
              // 处理音乐组件
              if (app.globalData.loadMusic) {
                let indexArray = res.dataList.indexArray;
                let handles = {};
                for (let i = 0; i < indexArray.length; ++i) {
                  let item = indexArray[i];
                  if (item.name == 'music') {
                    const handle = {
                      curr_time: '00:00:00',
                      total_time: '00:00:00',
                      is_play: item.auto == 1,
                    };
                    const ac = wx.createInnerAudioContext();
                    ac.autoplay = item.auto == 1;
                    ac.src = item.url;
                    ac.loop = true;
                    ac.id = item.id;
                    ac.onPlay(() => {
                      console.log('开始播放');
                    });
                    handle.ac = ac;
                    handles[item.id] = handle;
                  }
                  if (item.name == 'text_02') {
                    wx.setStorageSync('index_textN', item.content);
                    that.setData({
                      textN: item.content
                    });
                    let textM = 20;
                    //获取屏幕宽度的封装方法
                    let phoneWidth = wx.getSystemInfoSync().windowWidth;
                    //文字宽度=文字长度+字体大小
                    let textW = parseInt(Number(that.data.textN.length) * 12);
                    that.setData({
                      textW: textW,
                      textL: phoneWidth
                    });
                    if (phoneWidth > textW) {
                      let centerL = 0
                      that.setData({
                        textL: centerL
                      });
                    } else {
                      let textTime = setInterval(function() {
                        let textL = that.data.textL;
                        if (textL < -(textW - 20)) {
                          that.setData({
                            textL: phoneWidth
                          })
                          return
                        }
                        textL -= 2;
                        that.setData({
                          textL: textL
                        })
                      }, 30)
                    }
                  };
                  if (item.name == 'onlinebooking') {
                    if(item.bespeak.length >= 1){
                      let ServiceContentArray = 'ServiceContent.array';
                      let ServiceContentCidArray = 'ServiceContent.cid';
                      let ServiceContentcidContent = 'ServiceContent.cidContent';
                      let ServiceContentcid = [];
                      let ServiceContent = [];
                      let ServicePersonalArray = 'ServicePersonal.array';
                      let ServicePersonal = [];
                      let onlinebookingData_Cid = 'onlinebookingData.cid'
                      for (let i = 0; i < item.bespeak.length; i++) {
                        // console.log(item.bespeak[i].title);
                        ServiceContent[i] = item.bespeak[i].title
                        ServiceContentcid[i] = item.bespeak[i].cid
                      }
                      for (let j = 0; j < item.service.length; j++) {
                        // console.log(item.service[j].title);
                        ServicePersonal[j] = item.service[j].title
                      }
                      let onlinebooking_StorageSync = {
                        Service_ContentArray: ServiceContent,
                        Service_PersonalArray: ServicePersonal,
                        Service_ContentCidArray: ServiceContentcid,
                      }
                      console.log(item.bespeak[0].cid);
                      console.log(onlinebooking_StorageSync);
                      wx.setStorageSync('onlinebooking_StorageSync', onlinebooking_StorageSync);
                      that.setData({
                        [ServiceContentArray]: ServiceContent,
                        [ServiceContentCidArray]: ServiceContentcid,
                        [ServicePersonalArray]: ServicePersonal,
                        [ServiceContentcidContent]: item.bespeak[0].cid
                      })
                      console.log(that.data);
                    }
                  }
                }
                that.setData({
                  musicHandle: handles
                });
                setInterval(function() {
                  let mh = this.data.musicHandle;
                  for (let id in mh) {
                    if (mh.hasOwnProperty(id)) {
                      let item = mh[id];
                      if (!item.is_play)
                        continue;
                      mh[id].curr_time = mt.secondsToTime(item.ac.currentTime);
                      mh[id].total_time = mt.secondsToTime(item.ac.duration);
                    }
                  }
                  this.setData({
                    musicHandle: mh
                  });
                }.bind(that), 1000);
              }
              app.globalData.loadMusic = false;
              //--------------------
              app.globalData.setTop(res.dataList.indexArray);
              app.globalData.getTop(that);
              console.log(res.dataList.indexArray);
              that.setMenu(that);
              if (res.dataList.indexArray[app.globalData.lookup(res.dataList.indexArray, 'map')]) {
                that.setData({
                  markers: [{
                    iconPath: '../../assets/others.png',
                    latitude: res.dataList.indexArray[app.globalData.lookup(res.dataList.indexArray, 'map')].lat,
                    longitude: res.dataList.indexArray[app.globalData.lookup(res.dataList.indexArray, 'map')].lng,
                    width: 28,
                    height: 28
                  }]
                });
              }
              that.setData({
                  indexArray: res.dataList.indexArray

                }),
                wx.setStorageSync('copyright', res.dataList.copyright);
              var copyright = wx.getStorageSync('copyright');
              //广告数据
              var AdInfo = app.globalData.AdInfo;
              that.setData({
                copyright: copyright,
                AdInfo: AdInfo
              });

              wx.setNavigationBarTitle({
                title: res.dataList.ShopName
              });
            });
        },
        e.uid, e.sid),
      notice.addNotification("RefreshProduct", that.RefreshProduct, that);
    this.setData({
      Email: ""
    });
    try {
      e = wx.getSystemInfoSync();
      this.setData({
        platform: e.platform
      });
    } catch (t) {
      console.log(t);
    }

    // wx.getStorage({
    //   key: 'navigation',
    //   success: function (res) {
    //     console.log(res.data)
    //     wx.setNavigationBarColor({
    //       frontColor: '#ffffff',
    //       backgroundColor: res.data.selectedColor
    //     })
    //   }
    // })
    let api3 = api.GetIndexKeyWords;
    console.log(api3);
    wx.request({
      url: api3.url,
      data: {
        wid: api3.postData.wid,
      },
      method: 'POST',
      success: function(res) {
        console.log(res.data.data);
        that.setData({
          editData_h: res.data.data
        });
      }
    });
    console.log(this.data);
  },
  initData: function() {
    var that = this;
    wx.setNavigationBarTitle({
      title: app.globalData.VendorInfo.ShopName
    });
  },
  onShareAppMessage: function() {
    var t = this;
    //分享得券
    return {
      title: app.globalData.VendorInfo.ShopName,
      desc: app.globalData.VendorInfo.VendorInfo,
      path: "/pages/index/index?uid=" + app.globalData.UserInfo.Id,
      success: function() {
        //判断是否开启分享获取优惠券功能
        let api2 = shareAPI.getIsOpen;
        wx.request({
          url: api2.url,
          method: 'POST',
          data: {
            wid: api2.data.wid,
            openid: app.globalData.UserInfo.WeiXinOpenId
          },
          success: function(e) {
            console.log(e.data.data);
            t.setData({
              is_open: e.data.data
            });
            if (t.data.is_open == 1) {
              t.bindShareModalSubmit();
            } else {
              console.log('没有开启该功能哦！');
            }
          }
        });
        console.log('我已经分享啦~等待判断是否开启功能中。。。');
      }
    };
  },
  bindShareModalSubmit(e) {
    wx.showLoading({
      title: '请稍等',
    });
    // console.log(e);
    // let formId = e.detail.formId;
    // if (!formId) return;
    let t = this;
    const api2 = shareAPI.shareToCoupon;
    wx.request({
      url: api2.url,
      data: {
        wid: api2.data.wid,
        openid: app.globalData.UserInfo.WeiXinOpenId,
        // formId: formId,
      },
      method: 'POST',
      success: function(res) {
        console.log(res.data.msg);
        // let rData = res.data;
        // let data = rData.data;
        // console.log(res);
        // if (rData.status != 'success') {
        //   t.setData({
        //     show_share_modal: false
        //   });
        //   wx.showModal({
        //     title: '领取失败',
        //     content: rData.msg,
        //     showCancel: false,
        //     success() {
        //     }
        //   });
        // } else {
        //   //成功
        //   t.setData({
        //     show_share_modal: false
        //   });
        //   wx.showModal({
        //     title: '分享成功',
        //     content: rData.msg,
        //     showCancel: false,
        //     success() {
        //       wx.navigateTo({
        //         url: '/pages/usercoupon/usercoupon'
        //       });
        //     }
        //   });
        // }
      },
      complete: function() {
        wx.hideLoading();
      }
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
  closeAd: function() {
    this.setData({
      flag: 'none'
    });
  },
  //遮罩层滚动穿透问题
  move: function() {},
  picUrl: function() {
    wx.navigateTo({
      url: app.globalData.AdInfo.url
    });
  },
  bindloadrImg: function(e) {
    console.log(e.detail);
    let width_rpx = e.detail.width * 2;
    let height_rpx = e.detail.width * 2;
    this.setData({
      loadingGIF_width_h: width_rpx,
      loadingGIF_height_h: height_rpx,
    });
  },
  //点击广告获取优惠券
  coupon: function() {
    let t = this;
    const api2 = adFirstAPI.getCoupon;
    wx.request({
      url: api2.url,
      data: {
        wid: api2.data.wid,
        openid: app.globalData.UserInfo.WeiXinOpenId,
        couponId: app.globalData.AdInfo.coupon_id,
        toUrl: app.globalData.AdInfo.url
      },
      method: 'POST',
      success(resp) {
        let rData = resp.data;
        let data = rData.data;
        console.log(data);
        if (rData.status != 'success') {
          //后台返回error
          wx.showModal({
            title: '错误',
            content: rData.msg,
            showCancel: false,
            success() {
              wx.navigateBack();
            }
          });
        } else {
          wx.navigateTo({
            url: data
          });
        }
      }
    });
  },
  btn_close_coupon() {
    this.setData({
      show_share_modal: false
    });
  },
  zhct_goto_ct() {
    // 跳转到餐厅首页
    wx.navigateTo({
      url: '/pages/zhct_index/zhct_index'
    });
  },
  zhct_goto_dc(table_id) {
    //扫码dc
    wx.navigateTo({
      url: '/pages/zhct_main/zhct_main?type=0&tableId=' + table_id
    });
  },
  supercard_detail(card_id, from_openid) {
    //超级名片
    wx.navigateTo({
      url: '/pages/supercard/supercard?card_id=' + card_id + '&from=' + from_openid
    });
  },
  zhct_goto_wm() {
    // 跳转到wm
    wx.navigateTo({
      url: '/pages/zhct_main/zhct_main?type=1'
    });
  },
  bindMusicControl(e) {
    let t = this,
      td = t.data,
      ds = e.currentTarget.dataset,
      id = ds.id,
      mh = td.musicHandle;
    if (mh[id].is_play) {
      mh[id].ac.pause();
      mh[id].is_play = false;
    } else {
      mh[id].ac.play();
      mh[id].is_play = true;
    }
    t.setData({
      musicHandle: mh
    });
  },
  Notice_h: function(e) {
    this.setData({
      Notice_fixedContent: e.currentTarget.dataset.textcontent,
      Notice_showData: true
    });
  },
  Notice_hide: function() {
    this.setData({
      Notice_showData: false
    });
  },
  bindPickerChange_ServiceContent: function(e) {
    let that = this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let ServiceContentIndex = 'ServiceContent.index';
    let ServiceContentContent = 'ServiceContent.content';
    let ServiceContentcidContent = 'ServiceContent.cidContent';
    this.setData({
      [ServiceContentIndex]: e.detail.value,
      [ServiceContentContent]: this.data.ServiceContent.array[e.detail.value],
      [ServiceContentcidContent]: this.data.ServiceContent.cid[e.detail.value],
    })
    console.log(this.data);
  },
  bindPickerChange_ServicePersonal: function(e) {
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
  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let onlinebookingData_date = 'onlinebookingData.date_h';
    this.setData({
      [onlinebookingData_date]: e.detail.value
    })
    console.log(this.data)
  },
  getOnlinebooking_Name: function(e) {
    console.log(e.detail.value);
    let onlinebookingData_name = 'onlinebookingData.Name';
    this.setData({
      [onlinebookingData_name]: e.detail.value
    });
  },
  getOnlinebooking_phone: function(e) {
    console.log(e.detail.value);
    let onlinebookingData_phone = 'onlinebookingData.Phone';
    this.setData({
      [onlinebookingData_phone]: e.detail.value
    });
  },
  getOnlinebooking_submit: function() {
    let t = this,
      td = t.data;
    console.log(td)
    console.log('预约服务:' + td.ServiceContent.array[td.ServiceContent.index]);
    console.log('服务人员:' + td.ServicePersonal.array[td.ServicePersonal.index]);
    console.log('预约时间:' + td.onlinebookingData.date_h);
    console.log('姓名:' + td.onlinebookingData.Name);
    console.log('电话:' + td.onlinebookingData.Phone);
    console.log('cid:' + td.ServiceContent.cid[td.ServiceContent.index]);
    console.log('platform:' + td.platform);
    if (!td.onlinebookingData.Name) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      })
      return;
    }
    let reg = /^1[3|4|5|6|7|8][0-9]{9}$/;
    let flag = reg.test(td.onlinebookingData.Phone);
    console.log(flag);
    if (!td.onlinebookingData.Phone) {
      wx.showToast({
        title: '请输入手机',
        icon: 'none'
      })
      return;
    }
    if (!flag) {
      wx.showToast({
        title: '请输入正确的手机号',
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
      cid: td.ServiceContent.cid[td.ServiceContent.index],
      openId: app.globalData.UserInfo.WeiXinOpenId
    };
    $.xsr($.makeUrl(userapi.AddMiniFkSuggestion, e), function(e) {
      console.log(userapi.AddMiniFkSuggestion), e.errcode == 0 ? ($.alert("提交成功！"), setTimeout(function() {
        $.backpage(1, function() {})
      }, 1e3)) : $.alert(e.errmsg)
    })
  },
  imgHeight: function(e) {
    console.log(this.data.testcc);
    if (this.data.testcc){
      this.setData({
        testcc: false
      })
      console.log(e);
      var winWid = wx.getSystemInfoSync().windowWidth; //获取当前屏幕的宽度
      var imgh = e.detail.height;//图片高度
      var imgw = e.detail.width;//图片宽度
      var swiperH = winWid * imgh / imgw + "px"//等比设置swiper的高度。 即 屏幕宽度 / swiper高度 = 图片宽度 / 图片高度  ==》swiper高度 = 屏幕宽度 * 图片高度 / 图片宽度
      this.setData({
        swiperHeight: swiperH//设置高度
      })
    }
  }
}));