let cf = require("../../../config.js");
module.exports = {
  getSetting: {
    url: cf.config.configUrl + "WeiTrain/getSetting.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  getTeacherInfo: {
    url: cf.config.configUrl + "WeiTrain/getTeacherInfo.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  getTeacherDetail:{
    url: cf.config.configUrl + "WeiTrain/getTeacherDetail.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  getLesson:{
    url: cf.config.configUrl + "WeiTrain/getLesson.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  getVideoList:{
    url: cf.config.configUrl + "WeiTrain/getVideoList.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  getLessonDetail:{
    url: cf.config.configUrl + "WeiTrain/getLessonDetail.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  saveYuyue:{
    url: cf.config.configUrl + "WeiTrain/saveYuyue.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  pay:{
    url: cf.config.configUrl + "WeiTrain/pay.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  },
  getMyLesson:{
    url: cf.config.configUrl + "WeiTrain/getMyLesson.html",
    data: {
      wid: cf.config.wid,
    },
    method: 'POST'
  }
};