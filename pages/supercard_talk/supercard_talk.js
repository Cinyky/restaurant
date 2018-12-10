//index.js
//获取应用实例
const app = getApp();
const api = require('../../api/supercard.js');
var webim = require('../../utils/webim_wx.js');
var webimhandler = require('../../utils/webim_handler.js');

global.webim = webim;
var Config = {
  sdkappid: 1400134349
  , accountType: 36909
  , accountMode: 0 //帐号模式，0-表示独立模式，1-表示托管模式
};

let msgInput = ''
let getPrePageC2CHistroyMsgInfoMap = {}
const reqMsgCount = 15
const emojis = ['😀', '😁', '🤣', '😃', '😄', '😅', '😆', '😉', '😊', '😋', '😎', '😍', '😘', '😗', '😙', '😚', '🙂', '🤗', '🤩', '🤔', '🤨', '😐', '😑', '😶', '🙄', '😏', '😣', '😥', '😮', '🤐', '😯', '😪', '😫', '😴', '😌', '😛 ']
let sending = false
let pulling = false

Page({
  data:{
    motto: 'Hello World',
    userInfo: {},
    msgs: [],
    Identifier: null,
    UserSig: null,
    msgContent: "",
    card_id:'',
    card_info:{},
    masterInfo: {
      cellphone: '12345678',
      wechat: 'hahahahah',
      photo: '放头像?'
    },
    sendTo:'',
    is_send:false,
    selSess:null,
    emojis: emojis,
    showEmojis: false,
    showSendBtn: false
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

  /** 拨打我的电话 */
  callUp: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.masterInfo.cellphone
    })
    this.saveEvent(9)//复制事件记录
  },
  /** 添加我的微信 */
  addWechat: function () {
    wx.showModal({
      title: '微信：',
      content: this.data.masterInfo.wechat,
      showCancel: false,
      confirmText: '复制',
      success: () => {
        wx.setClipboardData({
          data: this.data.masterInfo.wechat,
          success: () => {
            this.saveEvent(4)//复制事件记录
            wx.showToast({title: '已复制微信'})
          }
        })
      }
    })
  },
  /** 选择图片 */
  choosePic: function () {
    wx.chooseImage({
      count: 1,
      success: ret => {
        console.log('已经选择图片了!',ret.tempFilePaths.length);
        if (ret.tempFilePaths.length > 0) {
          this.uploadPic(ret.tempFiles[0])
          this.receiveMsgs({
            'fromAccountNick': app.globalData.UserInfo.NickName,
            'fromAccountAvatar': app.globalData.UserInfo.photo,
            'content': '',
            // 'elems': resp ? resp.elems : null,
            'type': 'user',
            elems: [
              { type: 'IMAGE', data: [ret.tempFilePaths[0], ret.tempFilePaths[0], ret.tempFilePaths[0]]}
            ],
            isSend: true,
            time: webim.Tool.formatTimeStamp(+new Date())
          })
        }
      }
    })
  },
  /** 上传图片 */
  uploadPic: function (file) {
    let that = this
    wx.uploadFile({
      url: api.saveTalkImage.url,
      filePath: file.path,
      name: 'pic',
      formData:Object.assign({}, {
        from:that.data.Identifier, //当前用户ID,必须是否字符串类型，选填
        selToID: that.data.sendTo
      }, api.saveTalkImage.data),
      success: res => {

      }
    })
  },
  /** 显示/隐藏 表情面板 */
  toggleEmojis: function () {
    this.setData({
      showEmojis: !this.data.showEmojis
    })
  },
  /** 点击表情 */
  emojiClick: function (e) {
    const i = e.currentTarget.dataset.index
    console.log(i)
    if (i !== undefined) {
      msgInput += emojis[i]
      this.setData({
        msgContent: msgInput,
        showSendBtn: true
      })
    }
  },
  /** 输入表单相关操作 */
  clearInput: function () {
    this.setData({
      msgContent: "",
      showSendBtn: false
    });
    msgInput = ''
  },
  bindFocus: function () {
    if (this.data.showEmojis) this.toggleEmojis()
  },
  bindInput: function (e) {
    msgInput = e.detail.value
    if (msgInput && !this.data.showSendBtn) {
      this.setData({
        showSendBtn: true
      })
    } else if (!msgInput && this.data.showSendBtn) {
      this.setData({
        showSendBtn: false
      })
    }
  },
  bindConfirm: function (e) {
    var that = this
    if (sending) return
    // console.log('form发生了submit事件，携带数据为：', msgInput)
    // 1. 获取输入框内容  2.判断内容是否为空  3.发送内容，清空输入框内容
    var content = msgInput
    if(!content.replace(/^\s*|\s*$/g,'')) return ;
    sending = true
    wx.showNavigationBarLoading()
    webimhandler.onSendMsg(content,(resp) => {
      sending = false
      if (this.data.showEmojis) this.toggleEmojis()
      wx.hideNavigationBarLoading()
      // 发送成功
      that.clearInput(); // 清空输入框
      //渲染
      that.receiveMsgs({
        'fromAccountNick': app.globalData.UserInfo.NickName,
        'fromAccountAvatar':app.globalData.UserInfo.photo,
        'content':content,
        // 'elems': resp ? resp.elems : null,
        'type':'user',
        isSend: true
      })
      //企业微信提示
      if(!that.is_send){
        that.sendQiYeMessage(content)
      }
    })
  },

  //发送企业微信通知
  sendQiYeMessage:function(){
    var that = this
    wx.request({
      url: api.sendQiYeMessage.url,
      data: Object.assign({}, {
        userInfo: app.globalData.UserInfo,
        card_id:this.card_id,
        type:'talk',
      }, api.sendQiYeMessage.data),
      method: 'POST',
      success: res => {
        if (res.data.status) {
          console.log('日志发送成功!');
          that.is_send = true
        } else {
          wx.showModal({
            title: '出错啦',
            content: '啊哈哈哈哈',
            showCancel: false
          })
        }
      }
    })
  },


  receiveMsgs: function (data) {
    var msgs = this.data.msgs || [];
    msgs.push(data);
    //最多展示10条信息
    // if (msgs.length > 10) {
    //   msgs.splice(0, msgs.length - 10);
    // }
    this.setData({
      msgs: msgs
    }, () => {
      wx.pageScrollTo({scrollTop: 9999999})
    });
  },

  initIM: function (userInfo) {
      var that = this;
      webimhandler.init({
        accountMode: Config.accountMode
        , accountType: Config.accountType
        , sdkAppID: Config.sdkappid
        , selType: webim.SESSION_TYPE.C2C
        , selToID: that.data.sendTo
        , selSess: null //当前聊天会话
        , that:that
      });
    //当前用户身份
    var loginInfo = {
      'sdkAppID': Config.sdkappid, //用户所属应用id,必填
      'appIDAt3rd': Config.sdkappid, //用户所属应用id，必填
      'accountType': Config.accountType, //用户所属应用帐号类型，必填
      'identifier': that.data.Identifier, //当前用户ID,必须是否字符串类型，选填
      'identifierNick': userInfo.NickName, //当前用户昵称，选填
      'userSig': that.data.UserSig, //当前用户身份凭证，必须是字符串类型，选填
      'avatar':userInfo.photo
    };


    //监听连接状态回调变化事件
    var onConnNotify = function (resp) {
      switch (resp.ErrorCode) {
        case webim.CONNECTION_STATUS.ON:
          webim.Log.warn('连接状态正常...');
          break;
        case webim.CONNECTION_STATUS.OFF:
          webim.Log.warn('连接已断开，无法收到新消息，请检查下你的网络是否正常');
          break;
        default:
          webim.Log.error('未知连接状态,status=' + resp.ErrorCode);
          break;
      }
    };


    var onMsgNotify = (newMsgList) => {
      this.setData({
        msgs: this.data.msgs.concat(this.formatMsgs(newMsgList))
      }, () => {
        wx.pageScrollTo({ scrollTop: 9999999 })
      })
      // var sess, newMsg;
      //获取所有聊天会话
      // var sessMap = webim.MsgStore.sessMap();
      // for (var j in newMsgList) {//遍历新消息
      //   newMsg = newMsgList[j];
      //   if (newMsg.getSession().id() == that.data.sendTo) {//为当前聊天对象的消息
      //     //that.data.selSess = newMsg.getSession();
      //     var msg = webimhandler.convertMsgtoHtml(newMsg)
      //     // console.log('收到的信息是',msg)
      //     console.log('msgs',that.data.msgs)
      //     that.data.msgs.push({
      //       'fromAccountNick':'管理员',
      //       'content':msg,
      //       'type':'system'
      //     });
      //     that.setData({msgs:that.data.msgs})
      //     // console.log('msgs',that.data.msgs)
      //   }
      // }
      //消息已读上报，以及设置会话自动已读标记
      webim.setAutoRead(that.selSess, true, true);
    };

    //监听事件
    var listeners = {
      "onConnNotify": onConnNotify, //监听连接状态回调变化事件
      //监听新消息(私聊(包括普通消息和全员推送消息)，普通群(非直播聊天室)消息)事件，必填
      "onMsgNotify":onMsgNotify
    };
    //其他对象，选填
    var options = {
      'isAccessFormalEnv': true, //是否访问正式环境，默认访问正式，选填
      'isLogOn': true //是否开启控制台打印日志,默认开启，选填
      // emotions: {}
    };
    if (Config.accountMode == 1) {//托管模式
      webimhandler.sdkLogin(loginInfo, listeners, options, avChatRoomId);
    } else {//独立模式
      //sdk登录
      webimhandler.sdkLogin(loginInfo, listeners, options, null, e => {
        // console.log('登录成功', e)
        this.getLastC2CHistoryMsgs(res => {
          this.setData({
            msgs: this.data.msgs.concat(this.formatMsgs(res))
          }, () => {
            wx.pageScrollTo({ scrollTop: 9999999 })
          })
        }, err => {
          console.error('历史消息获取失败', err)
        })
      }, err => {
        console.log('登录失败', err)
      });
      
      // var sessMap = webim.MsgStore.sessMap();
    }
  },

  getConfigSet: function (cb) {
    let t = this;
    //读取配置信息
    let cellphone_H = 'masterInfo.cellphone';
    let wechat_H = 'masterInfo.wechat';
    wx.showNavigationBarLoading();
    wx.request({
      url: api.getSuperCardConfig.url,
      data: Object.assign({}, {
        openid: app.globalData.UserInfo.WeiXinOpenId,
        card_id: this.card_id,
      }, api.getSuperCardConfig.data),
      method: 'POST',
      success: res => { 
        console.log(res)
        t.setData({
          [cellphone_H]: res.data.data.cellphone,
          [wechat_H]: res.data.data.wechat
        })
        if (res.data.status) {
          Config.sdkappid = res.data.data.sdk_appid;
          Config.accountType = res.data.data.sdk_account_type;
          Config.accountMode = 0;
          this.data.sendTo = res.data.data.sendManager;
          this.data.Identifier = res.data.data.Identifier;
          this.data.UserSig = res.data.data.UserSig;
          wx.hideNavigationBarLoading();
          cb && cb.apply(this);
        } else {
          wx.showModal({
            title: '出错啦',
            content: '配置信息读取失败',
            showCancel: false
          });
        }
        wx.hideNavigationBarLoading();
      }
    });
  },


  sendTalkMsg:function(e){
	  let that = this
    var content = 1111;
    wx.request({
      url: api.sendTalkMsg.url,
      data: Object.assign({}, {
        card_id:this.card_id,
        openid:app.globalData.UserInfo.WeiXinOpenId,
        content:content
      }, api.sendTalkMsg.data),
      method: 'POST',
      success: res => {
        if (res.data.success) {
          console.log('成功发送信息');
          //刷新msg内容
          that.data.msgs.append({
              'fromAccountNick':res.data.from,
              'content':content
            });
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

  /** 下拉获取更多 */
  onPageScroll: function (e) {
    if (!pulling && e.scrollTop < 50) {
      if (getPrePageC2CHistroyMsgInfoMap[this.data.sendTo]) {
        this.getPrePageC2CHistoryMsgs(res => {
          this.setData({
            msgs: this.formatMsgs(res).concat(this.data.msgs)
          })
        }, err => {
          console.error('历史消息获取失败', err)
        })
      } else {
        this.getLastC2CHistoryMsgs(res => {
          this.setData({
            msgs: this.data.msgs.concat(this.formatMsgs(res))
          }, () => {
            wx.pageScrollTo({ scrollTop: 9999999 })
          })
        }, err => {
          console.error('历史消息获取失败', err)
        })
      }
    }
  },

  //获取最新的c2c历史消息,用于切换好友聊天，重新拉取好友的聊天消息
  getLastC2CHistoryMsgs: function (cbOk, cbError) {
    // if (selType == webim.SESSION_TYPE.GROUP) {
    //   alert('当前的聊天类型为群聊天，不能进行拉取好友历史消息操作');
    //   return;
    // }
    if (pulling) return;
    pulling = true
    wx.showNavigationBarLoading()
    var lastMsgTime = 0; //第一次拉取好友历史消息时，必须传0
    var msgKey = '';
    var options = {
      'Peer_Account': this.data.sendTo, //好友帐号
      'MaxCnt': reqMsgCount, //拉取消息条数
      'LastMsgTime': lastMsgTime, //最近的消息时间，即从这个时间点向前拉取历史消息
      'MsgKey': msgKey
    };
    // selSess = null;
    webim.MsgStore.delSessByTypeId('C2C', this.data.sendTo);

    webim.getC2CHistoryMsgs(
      options,
      (resp) => {
        pulling = false
        wx.hideNavigationBarLoading()
        // var complete = resp.Complete; //是否还有历史消息可以拉取，1-表示没有，0-表示有
        if (resp.MsgList.length == 0) {
          webim.Log.warn("没有历史消息了:data=" + JSON.stringify(options));
          //发送初始化消息
          // this.receiveMsgs({'fromAccountNick':'管理员','content':'您好，请问有什么可以帮到您？','type':'welcome'});
          return;
        }
        getPrePageC2CHistroyMsgInfoMap[this.data.sendTo] = { //保留服务器返回的最近消息时间和消息Key,用于下次向前拉取历史消息
          'LastMsgTime': resp.LastMsgTime,
          'MsgKey': resp.MsgKey
        };

        //清空聊天界面
        // document.getElementsByClassName("msgflow")[0].innerHTML = "";
        if (cbOk)
          cbOk(resp.MsgList);
        this.receiveMsgs({'fromAccountNick':'管理员','content':'您好，请问有什么可以帮到您？','type':'welcome'});
      },
      err => {
        pulling = false
        wx.hideNavigationBarLoading()
        if (cbError) cbError(err)
      }
    );
  },
  //向上翻页，获取更早的好友历史消息
  getPrePageC2CHistoryMsgs: function (cbOk, cbError) {
    var tempInfo = getPrePageC2CHistroyMsgInfoMap[this.data.sendTo]; //获取下一次拉取的c2c消息时间和消息Key
    var lastMsgTime;
    var msgKey;
    if (tempInfo) {
      lastMsgTime = tempInfo.LastMsgTime;
      msgKey = tempInfo.MsgKey;
    } else {
      console.error('获取下一次拉取的c2c消息时间和消息Key为空');
      return;
    }
    if (pulling) return;
    pulling = true
    wx.showNavigationBarLoading()
    var options = {
      'Peer_Account': this.data.sendTo, //好友帐号
      'MaxCnt': reqMsgCount, //拉取消息条数
      'LastMsgTime': lastMsgTime, //最近的消息时间，即从这个时间点向前拉取历史消息
      'MsgKey': msgKey
    };
    webim.getC2CHistoryMsgs(
      options,
      (resp) => {
        pulling = false
        wx.hideNavigationBarLoading()
        // var complete = resp.Complete; //是否还有历史消息可以拉取，1-表示没有，0-表示有
        if (resp.MsgList.length == 0) {
          webim.Log.warn("没有历史消息了:data=" + JSON.stringify(options));
          return;
        }
        getPrePageC2CHistroyMsgInfoMap[this.data.sendTo] = { //保留服务器返回的最近消息时间和消息Key,用于下次向前拉取历史消息
          'LastMsgTime': resp.LastMsgTime,
          'MsgKey': resp.MsgKey
        };
        if (cbOk) cbOk(resp.MsgList);
      },
      err => {
        pulling = false
        wx.hideNavigationBarLoading()
        if (cbError) cbError(err)
      }
    );
  },
  // 格式化读过来的的消息数组
  formatMsgs: function (msgs) {
    return msgs.map(msg => this.formatMsg(msg))
  },
  // 格式化一条消息
  formatMsg: function (msg) {
    let newMsg = {elems: []}, elems, elem, msgType, content;
    elems = msg.getElems();//获取消息包含的元素数组
    for(var i in elems) {
      elem = elems[i];
      msgType = elem.getType();//获取元素类型
      content = elem.getContent();//获取元素对象
      switch (msgType) {
        case webim.MSG_ELEMENT_TYPE.TEXT:
          newMsg.elems.push({type: 'TEXT', data: content.getText()})
          break;
        case webim.MSG_ELEMENT_TYPE.FACE:
          newMsg.elems.push({ type: 'FACE', data: 'http://avc.qcloud.com/demo/webim/biggroup/mobile/img/back-img2.png' }) // data为图片表情的地址
          break;
        case webim.MSG_ELEMENT_TYPE.IMAGE:
          newMsg.elems.push({ type: 'IMAGE', data: [
            content.getImage(webim.IMAGE_TYPE.ORIGIN).getUrl(),
            content.getImage(webim.IMAGE_TYPE.LARGE).getUrl(),
            content.getImage(webim.IMAGE_TYPE.SMALL).getUrl()
          ] })
          break;
        default:
          webim.Log.error('未知消息元素类型: elemType=' + msgType);
          break;
      }
    }
    newMsg.isSend = msg.getIsSend()
    newMsg.time = webim.Tool.formatTimeStamp(msg.getTime())
    return newMsg;
  },
  getCardInfo:function(){
    let that = this
    wx.request({
      url: api.getSupercard.url,
      data: Object.assign({}, {
        openid: app.globalData.UserInfo.WeiXinOpenId,
        card_id: this.card_id,
      }, api.getSupercard.data),
      method: 'POST',
      success: res => {
        if (res.data.status) {
          that.card_info = res.data.data
          that.setData({
            card_info:that.card_info
          })
        } else {
          wx.showModal({
            title: '出错啦',
            content: '名片信息读取失败',
            showCancel: false
          });
        }
      }
    });
  },
  onLoad: function (options) {
    if(options.card_id != 'undefined'){
       this.card_id = options.card_id
    }
    app.globalData.getTop();
    this.getConfigSet(function () {
      this.setData({
        userInfo: app.globalData.UserInfo,
        Identifier: this.data.Identifier,
        UserSig: this.data.UserSig
      });
      this.initIM(app.globalData.UserInfo);
    });
  },
  onShow:function(){
    this.getCardInfo();
    this.saveEvent(11)//复制事件记录
  },
  onUnload: function () {
    msgInput = ''
    getPrePageC2CHistroyMsgInfoMap = {}
    sending = false
    pulling = false
  }
});