let app = getApp();
let templateMethods = require("../../../../utils/template_methods.js");
let myTools = require('../../../../utils/myTools');
let weitrain_common = require('../../scripts/weitrain_common');
let apiList=require('../../scripts/apiList');
Page(Object.assign({}, {
  data: {},
  onLoad: function (options) {
    let t = this;
    t.setMenu(t);
    app.globalData.getTop(t);
    t.getLessonDetail(options.id);
  },
  // 支付
  formSubmit: function(e) {
    let t = this;
    var s = e.detail.value;//s.price;s.phone,s.username
    console.log(s);
    const api = apiList.pay;
    wx.request({
      url:api.url,
      data:{
        wid     : api.data.wid,
        lessonid  : t.data.lesson.id,
        openid  : app.globalData.UserInfo.WeiXinOpenId,
        price:s.price,
        phone:s.phone,
        username:s.username
      },
      method:'POST',
      success(resp){
        console.log(resp.data);
        if(resp.data.status == 'error'){
          wx.showModal({
            title: '失败',
            content: resp.data.msg,
            showCancel: 0,
            success:function () {
              wx.navigateTo({
                url: '/subPackages/WeiTrain/pages/lesson_detail/lesson_detail?id='+t.data.lesson.id
              })
            }
          });
        }else if(resp.data.status == 'success'){
          wx.showModal({
            title: '成功',
            content: resp.data.msg,
            showCancel: 0,
            success:function () {
              wx.navigateTo({
                url: '/subPackages/WeiTrain/pages/lesson_detail/lesson_detail?id='+t.data.lesson.id
              })
            }
          });
        }else{
          wx.requestPayment({
            timeStamp:resp.data.timeStamp,
            nonceStr:resp.data.nonceStr,
            "package":resp.data.package,
            signType:resp.data.signType,
            paySign:resp.data.paySign,
            success:function (e) {
              //支付成功
              wx.showModal({
                title: '成功',
                content: '支付成功',
                showCancel: 0,
                success:function () {
                  wx.navigateTo({
                    url: '/subPackages/WeiTrain/pages/lesson_detail/lesson_detail?id='+t.data.lesson.id
                  })
                }
              });
            },
            fail: function (e) {
              console.log("支付失败：",e)
            }
          })
        }
      }
    });
  },
}, templateMethods, weitrain_common));
