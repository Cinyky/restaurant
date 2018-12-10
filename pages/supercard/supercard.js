// pages/card/card.js
const app = getApp();
const $ = require('../../utils/util.js')
const mytool = require('../../utils/myTools.js')
const api = require('../../api/supercard.js')
var templateMethods = require("../../utils/template_methods.js")
let myAudio = null;
var indexapi1 = require('../../api/zhctAPI');
var decodeDataApi = require('../../api/decodeDataAPI');

Page(Object.assign({}, {
  /**
   * 页面的初始数据
   */
  data: {
    pageData: {
      mpcode: '',
      avatar: '',
      name: '',
      job_title: '',
      cellphone: '',
      telephone: '',
      wechat: '',
      email: '',
      company: '',
      company_logo: '',
      address: '',
      viewers: {
        count: 0,
        items: []
      },
      introduction_audio: {
      },
      video_url:'',
      is_supported: false,
      support_count: '',
      introduction: '',
      tags: [],
      photos: []
    },
    phoneWithSpace: '', // 处理后带空格的手机号码
    showFold: false,
    audioData: {
      progress: '0%',
      time: '00:00',
      total: '00:00',
      playing: false
    },
    openTalk:0,
    showSharePanel: false,
    card_id:0,
  },

  /** 获取页面数据 */
  getData: function () {
    wx.showNavigationBarLoading()
    console.log(api.getSupercard.url);
    wx.request({
      url: api.getSupercard.url,
      data: Object.assign({}, {
        openid: app.globalData.UserInfo.WeiXinOpenId,
        card_id:this.card_id,
      }, api.getSupercard.data),
      method: 'POST',
      success: res => {
        if (res.data.status) {
            console.log('名片信息',res.data)
            if (res.data.data.introduction_audio && res.data.data.introduction_audio.url) {
              this.createAudio(res.data.data.introduction_audio.url)
            }
            this.setData({
            pageData: res.data.data,
            phoneWithSpace: this.formatPhone(res.data.data.phone),
            openTalk:res.data.openTalk,
          })
        } else {
          wx.showModal({
            title: '出错啦',
            content: res.message,
            showCancel: false
          })
        }
        wx.hideNavigationBarLoading()
      }
    })
  },
  /** 点赞 */
  toggleSupport: function () {
    wx.showLoading()
    wx.request({
      url: api.support.url,
      data: Object.assign({}, {
        openid: app.globalData.UserInfo.WeiXinOpenId,
        card_id:this.card_id,
        is_support:!this.data.pageData.is_supported
      }, api.getSupercard.data),
      method: 'POST',
      success: res => {
        if (res.data.success) {
          this.data.pageData.is_supported = res.data.is_support
          this.setData({
            'pageData.is_supported': res.data.is_support
          })
          this.saveEvent(8)//复制事件记录
        } else {
          wx.showModal({
            title: '出错啦',
            content: res.message,
            showCancel: false
          })
        }
        wx.hideLoading()
      }
    })
  },
  /** 点击标签 +1 */
  clickTag: function (e) {
    const index = e.currentTarget.id
    if (this.data.pageData.tags[index].my_add) return
    tags[index].count++
    tags[index].my_add = true
    this.setData({
      'pageData.tags': tags
    })
  },
  /** 展开/折叠名片信息 */
  toggleFold: function () {
    this.setData({
      showFold: !this.data.showFold
    })
  },
  /** 分享面板 */
     toggleSharePanel: function () {
        this.setData({
          showSharePanel: !this.data.showSharePanel
        })
      },
     /** 前往生成海报 */
    navToPoster: function () {
      const d = this.data.pageData
      const params = {
        avatar: encodeURIComponent(d.avatar),
        name: d.name,
        title: d.job_title,
        logo: encodeURIComponent(d.company_logo),
        phone: d.cellphone,
        wechat: d.wechat,
        address: d.address,
        mpcode: encodeURIComponent(d.mpcode)
      }
      console.log('图片参数:',params)
      if (d.tags && d.tags.length > 0) {
      for (let i = 0, len = d.tags.length; i < len; i++) {
        params[`tag${i}`] = d.tags[i].name
        if (i > 1) break
      }
    }
    this.toggleSharePanel()
    wx.navigateTo({
      url: '/pages/supercard_draw/supercard_draw?' + mytool.objToUrlParams(params)
    })
  },
  /** 复制 */
  copy: function (e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.copy,
      success: () => {
        wx.showToast({
          title: '复制成功',
          icon: 'success',
          duration: 1500
        })
        this.saveEvent(4)//复制事件记录
      }
    })
  },
  /** 拨打电话 */
  makeCall: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.msg
    })
          this.saveEvent(9)//拨打电话事件
      },
        /** 添加到联系人 */
        addPhoneContact: function () {
          if (!this.data.pageData.cellphone) return;
          wx.addPhoneContact({
            firstName: this.data.pageData.name,
            mobilePhoneNumber: this.data.pageData.cellphone,
            weChatNumber: this.data.pageData.wechat,
            organization: this.data.pageData.company,
            title: this.data.pageData.job_title,
            hostNumber: this.data.pageData.telephone,
            workAddressStreet: this.data.pageData.address,
            fail: (err) => {
              wx.showToast({
                title: '添加失败',
                icon: 'none',
                duration: 2500
        })
      },
      success: () => {
        wx.showToast({
          title: '添加成功',
          icon: 'success',
          duration: 1500
        })
        this.saveEvent(7)//保存电话
      }
    })
  },
  /** 手机号加空格 */
  formatPhone: function (num) {
    if (!num) return '';
    num = num.toString();
    return num.substring(0, 3) + ' ' + num.substring(3, 7) + ' ' + num.substring(7);
  },
  /** 创建音频组件 */
  createAudio: function (url) {
    myAudio = wx.createInnerAudioContext();
    myAudio.src = url;
    myAudio.onPlay(() => {
        this.setData({
          'audioData.playing': true
        })
    });
    myAudio.onPause(() => {
      this.setData({
        'audioData.playing': false
      })
    });
    myAudio.onStop(() => {
      this.setData({
        'audioData.playing': false
      })
    }),
    myAudio.onEnded(() => {
      this.setData({
        'audioData.playing': false,
        'audioData.time': '00:00',
        'audioData.progress': '0'
      })
    });
    myAudio.onTimeUpdate((e) => {
      const time = myAudio.currentTime;
      let total = myAudio.duration;
      let progress = 0;
      if (total) {
        progress = (time / total) * 100 + '%'
      }
      this.setData({
        'audioData.time': this.formatTime(myAudio.currentTime),
        'audioData.total': this.formatTime(myAudio.duration),
        'audioData.progress': progress
      })
    });
  },
  audioPlay: function () {
    if (!myAudio) return;
    this.data.audioData.playing ? myAudio.pause() : myAudio.play()
  },
     /** s => mm:ss */
     formatTime (time) {
       let mm = parseInt(time / 60);
       if (mm < 10) mm = '0' + mm;
       let ss = parseInt(time % 60);
       if (ss < 10) ss = '0' + ss;
       return mm + ':' + ss
     },

     /**
      * 生命周期函数--监听页面加载
      */
     onLoad: function (options) {
     var scene = decodeURIComponent(options)
     if(options.card_id == ''){
       wx.showToast({
         title: '参数错误',
         icon: 'error',
         duration: 1500
       })
       return false
     }
     this.card_id = options.card_id
     console.log('from',options.from);
     if(options.from != "undefined"){
       console.log('存储转发人信息!')
       this.saveSuperCardtoVistor(options.from);
     }else{
       this.saveSuperCardtoVistor('扫码');
     }
      app.globalData.getTop();
      this.setMenu(this);
      this.getData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.sendQiYeMessage(); //发送企业微信通知
    this.saveEvent(1)//打开事件记录
  },

   saveEvent:function(eventId){
     wx.request({
       url: api.saveCardEvent.url,
       data: Object.assign({}, {
         open_id: app.globalData.UserInfo.WeiXinOpenId,
         event_id: eventId,
         card_id:this.card_id,
       }, api.saveCardEvent.data),
       method: 'POST',
       success: res => {
         if (res.data.success) {
           console.log(res.data.msg);
         } else {
           console.log(res.data.msg);
         }
       }
     })
   },

   saveSuperCardtoVistor:function(from){
     wx.request({
       url: api.saveSuperCardtoVistor.url,
       data: Object.assign({}, {
         openid: app.globalData.UserInfo.WeiXinOpenId,
         avatar: app.globalData.UserInfo.photo,
         card_id:this.card_id,
         from:from,
       }, api.sendQiYeMessage.data),
       method: 'POST',
       success: res => {
         if (res.data.success) {
           console.log('用户名片保存成功!');
         } else {
           console.log(res.data.msg);
         }
       }
     })
   },

  //发送企业微信通知
  sendQiYeMessage:function(){
    wx.request({
      url: api.sendQiYeMessage.url,
      data: Object.assign({}, {
        userInfo: app.globalData.UserInfo,
        card_id:this.card_id,
        type:'viewcard'
      }, api.sendQiYeMessage.data),
      method: 'POST',
      success: res => {
        if (res.data.status) {
            console.log('日志发送成功!');
        } else {
            console.log('日志发送失败');
        }
      }
    })
  },

  //转发次数+1
  sharCountAdd:function(){
    wx.request({
      url: api.sharCountAdd.url,
      data: Object.assign({}, {
        card_id:this.card_id,
      }, api.sendQiYeMessage.data),
      method: 'POST',
      success: res => {
        if (res.data.success) {
          console.log('转发次数+1');
        } else {
          wx.showModal({
            title: '出错啦',
            content: '出错啦',
            showCancel: false
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: `你好，我是${this.data.pageData.company}的${this.data.pageData.job_title}${this.data.pageData.name}。这是我的名片`,
      imageUrl: this.data.pageData.avatar,
      path: `/pages/index/index?scene=supercard_${this.card_id}_${app.globalData.UserInfo.WeiXinOpenId}`,
      success: (res) => {
        this.sharCountAdd();
        this.saveEvent(5)//转发事件记录
        console.log("转发成功", res);
        var url = `/pages/index/index?scene=supercard_${this.card_id}_${app.globalData.UserInfo.WeiXinOpenId}`
        console.log("转发URL",url);
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }
  },
  getPhoneNumber: function(e){
    var apiPhone = indexapi1.AddUserPhone;
    let that = this;
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      return false;
    }
    wx.request({
      url: decodeDataApi.decodeUserData.url,
      data: Object.assign({}, {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        openid: app.globalData.UserInfo.WeiXinOpenId,
      }, decodeDataApi.decodeUserData.data),
      method: 'POST',
      dataType: 'json',
      success(resp) {
        let data = resp.data;
        console.log('解密成功', resp.data);
        let phoneNumber = data.phoneNumber;
        console.log(phoneNumber);
        console.log(apiPhone.url);
        console.log(apiPhone.data.wid);
        console.log(app.globalData.UserInfo.WeiXinOpenId);
        console.log(phoneNumber);
        wx.request({
          url: apiPhone.url,
          data: {
            wid: apiPhone.data.wid,
            openid: app.globalData.UserInfo.WeiXinOpenId,
            phonenumber: phoneNumber
          },
          method: 'POST',
          dataType: 'json',
          success: function(res) {
            console.log(res)
            wx.navigateTo({
              url: '/pages/supercard_talk/supercard_talk?card_id=' + that.data.pageData.id,
            })
          },
          fail: function(res) {
            console.log(res)
          }
        })
      },
      fail() {
        console.log('解密失败');
      }
    });
  },
  gotoMessage: function(){
    let that = this;
    wx.navigateTo({
      url: '/pages/supercard_talk/supercard_talk?card_id=' + that.data.pageData.id,
    })
  }
}, templateMethods));