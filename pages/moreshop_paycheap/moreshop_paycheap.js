let app = getApp();
let moreshop_common = require('../../utils/moreshop_common');
let templateMethods = require("../../utils/template_methods.js");
let moreshopApi     = require('../../api/moreshopApi');
let $ = require("../../utils/util.js");
// payCheapAPI = require("../../api/payCheapAPI.js");
Page(Object.assign({},{
    data: {
      spendMoney:'',
      reallyMoney:0,
      shopid:'',
    },
    onLoad: function (options) {
      let that = this;
      console.log(options.shopid);
      that.setData({
        shopid:options.shopid
      });
      // const api = payCheapAPI.getPayCheapInfo;
      //接收页面配置信息
      // wx.request({
      //   url : api.url,
      //   data:{
      //     wid     : api.data.wid,
      //     openid  : app.globalData.UserInfo.WeiXinOpenId,
      //   },
      //   method: "POST",
      //   success: function (resp) {
      //     that.setData({
      //       setInfo:resp.data.data
      //     });
      //     if(resp.data.data['title'] != null){
      //       wx.setNavigationBarTitle({
      //         title: resp.data.data['title']
      //       });
      //     }
      //   }
      // });
      // this.setMenu(this);
      app.globalData.getTop();
      
    },
    //输入消费金额^[0-9]+.?[0-9]{2}$
    inputMoney:function (e) {
      const that = this;
      var ng = new RegExp('^[0-9]*(.[0-9]{0,2})?$','g');
      if(ng.exec(parseFloat(e.detail.value)) == null){
        that.setData({
          spendMoney:'',
          reallyMoney:0
        });
        $.alert('请输入数字！');
      }else{
        that.setData({
          spendMoney : (parseFloat(e.detail.value)).toFixed(2),
          reallyMoney:(parseFloat(e.detail.value)).toFixed(2)
        });
        console.log('消费金额：'+this.data.spendMoney,'实付金额：'+this.data.reallyMoney);
      }
    },
    //转账功能
    paysubmit:function (e){
      const that = this;
      const api = moreshopApi.paycheap;
      app.GetUserInfo(function() {
        console.log("获取到的openid", app.globalData.UserInfo.WeiXinOpenId);
        wx.request({
          url:api.url,
          data:{
            wid     : api.data.wid,
            shopid  : that.data.shopid,
            openid  : app.globalData.UserInfo.WeiXinOpenId,
            spendMoney  : that.data.spendMoney,
            reallyMoney   : that.data.reallyMoney
          },
          method:'POST',
          success(resp){
            console.log(resp.data);
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
                  showCancel: 0
                  // success: function (res) {
                  //   wx.navigateTo({
                  //     url: '/pages/paycheap/paycheap'
                  //   })
                  // }
                });
              },
              fail: function (e) {
                console.log("支付失败：",e)
              }
        
            })
          }
        });
      });
      // console.log('消费金额：'+this.data.spendMoney,'实付金额：'+this.data.reallyMoney);
    }
  }
  ,templateMethods,moreshop_common
));
