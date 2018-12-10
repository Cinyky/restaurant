let app = getApp();
let templateMethods = require("../../utils/template_methods.js");
let myTools = require('../../utils/myTools');
let answer_common = require('../../utils/answer_common');
Page(Object.assign({}, {
  data: {
    show_rule_dialog:false
  },
  onLoad: function (options) {
    let t = this;
    t.setMenu(t);
    app.globalData.getTop(t);
    if(!options.aid){
      wx.showModal({title:'提示',content:'缺少活动参数'});
      return false;
    }
    t.setData({
      aid:options.aid,
      share_user:options.openid
    });
    wx.setStorageSync('answer_id',options.aid);
  },
  onShow(){
    let t = this;
    // 获取用户信息回调
    app.GetUserInfo(function  () {
      t.getAnswer(t.data.aid,false,function  (item) {
        // 判断开始时间和状态
        if(!item.can_start){
          wx.showModal({
            title:'提示',
            content:'活动未开启',
            showCancel:0
          });
        }
        // 参与人数打散成数组
        let jn=item.joined_num;
        if(parseInt(jn)<1000){
          jn=`000${jn}`.slice(-4)
        }
        t.setData({
          joined_num:`${jn}`.split('')
        })
      });
    })
  },
  // 关闭规则弹窗
  closeRuleDialog(){
    this.setData({
      show_rule_dialog:false
    })
  },
  // 打开规则弹窗
  showRuleDialog(){
    this.setData({
      show_rule_dialog:true
    })
  },
  
  bindRedirectToMy(){
    wx.navigateTo({
      url:'/pages/answer_my/answer_my'
    });
  },
}, templateMethods, answer_common));