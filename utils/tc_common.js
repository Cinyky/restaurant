let app = getApp();
let tcApi = require('../api/tcApi');
let myTools = require('../utils/myTools');
module.exports = {
  // 加载商家配置信息
  loadSetting(setTitle=false) {
    let t = this;
    let api = tcApi.getSetting;
    wx.showLoading({title: 'Loading', mask: 1});
    wx.request({
      url: api.url,
      method: api.method,
      data: {
        wid: api.data.wid,
        openid: app.globalData.UserInfo.WeiXinOpenId,
      }, success(resp) {
        let r = resp.data, rd = r.data;
        if (r.status == 'success') {
          t.setData({setting: rd});
          if(setTitle && rd.title){
            wx.setNavigationBarTitle({
              title: rd.title
            })
          }
        } else {
          wx.showModal({title: '提示', content: r.msg});
        }
      }, complete() {
        wx.hideLoading();
      }
    });
  },
  // 加载分类列表
  loadCateList(group = false) {
    let t = this;
    let api = tcApi.getCateList;
    wx.showLoading({title: 'Loading', mask: 1});
    wx.request({
      url: api.url,
      method: api.method,
      data: {
        wid: api.data.wid,
        openid: app.globalData.UserInfo.WeiXinOpenId,
        group: group,
      }, success(resp) {
        let r = resp.data, rd = r.data;
        if (r.status == 'success') {
          t.setData({cateList: rd});
        } else {
          wx.showModal({title: '提示', content: r.msg});
        }
      }, complete() {
        wx.hideLoading();
      }
    });
  },
  // 加载分类列表
  loadCate(cid) {
    let t = this;
    let api = tcApi.getCate;
    wx.showLoading({title: 'Loading', mask: 1});
    wx.request({
      url: api.url,
      method: api.method,
      data: {
        wid: api.data.wid,
        openid: app.globalData.UserInfo.WeiXinOpenId,
        cid: cid,
      }, success(resp) {
        let r = resp.data, rd = r.data;
        if (r.status == 'success') {
          rd.price = myTools.toMoney(rd.price);
          t.setData({cate: rd});
        } else {
          wx.showModal({title: '提示', content: r.msg});
        }
      }, complete() {
        wx.hideLoading();
      }
    });
  },
  // 拨打电话
  onCallTap(e) {
    let t = this, ds = e.currentTarget.dataset;
    let tel = ds.tel;
    wx.makePhoneCall({
      phoneNumber: tel
    });
  },
  // 点赞
  onGoodTap(e) {
    let t = this, ds = e.currentTarget.dataset;
    let idx = ds.index, id = ds.id;
    let api = tcApi.setUp;
    wx.request({
      url: api.url,
      method: api.method,
      data: {
        wid: api.data.wid,
        openid: app.globalData.UserInfo.WeiXinOpenId,
        msg_id: id,
      }, success(resp) {
        let r = resp.data, rd = r.data;
        if (r.status == 'success') {
          // 点赞成功
          let msgList = t.data.msgList;
          if (msgList) {
            // 列表点赞
            msgList[idx].is_up = 1;
            msgList[idx].up_num += 1;
            t.setData({msgList: msgList});
          } else {
            // 单个点赞
            let _msg=t.data.msg;
            _msg.is_up=_msg.is_up==1?0:1;
            _msg.is_up=_msg.up_num += 1;
            t.setData({msg:_msg});
          }
        } else {
          wx.showToast({title: r.msg, mask: 1});
        }
      }, fail() {
        wx.showToast({title: '网络异常', mask: 1});
      }
    });
  },
  // 显示评论框
  onShowCommentTap(e) {
    let t = this, ds = e.currentTarget.dataset;
    let idx = ds.index;
    t.setData({
      show_comment: true,
      comment_msg_idx: idx,
      comment_msg_id: ds.id,
      comment_content: ''
    });
  },
  // 隐藏评论框
  onHideCommentTap(e) {
    let t = this, ds = e.currentTarget.dataset;
    t.setData({
      show_comment: false,
      comment_msg_idx: null,
      comment_msg_id: null,
      comment_content: null
    });
  },
  onCommentSubmit(e) {
    let t = this;
    console.log(e);
    let comment_content = e.detail.value.content;
    // 发送请求完成评论
    let api = tcApi.setComment;
    wx.request({
      url: api.url,
      method: api.method,
      data: {
        wid: api.data.wid,
        openid: app.globalData.UserInfo.WeiXinOpenId,
        msg_id: t.data.comment_msg_id,
        content: comment_content,
      }, success(resp) {
        let r = resp.data, rd = r.data;
        console.log(r);
        let msgList = t.data.msgList;
        if (msgList) {
          // 列表回复
          msgList[t.data.comment_msg_idx].comment_num += 1;
          msgList[t.data.comment_msg_idx].comment.push(rd);
          t.setData({msgList: msgList, show_comment: false});
        } else {
          // 单个回复
          let _msg=t.data.msg;
          _msg.comment_num += 1;
          _msg.comment.push(rd);
          t.setData({msg:_msg,show_comment: false});
        }
      }, fail() {
        wx.showToast({title: '网络错误', mask: 1});
      }
    });
  },
  onPayTap(e) {
    let t = this, ds = e.currentTarget.dataset;
    console.log(ds);
    let id = ds.id;
    // 请求支付参数
    let api = tcApi.requestPay;
    wx.showLoading({title: 'Loading', mask: 1});
    wx.request({
      url: api.url,
      method: api.method,
      data: {
        wid: api.data.wid,
        openid: app.globalData.UserInfo.WeiXinOpenId,
        msg_id: id
      }, success(resp) {
        let r = resp.data, payObj = r.data;
        if (r.status != 'success') {
          wx.showToast({title: r.msg, 'mask': 1});
          return false;
        }
        console.log(payObj);
        // 调起支付
        payObj.success = function () {
          t.loadMsg(true);
        };
        wx.requestPayment(payObj);
      }, fail() {
        wx.showToast({title: '网络错误', 'mask': 1});
      }, complete() {
        wx.hideLoading();
      }
    });
  },
  // 图片预览
  bindPreviewImg(e) {
    let t = this, ds = e.currentTarget.dataset;
    let url = ds.url;
    wx.previewImage({urls: [url]});
  },
  // 收藏
  bindFav(e) {
    let t = this, ds = e.currentTarget.dataset;
    console.log(ds);
    let id = ds.id, idx = ds.index;
    let api = tcApi.setFav;
    wx.request({
      url: api.url,
      method: api.method,
      data: {
        wid: api.data.wid,
        openid: app.globalData.UserInfo.WeiXinOpenId,
        msg_id: id,
      }, success(resp) {
        let r = resp.data, rd = r.data;
        if (r.status != 'success') {
          wx.showModal({title: '提示', content: r.msg, showCancel: 0});
          return false;
        }
        if (t.data.msgList) {
          // 列表收藏
          let _msgList = t.data.msgList;
          console.log(_msgList, idx);
          _msgList[idx].is_fav = _msgList[idx].is_fav == 1 ? 0 : 1;
          t.setData({msgList: _msgList});
        } else if (t.data.msg) {
          // 单个收藏
          let _msg=t.data.msg;
          _msg.is_fav=_msg.is_fav==1?0:1;
          t.setData({msg:_msg});
        }
      }, fail() {
        wx.showModal({title: '错误', content: '网络错误', showCancel: 0});
      }
    });
  },
  bindRedirectToDetail(e) {
    let t = this,ds = e.currentTarget.dataset;
    let id = ds.id;
    let url='/pages/tc_detail/tc_detail?id=' + id;
    console.log(url);
    wx.navigateTo({url: url});
  },
  loadUser(){
    let t = this, ts = t.data;
    // 加载个人信息
    let api = tcApi.getUser;
    wx.request({
      url: api.url,
      data: {
        wid: api.data.wid,
        openid: app.globalData.UserInfo.WeiXinOpenId,
      },
      method: api.method,
      success(resp) {
        let r = resp.data, rd = r.data;
        if (r.status == 'success') {
          t.setData({user: rd});
        } else {
          wx.showToast({title: r.msg, mask: 1});
        }
      }, fail() {
        wx.showToast({title: '网络异常', mask: 1});
      }
    });
  }
};