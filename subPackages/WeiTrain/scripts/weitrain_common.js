let app        = getApp();
let myTools    = require('../../../utils/myTools');
// let wpcConfig = require('../scripts/config');
let apiList    = require('./apiList');
let WxParse         = require("../../../wxParse/wxParse.js");

module.exports = {
  //获取店铺基本信息
  getSetting() {
    let t   = this;
    let api = apiList.getSetting;
    wx.request({
      url   : api.url,
      method: api.method,
      data  : {
        wid: api.data.wid
        // openid: app.globalData.UserInfo.WeiXinOpenId,
      },
      success(resp) {
        let r = resp.data, rd = r.data;
        console.log('传递的数据：', rd);
        if (r.status != 'success') {
          wx.showModal({title: '错误', content: r.msg || '未知错误'});
          return false;
        }
        wx.setNavigationBarTitle({
          title: rd.train_name
        });
        t.setData({
          setting: rd
        });
      },
      fail() {
        wx.showModal({title: '错误', content: '网络错误'});
      }
    });
  },
  //获取老师信息
  getTeacherInfo() {
    let t   = this;
    let api = apiList.getTeacherInfo;
    wx.request({
      url   : api.url,
      method: api.method,
      data  : {
        wid: api.data.wid
      },
      success(resp){
        console.log(resp);
        t.setData({
          teacherInfo:resp.data.data
        })
      }
    })
  },
  //获取老师详细信息及课程
  getTeacherDetail(id){
    let t = this;
    let api = apiList.getTeacherDetail;
    wx.request({
      url:api.url,
      method:api.method,
      data:{
        teacherid:id,
        wid:api.data.wid
      },
      success(resp){
        console.log('老师信息：',resp);
        t.setData({
          teacherLesson:resp.data.data.lesson,
          teacherDetail:resp.data.data.teacher
        });
        //解析富文本
        WxParse.wxParse("info", "html", t.data.teacherDetail.desc, t);
      }
    })
  },
  //获取课程
  getLesson(){
    let t = this;
    let api = apiList.getLesson;
    wx.request({
      url:api.url,
      method:api.method,
      data:{
        wid:api.data.wid
      },
      success(resp){
        console.log(resp.data.data);
        t.setData({
          lesson:resp.data.data
        })
      }
    })
  },
  //获取单独的课程
  getLessonDetail(lessonId){
    let t = this;
    let api = apiList.getLessonDetail;
    wx.request({
      url:api.url,
      method:api.method,
      data:{
        wid:api.data.wid,
        lessonId:lessonId
      },
      success(resp){
        console.log('课程具体信息：',resp.data.data);
        t.setData({
          lesson:resp.data.data,
        });
        //获取老师信息
        t.getTeacherDetail(resp.data.data.teacherid);
        //解析富文本
        WxParse.wxParse("lesson_desc", "html", t.data.lesson.desc, t);
        WxParse.wxParse("lesson_notice", "html", t.data.lesson.notice, t);
      }
    })
  },
  //获取视频实录列表
  getVideoList(){
    let t = this;
    let api = apiList.getVideoList;
    wx.request({
      url:api.url,
      method:api.method,
      data:{
        wid:api.data.wid
      },
      success(resp){
        console.log(resp.data.data);
        t.setData({
          videos:resp.data.data
        })
      }
    })
  },
  //获取个人课表
  getMyLesson(){
    let t = this;
    app.GetUserInfo(function(){
      console.log("获取到的openid",app.globalData.UserInfo.WeiXinOpenId);
      // t.setData({
      //   openid:app.globalData.UserInfo.WeiXinOpenId
      // });
      let openid = app.globalData.UserInfo.WeiXinOpenId;
      let api = apiList.getMyLesson;
      wx.request({
        url:api.url,
        method:api.method,
        data:{
          openid  : openid,
          wid:api.data.wid
        },
        success(resp){
          console.log('已购买课程及预约课程：',resp.data.data);
          t.setData({
            lesson:resp.data.data
          })
        }
      })
    });
    
  }
};