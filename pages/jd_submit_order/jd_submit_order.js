let app = getApp();
let templateMethods = require("../../utils/template_methods.js");
let myTools = require('../../utils/myTools');
let jd_common = require('../../utils/jd_common');
let WxParse = require("../../wxParse/wxParse.js");
let jdApi = require('../../api/jdAPI');
let moment=require('../../utils/moment');
Page(Object.assign({}, {
  data: {
    numIndex: 0,
    num: 1,
  },
  onLoad: function (options) {
    let t = this, jdId = options.jdId, kfIdx = options.kfIdx, tcIdx = options.tcIdx, sdate = options.sdate,
      edate = options.edate;

    t.setData({
      kfIdx: kfIdx,
      tcIdx: tcIdx,
      sdate: sdate,
      edate: edate,
      dateDiff: Math.ceil((moment(edate).unix()-moment(sdate).unix())/86400),
    });
    t.setMenu(t);
    app.globalData.getTop(t);
    t.getSetting(function () {
      t.getJd(jdId, function (jd) {
        let kf = jd.kfList[kfIdx], tc = kf.taocan[tcIdx];
        let numList = [];
        for (let i = 1; i <= parseInt(kf.num); ++i) {
          numList.push(i);
        }
        let price = t.data.dateDiff * parseFloat(tc.price);
        t.setData({kf: kf, tc: tc, numList: numList, onePrice: price, price: price});
      });
    });
  },
  // 修改预定房间的数量
  bindNumChange(e) {
    let t = this;
    let val = parseInt(e.detail.value);
    t.setData({
      numIndex: val,
      num: t.data.numList[val],
    });
    // 重新计算价格
    t.setData({price: t.data.onePrice * t.data.num});
  },
  // 文本框输入
  bindTextInput(e) {
    let t = this, name = e.currentTarget.dataset.name, val = e.detail.value;
    let obj = {};
    obj[name] = val;
    t.setData(obj);
  },
  // 提交订单
  bindSubmitOrder(e) {
    let t = this, formId = e.detail.formId;
    let td = t.data;
    let reg = /^1[3|4|5|6|7|8][0-9]{9}$/;
    let flag = reg.test(td.phone);
    // 检查是否输入了个人信息
    if (!td.num || !td.sdate || !td.edate) {
      wx.showToast({title: '参数错误', mask: 1});
      return false;
    }
    if (!td.name) {
      wx.showToast({title: '请输入联系人姓名', mask: 1});
      return false;
    }
    console.log(flag);
    if (!flag) {
      wx.showToast({
        icon: 'none',
        title: '请输入正确的手机号'
      })
      return false;
    }
    // 整理参数
    wx.showLoading({title: 'loading', mask: 1});
    let api = jdApi.submitOrder;
    wx.request({
      url: api.url,
      method: api.method,
      data: {
        wid: api.data.wid,
        openid: app.globalData.UserInfo.WeiXinOpenId,
        kfId: parseInt(td.kf.id),
        tcIdx: parseInt(td.tcIdx),
        sdate: td.sdate,
        edate: td.edate,
        num: td.num,
        name: td.name,
        phone: td.phone,
        formId: formId,
      },
      success: function (resp) {
        let r = resp.data, rd = r.data;
        if (r.status == 'success') {
          rd.success = function () {
            // 跳转到订单中心
            wx.redirectTo({
              url: '/pages/jd_order/jd_order'
            });
          };
          rd.fail = function () {
            wx.showModal({title: '提示', content: '支付未完成，请重新下单', showCancel: 0});
          };
          wx.requestPayment(rd);
        } else {
          wx.showModal({title: '提示', content: r.msg || '未知错误', showCancel: 0});
        }
      },
      fail() {
        wx.showModal({title: '错误', content: '网络错误', showCancel: 0});
      },
      complete() {
        wx.hideLoading();
      }
    });
  },
}, templateMethods, jd_common));