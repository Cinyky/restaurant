const app = getApp();
const wordsgameApi = require('../../api/wordsgameAPI');
var $ = require("../../utils/util.js");
let WxParse = require("../../wxParse/wxParse.js");
Page({
  data: {
    flag:0,
    gameInfo:'',
    myInfo:'',
    listflag:1,
    bcolor_one:'#8441F1',
    otheropenid:'',
  },
  onLoad(e) {
    let t = this;
    console.log('这是onload数据：',e);
    this.setData({tempE:e});
    //判断userInfo是否存在
    // $.isNull(app.globalData.UserInfo) ? app.GetUserInfo(
    //   function () {
    //     t.InitPage(e);
    //   },
    //   e.uid
    // ) : t.InitPage(e);
  },
  onShow(){
    this.InitPage(this.data.tempE);
  },
  InitPage: function (resp) {
    let t = this;
    //加载页面
    let api = wordsgameApi.getGameInfo;
    console.log('我找找订单id在哪：',resp);
    //分享点进来的
    if(resp.id){
      let helpid = resp.id;
      app.GetUserInfo(function(){
        console.log("获取到的openid",app.globalData.UserInfo.WeiXinOpenId);
        t.setData({
          otheropenid:app.globalData.UserInfo.WeiXinOpenId,
          helpid:helpid
        });
      });
      wx.request({
        url:api.url,
        data:{
          wid:api.data.wid,
          helpid:helpid,
          openid: resp.openid
        },
        method:'POST',
        success:function (r) {
          console.log(api.url);
          if(r.data.status == 'success'){
            console.log('这次是助力进来的');
            console.log('所有信息',r.data.data);
            let game = r.data.data.gameInfo;
            let user = r.data.data.userInfo;
            // console.log('游戏信息',game);
            console.log('用户信息',user);
            if(game['name'] != null){
              wx.setNavigationBarTitle({
                title: game['name']
              });
            }
            t.setData({
              gameInfo:game,
              myInfo:user,
              prizearr:r.data.data.prizearr,
              helps:r.data.data.helps
            });
            WxParse.wxParse("info", "html", game.game_ms, t);
          }else if(r.data.status == 'error'){
            wx.showModal({
              title:'失败',
              content:r.data.msg,
              showCancel:0,
            })
          }
        }
      });
      //获取用户openid
      // wx.login({
      //   success: function (loginCode) {
      //     let appid = 'wx31466cb58bf77444'; //填写微信小程序appid
      //     let secret = '06bfd461a9e2d59a6fa661e7b9f9f0a8'; //填写微信小程序secret
      //     //调用request请求api转换登录凭证
      //     wx.request({
      //       url: 'https://api.weixin.qq.com/sns/jscode2session',
      //       data:{
      //         appid:appid,
      //         secret:secret,
      //         js_code:loginCode.code,
      //         grant_type:'authorization_code'
      //       },
      //       method:'GET',
      //       success: function(res) {
      //         console.log('openid为：',res.data.openid); //获取openid
      //         t.setData({
      //           otheropenid:res.data.openid,
      //           helpid:helpid
      //         });
      //       }
      //     })
      //   }
      // });
    }else{
      wx.request({
        url:api.url,
        data:{
          wid:api.data.wid,
          openid:app.globalData.UserInfo.WeiXinOpenId
        },
        method:'POST',
        success:function (r) {
          console.log(api.url);
          console.log(app.globalData.UserInfo.WeiXinOpenId);
          if(r.data.status == 'success'){
            console.log('所有信息',r.data.data);
            let game = r.data.data.gameInfo;
            let user = r.data.data.userInfo;
            console.log('游戏信息',game);
            console.log('用户信息',user);
            if(game['name'] != null){
              wx.setNavigationBarTitle({
                title: game['name']
              });
            }
            t.setData({
              gameInfo:game,
              myInfo:user,
              prizearr:r.data.data.prizearr,
              helps:r.data.data.helps
            });
            WxParse.wxParse("info", "html", game.game_ms, t);
          }else if(r.data.status == 'error'){
            wx.showModal({
              title:'失败',
              content:r.data.msg,
              showCancel:0,
            })
          }
        }
      });
    }
  },
  //点击规则打开
  game_guize:function () {
    this.setData({
      flag:1
    })
  },
  //点击遮罩层关闭规则
  closeguize:function () {
    this.setData({
      flag:0
    })
  },
  //点击规则不关闭
  kong:function (e) {
    console.log(e);
  },
  //遮罩层滚动穿透问题
  move: function () {
  },
  //抽奖
  chou:function () {
    let t = this;
    let api = wordsgameApi.getWord;
    wx.request({
      url:api.url,
      data:{
        wid:api.data.wid,
        openid:app.globalData.UserInfo.WeiXinOpenId,
        gameid:t.data.gameInfo.id
      },
      method:"POST",
      success:function (e) {
        console.log("您进行了一次抽奖！",e);
        if(e.data.status == 'error'){
          wx.showModal({
            title:'失败',
            content:e.data.msg,
            showCancel:0,
          })
        }else if(e.data.status == 'success'){
          wx.showModal({
            title:'成功',
            content:e.data.msg+e.data.data.word,
            showCancel:0,
            success:function () {
              //判断是否中奖
              api = wordsgameApi.ifPrize;
              wx.request({
                url:api.url,
                method:"POST",
                data:{
                  wid:api.data.wid,
                  openid:app.globalData.UserInfo.WeiXinOpenId,
                  gameid:t.data.gameInfo.id
                },
                success:function (resp) {
                  console.log(resp);
                  if(resp.data.data){
                    wx.showModal({
                      title:'成功',
                      content:resp.data.msg+resp.data.data,
                      showCancel:0
                    });
                  }
                }
              })
            }
          });
          t.setData({
            myInfo:e.data.data
          })
        }
      }
    })
  },
  //切换列表
  list_one: function () {
    this.setData({
      listflag:1,
      bcolor_one:'#8441F1',
      bcolor_two:'#490AB3',
      bcolor_three:'#490AB3'
    })
  },
  list_two: function () {
    this.setData({
      listflag:2,
      bcolor_two:'#8441F1',
      bcolor_one:'#490AB3',
      bcolor_three:'#490AB3',
    })
  },
  list_three: function () {
    this.setData({
      listflag:3,
      bcolor_three:'#8441F1',
      bcolor_one:'#490AB3',
      bcolor_two:'#490AB3',
    })
  },
  //分享助力
  onShareAppMessage: function () {
    let t = this;
    //分享
    return {
      desc   : '快来帮我助力吧！',
      path: "/pages/wordsgame/wordsgame?id=" + t.data.myInfo.id + "&openid=" + app.globalData.UserInfo.WeiXinOpenId,
      success: function () {
        console.log('我已经分享啦~。');
      },
      fail   : function () {
        console.log('我分享失败了！');
        wx.showModal({
          title     : '错误',
          content   : '分享错误',
          showCancel: false,
          success() {
            wx.navigateBack();
          }
        });
      }
    };
  },
  //帮忙助力抽字
  helpchou:function () {
    let t = this;
    let api = wordsgameApi.getHelpInfo;
    wx.request({
      url:api.url,
      method:'POST',
      data:{
        wid:api.data.wid,
        otheropenid:t.data.otheropenid,
        orderid:t.data.helpid
      },
      success:function (e) {
        console.log(e);
        if(e.data.status=='error'){
          wx.showModal({
            title     : '失败',
            content   : e.data.msg,
            showCancel: false
          });
        }
        if(e.data.status=='success'){
          wx.showModal({
            title     : '成功',
            content   : e.data.msg+e.data.data,
            showCancel: false,
            success: function () {
              //判断是否中奖
              api = wordsgameApi.ifPrize;
              wx.request({
                url:api.url,
                method:"POST",
                data:{
                  wid:api.data.wid,
                  openid:app.globalData.UserInfo.WeiXinOpenId,
                  gameid:t.data.gameInfo.id
                },
                success:function (resp) {
                  console.log(resp);
                  if(resp.data.data){
                    wx.showModal({
                      title:'成功',
                      content:"您帮好友集齐了所有字，快去提醒他兑奖吧！",
                      showCancel:0,
                      success:function () {
                        wx.navigateTo({
                          url: "/pages/wordsgame/wordsgame?id=" + t.data.myInfo.id + "&openid=" + app.globalData.UserInfo.WeiXinOpenId,
                        });
                      }
                    });
                  }else{
                    wx.navigateTo({
                      url: "/pages/wordsgame/wordsgame?id=" + t.data.myInfo.id + "&openid=" + app.globalData.UserInfo.WeiXinOpenId,
                    });
                  }
                }
              });
            }
          });
        }
      }
    })
  }
});
