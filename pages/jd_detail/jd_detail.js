let app = getApp();
let templateMethods = require("../../utils/template_methods.js");
let myTools = require('../../utils/myTools');
let jd_common = require('../../utils/jd_common');
let WxParse = require("../../wxParse/wxParse.js");
let moment=require("../../utils/moment");
Page(Object.assign({}, {
  data: {
    tab: 1
  },
  onLoad(e){this.setData({tempE:e})},
  onShow: function () {
    var options=this.data.tempE;
    let t = this, id = options.id;
    t.setMenu(t);
    app.globalData.getTop(t);
    app.GetUserInfo(function () {
      t.getSetting(function () {
        t.getJd(id, function (jd) {
          WxParse.wxParse("jdinfo", "html", jd.desc, t);
        });
      });
    });
    // 初始化日期
    t.setData({
      sdate: moment().format('YYYY-MM-DD'),
      ssdate: moment().format('YYYY-MM-DD'),
      edate: moment().add(1,'d').format('YYYY-MM-DD'),
      eedate: moment().add(1,'d').format('YYYY-MM-DD'),
    });
  },
  // 打开地图查看地址
  bindLookAddress() {
    let t = this;
    wx.openLocation({
      latitude: parseFloat(t.data.jd.lat),
      longitude: parseFloat(t.data.jd.lng),
      fail() {
        wx.showModal({
          title: '提示',
          content: '开启地图失败，请确认授权了位置权限',
          success(r) {
            if (r.confirm) {
              wx.openSetting({
                success() {
                  t.bindLookAddress();
                }
              });
            }
          }
        });
      }
    });
  },
  // 切换标签页
  bindChangeTab(e) {
    let t = this, ds = e.currentTarget.dataset, tab = ds.tab;
    t.setData({tab: tab});
  },
  // 时间选择
  bindDateChange(e) {
    let t = this, ds = e.currentTarget.dataset, type = ds.type;
    let val = e.detail.value;
    let setDt = {};
    setDt[type] = val;
    t.setData(setDt);
  },
  // 切换套餐列表的显示状态
  bindToggleTaocan(e) {
    let t = this, ds = e.currentTarget.dataset, id = ds.id, idx = ds.idx;
    let jd = t.data.jd;
    let kfList = jd.kfList;
    for (let i = 0; i < kfList.length; ++i) {
      if (i == idx) {
        kfList[i].show_taocan = !kfList[i].show_taocan;
      } else {
        kfList[i].show_taocan = false;
      }
    }
    jd.kfList = kfList;
    t.setData({jd: jd});
  },
  // 显示预定弹窗
  showYuDingDialog(e) {
    let t = this, ds = e.currentTarget.dataset;
    let kfId = ds.id, kfIdx = ds.kfidx, tcIdx = ds.tcidx;
    let kf = t.data.jd.kfList[kfIdx];
    if (!kf) {
      return false;
    }
    let tc = kf.taocan[tcIdx];
    if (!tc) {
      return false;
    }
    // 整理显示弹窗所需的数据，显示弹窗
    t.setData({
      dialogKf: kf,
      dialogKfIdx: kfIdx,
      dialogTc: tc,
      dialogTcIdx: tcIdx,
      showDialog: true,
    });
  },
  // 隐藏预定弹窗
  hideYuDingDialog() {
    let t = this;
    t.setData({
      dialogKf: null,
      dialogKfIdx: null,
      dialogTc: null,
      dialogTcIdx: null,
      showDialog: false,
    });
  },
  // 执行预定客房操作
  bindDoYuding() {
    let t = this;
    let jdId = t.data.jd.id, kfIdx = t.data.dialogKfIdx, tcIdx = t.data.dialogTcIdx;
    let sdate = t.data.sdate, edate = t.data.edate;
    if(sdate>=edate){
      wx.showToast({
          title:'时间段错误',
      });
      return false;
    }
    let url = `/pages/jd_submit_order/jd_submit_order?jdId=${jdId}&kfIdx=${kfIdx}&tcIdx=${tcIdx}&sdate=${sdate}&edate=${edate}`;
    console.log(url);
    wx.navigateTo({url:url});
  },
  onShareAppMessage() {
    let t = this;
    let url="/pages/jd_detail/jd_detail?id="+t.data.jd.id;
    console.log(url);
    return {
      title: t.data.setting.share_title + '-' + t.data.setting.share_desc,
      imageUrl: t.data.jd.imgs[0],
      path: url,
    };
  }
}, templateMethods, jd_common));