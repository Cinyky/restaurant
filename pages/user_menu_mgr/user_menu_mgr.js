const app = getApp();
const templateMethods = require("../../utils/template_methods.js");
const userMenuApi = require("../../api/userMenuAPI");
Page(Object.assign({}, {
  data: {
    list: {
      'dingdan': {text: '订单', show: true},
      'wodecaifu': {text: '我的财富', show: true},
      'shouhuodizhi': {text: '收货地址', show: true},
      'shangpinshoucang': {text: '商品收藏', show: true},
      'pintuan': {text: '我的拼团', show: true},
      'youhuiquan': {text: '优惠券', show: true},
      'liuyan': {text: '留言反馈', show: true},
      'guanyushangjia': {text: '关于商家', show: true},
      'huiyuanka': {text: '会员卡', show: true},
      'dazhuanpan': {text: '大转盘', show: true},
      'biaodan': {text: '表单中心', show: true},
      'shangjiarukou': {text: '商家入口', show: true},
      'youhuimaidan': {text: '优惠买单', show: true},
      'jiudian': {text: '酒店订单', show: true}
    }
  },
  onLoad: function (options) {
    const t = this, td = this.data;
    this.setMenu(this);
    app.globalData.getTop();
    // 从服务器端获取用户的设置
    wx.showLoading({title: 'Loading...', mask: true});
    let api = userMenuApi.get;
    wx.request({
      url: api.url,
      method: api.method,
      data: {
        wid: api.data.wid,
        openid: app.globalData.UserInfo.WeiXinOpenId,
      },
      success(resp) {
        const rData = resp.data;
        const data = rData.data;
        let list = td.list;
        if (rData.status != 'success') return false;
        // 处理数据
        for (let key in data) {
          if (data.hasOwnProperty(key) && list[key] && data[key] == false) {
            list[key]['show'] = false;
          }
        }
        t.setData({list: list});
      },
      complete() {
        wx.hideLoading();
      }
    });

  },
  bindSwitch(e) {
    let t = this, td = this.data;
    let key = e.currentTarget.dataset.name;
    let val = !!e.detail.value;
    if (!key) return false;
    // 向后台发送请求设置参数
    let api = userMenuApi.set;
    wx.showLoading({title: '保存设置...', mask: true});
    wx.request({
      url: api.url,
      data: {
        wid: api.data.wid,
        openid: app.globalData.UserInfo.WeiXinOpenId,
        key: key,
        val: val
      },
      method: api.method,
      success(resp) {
        let rData = resp.data;
        let data = rData.data;
        if (rData.status != 'success') return false;
        let ls = td.list;
        ls[key]['show'] = val;
        t.setData({list: ls});
      },
      complete() {
        wx.hideLoading();
      }
    });
  }
}, templateMethods));