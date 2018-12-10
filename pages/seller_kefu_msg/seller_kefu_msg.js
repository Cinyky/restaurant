const app = getApp();
const templateMethods = require("../../utils/template_methods.js");
const sellerAPI = require('../../api/sellerAPI');
const kefuAPI = require('../../api/kefuAPI');
let itv = null;
Page(Object.assign({}, {
  data: {
    list: null,
    text: '',
    disableSend: true,
    msgList: [],
    loading: false,
    startId: 0,
    canSend: false,
  },
  onLoad(options) {
    this.setMenu(this);
    app.globalData.getTop();
    // 检查是否已登录
    if (wx.getStorageSync('seller_login_flag') == '') {
      wx.redirectTo({url: '/pages/sellerlogin/sellerlogin'});
    }
    console.log('进入参数', options);
    if (!options.id) {
      wx.navigateBack();
    }
    this.setData({
      id: options.id
    });
    this.loadMsg(true);
  },
  onShow() {
    let t = this;
    // 加载定时器
    itv = setInterval(function () {
      t.loadMsg();
    }, 5000);
    var a = wx.getStorageSync('navigation');
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: a.selectedColor || '#000'
    });
    t.setData({ __wechat_main_color: a.selectedColor });
  },
  onHide() {
    // 取消定时器
    console.log('清除消息刷新定时器');
    clearInterval(itv);
  },
  onUnload() {
    // 取消定时器
    console.log('清除消息刷新定时器');
    clearInterval(itv);
  },
  /**
   * 获取消息列表
   * 进入时加载所有消息
   * 轮训查询最新的消息记录
   */
  loadMsg(showLoading = false) {
    let t = this, td = this.data;
    let api = kefuAPI.getMsg;
    if (td.laoding) return false; // 判断当前加载状态
    t.setData({loading: true});  // 设置为加载中，防止重复加载
    if (showLoading) wx.showLoading({title: 'Loading...'});
    wx.request({
      url: api.url,
      method: api.method,
      data: Object.assign({}, api.data, {
        id: td.id,// 条目id
        startId: td.startId,//起始ID
        openid: app.globalData.UserInfo.WeiXinOpenId
      }),
      success(resp) {
        let rData = resp.data;
        if (rData.status == 'success') {
          let data = rData.data;
          console.log(rData);
          let _setData = {};
          let oldMsgList = td.msgList;
          let newMsgList = data.msgList;
          if (data.msgCount != 0) {
            _setData.msgList = [...oldMsgList, ...newMsgList];  // 消息列表
            _setData.startId = newMsgList[newMsgList.length - 1].id;  // 新的起始ID
            _setData.canSendCount = data.canSendCount;  // 可以发送的次数
            _setData.canSend = data.canSend;  // 可以发送的次数
            _setData.userInfo = data.userInfo;  // 对方信息
            _setData.myInfo = data.myInfo;  // 我的信息
          }
          t.setData(_setData);
        } else {
          wx.showModal({
            title: '错误',
            content: rData.msg,
            showCancel: false
          });
        }
      },
      complete() {
        wx.hideLoading();
        t.setData({loading: false});   // 清除加载状态
      }
    });
  },
  // 发送文本消息
  bindSendText(e) {
    let t = this, td = t.data;
    if (!td.text) {
      return false;
    }
    wx.showLoading({title: '发送中...'});
    // 调用接口进行文本发送
    let api = kefuAPI.sendText;
    wx.request({
      url: api.url,
      method: api.method,
      data: Object.assign({}, api.data, {
        id: td.id,
        text: td.text
      }),
      success(resp) {
        let rData = resp.data;
        let data = rData.data;
        if (rData.status == 'success') {
          // 发送成功
          // 1，清空输入框
          t.setData({
            text: ''
          });
          wx.showToast({
            title: '发送成功',
            icon: 'success'
          });
        } else {
          // 处理发送错误
          wx.showModal({
            title: '提示',
            content: rData.msg,
            showCancel: false,
          });
        }
      },
      complete() {
        // 加载消息
        t.loadMsg();
        wx.hideLoading();
      }
    });
  },
  // 发送图片消息
  bindSendImg(e) {
    let t = this, td = this.data;
    if (td.loading) return false;  // loading的时候不允许发送消息
    // 选择图片
    wx.chooseImage({
      count: 1,
      success(imgRes) {
        let imgPath = imgRes.tempFilePaths[0];
        console.log(imgPath);
        let api = kefuAPI.sendImg;
        wx.showLoading({title: '发送中...'});
        wx.uploadFile({
          url: api.url,
          filePath: imgPath,
          name: 'img',
          formData: Object.assign({}, api.data, {id: td.id}),
          success(resp) {
            let rData = JSON.parse(resp.data);
            console.log('上传结果',rData);
            if (rData.status == 'success') {
              wx.showToast({
                title: '发送成功',
                icon: 'success'
              });
            } else {
              // 处理发送错误
              wx.showModal({
                title: '提示',
                content: rData.msg,
                showCancel: false,
              });
            }
          },
          fail() {
            wx.showModal({
              title: '错误',
              content: '图片上传失败，请稍后重试'
            });
          },
          complete() {
            // 加载消息
            t.loadMsg();
            wx.hideLoading();
          }
        });
      }
    });
  },
  // 绑定文字输入
  bindTextInput(e) {
    let t = this;
    let val = e.detail.value;
    if (!val) {
      t.setData({
        text: val,
        disableSend: true
      });
    } else {
      t.setData({
        text: val,
        disableSend: false
      });
    }
  },
  // 点击图片进行预览
  bindImagePreview(e) {
    let t = this;
    let ds = e.currentTarget.dataset;
    let imgSrc = ds.src;
    console.log(imgSrc);
    wx.previewImage({
      urls: [imgSrc]
    });
  }
}, templateMethods));