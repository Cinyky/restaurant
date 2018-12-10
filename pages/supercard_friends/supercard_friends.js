// pages/timelines/timelines.js
const app = getApp();
let commentIndex = 0; // 评论输入框出现时对应的动态索引
let lState = 0; // 0=> has more, 1=>loading, 2=> no more
let params = {page: 1};
const api = require('../../api/supercard.js');
var templateMethods = require("../../utils/template_methods.js");
Page(Object.assign({}, {
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      name: 'haha'
    },
    pageData: [],
    showOperate: null, // 有值 则为 显示【赞、评论】面板的动态索引index
    comtInputFocus: false,
    showCommentInput: false,
    commentInputValue: '',
    lText: '' // 没有更多的时候设为空，中间显示圆点
  },

  /** 动态点击事件 */
  sClick: function (e) {
    const sIndex = e.currentTarget.id.substring(8);
    console.log('点击了第', sIndex, '个动态');
    let s = this.data.pageData[sIndex];
    console.log(s.content.url);
    wx.navigateTo({
      url: s.content.url,
    });
  },

  /** 获取页面数据 */
  getData: function () {
    wx.showNavigationBarLoading();
    lState = 1;
    this.setData({lText: '加载中...'});
    wx.request({
      url: api.getSupercardFriends.url,
      data: Object.assign({
        openid: app.globalData.UserInfo.WeiXinOpenId,
      }, {}, api.getSupercardFriends.data),
      success: res => {
        wx.hideNavigationBarLoading();
        if (res.data.success) {
          lState = res.has_more ? 0 : 2;
          console.log(res.data.data);
          this.setData({
            pageData: this.data.pageData.concat(res.data.data),
            lText: res.has_more ? '上拉加载更多' : ''
          });
          if (res.data.length > 0) params.page++; // +页码
        } else {
          lState = 2;
          this.setData({lText: ''});
          wx.showToast({
            title: '获取失败了，' + res.message,
            icon: 'none',
            duration: 2500
          });
        }
      },
      fail: err => {
        wx.hideNavigationBarLoading();
        lState = 2;
        this.setData({lText: ''});
        wx.showToast({
          title: '获取失败了，' + err.errMsg,
          icon: 'none',
          duration: 2500
        });
      }
    });
  },
  /**
   * 页面上拉触底事件的处理函数
   *
   * /
   onReachBottom: function () {
    // this.getData()
  },

   /** 赞、评论面板 */
  showOperate: function (e) {
    let id = e.currentTarget.id;
    if (id) {
      const index = id.substring(7);
      if (this.data.showOperate !== index) this.setData({showOperate: parseInt(index)});
    }
  },


  /** 点赞 */
  bindSupport: function () {
    let d = this.data.pageData.slice();
    let s = d[this.data.showOperate];
    const name = app.globalData.UserInfo.NickName;
    wx.request({
      url: api.supercardFriendsSupport.url,
      data: Object.assign({
        friend_id: s.id,
        openid: app.globalData.UserInfo.WeiXinOpenId,
        nickName: name
      }, {}, api.supercardFriendsSupport.data),
      success: res => {
        wx.hideNavigationBarLoading();
        if (res.data.success) {
          // 以下逻辑加api放到请求成功之后执行
          if (s.supports) {
            const i = s.supports.indexOf(name);
            if (i > -1) {
              s.supports.splice(i, 1);
              d[this.data.showOperate] = s;
            } else {
              s.supports.push(name);
              d[this.data.showOperate] = s;
            }
          } else {
            d[this.data.showOperate].supports = [name];
          }
          this.setData({
            pageData: d,
            showOperate: null
          });
        } else {
          wx.showToast({
            title: '点赞失败了' + res.message,
            icon: 'none',
            duration: 2500
          });
        }
      },
      fail: err => {
        wx.showToast({
          title: '点赞失败了' + err.errMsg,
          icon: 'none',
          duration: 2500
        });
      }
    });
  },
  /** 点击动态的评论按钮 */
  iWantComment: function () {
    commentIndex = this.data.showOperate;
    this.setData({
      showCommentInput: true,
      comtInputFocus: true,
      //showOperate: null
    });
  },
  /** 发布评论 */
  bindComment: function (e) {
    const val = e.detail.value.comment;
    if (!val.replace(/^\s*|\s*$/g, '')) return;
    let d = this.data.pageData.slice();
    let s = d[this.data.showOperate];
    let newComment = {name: app.globalData.UserInfo.NickName, content: val};
    wx.request({
      url: api.supercardFriendsComment.url,
      data: Object.assign({
        openid: app.globalData.UserInfo.WeiXinOpenId,
        nickName: app.globalData.UserInfo.NickName,
        content: val,
        friend_id:s.id,
      }, {}, api.supercardFriendsComment.data),
      success: res => {
        wx.hideNavigationBarLoading();
        if (res.data.success) {
          // 以下逻辑加api放到请求成功之后执行
          if (d[commentIndex].comments) {
            d[commentIndex].comments.push(newComment);
          } else {
            d[commentIndex].comments = [newComment];
          }
          this.setData({
            pageData: d,
            showCommentInput: false,
            commentInputValue: '',
            showOperate: null,
          });
        } else {
          wx.showToast({
            title: '评论失败' + res.message,
            icon: 'none',
            duration: 2500
          });
        }
      },
      fail: err => {
        wx.hideNavigationBarLoading();
        wx.showToast({
          title: '评论失败' + err.errMsg,
          icon: 'none',
          duration: 2500
        });
      }
    });
  },
  /** 点击页面其他地方 检查并隐藏 评论操作板 */
  pageClick: function () {
    if (this.data.showOperate !== null) {
      this.setData({showOperate: null});
    }
    if (this.data.showCommentInput) {
      this.setData({
        showCommentInput: false,
        commentInputValue: ''
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
    app.globalData.getTop();
    this.saveEvent(6);
    this.setMenu(this);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    let shareTitle = '页面分享标题';
    let shareImg = null; // 默认截图
    // 每条动态上的转发按钮
    if (e.target && e.target.id) {
      let sIndex = e.target.id.substring(8);
      let s = this.data.pageData[sIndex];
      console.log(s);
      shareTitle = s.content.text;
      shareImg = s.content.img;
    }
    return {
      title: shareTitle,
      imageUrl: shareImg,
      path: ''
    };
  }
}, templateMethods));