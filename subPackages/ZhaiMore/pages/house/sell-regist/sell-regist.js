function a(a) {
  return a && a.__esModule ? a : {
    default: a
  };
}

var e               = Object.assign || function (a) {
  for (var e = 1; e < arguments.length; e++) {
    var t = arguments[e];
    for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && (a[i] = t[i]);
  }
  return a;
}, t                = a(require("../../../utils/dg")), i = a(require("../../../utils/data")), s = a(require("../../../utils/requestUtil")), o = a(require("../../../utils/underscore")), r = a(require("../../../utils/util")), l = a(require("../../house/tool/validator")), n = t.default.os.isAlipay(), d = i.default.duoguan_host_api_url + "/index.php/addon/DuoguanHouse";
let app             = getApp();
let templateMethods = require("../../../../../utils/template_methods.js");
let myTools         = require('../../../../../utils/myTools');
let common          = require('../../../scripts/common');
let apiList         = require('../../../scripts/apiList');
Page(Object.assign({}, {
  data             : {
    pagefrom              : "list",
    id                    : 0,
    info                  : {},
    list                  : {
      isAgent     : !1,
      allow_number: 0,
      phone_number: 0
    },
    panel_bg_shade        : "display-hide",
    cityAreaDisplayClass  : "display-hide",
    decorationDisplayClass: "display-hide",
    useDisplayClass       : "display-hide",
    houseTypeDisplayClass : "display-hide",
    houseAgeDisplayClass  : "display-hide",
    city_area_id          : 0,
    city_area             : "",
    city_area_index       : 0,
    house_style_id        : 0,
    house_style           : "",
    house_lieb_id         : 0,
    house_lieb            : "",
    house_type_id         : 0,
    house_type            : "",
    house_floor           : "",
    // house_age             : 0,
    imageList             : [],
    imageArray            : [],
    isShowHouseAge        : !0,
    villageListIndex      : 0,
    really     : []
  },
  onLoad           : function (a) {
    this.setMenu(this);
    app.globalData.getTop(this);
    //获取发帖条数
    this.getSetting();
    //获取用户信息
    this.addUserInfo();
    a.id > 0 && this.setData({
      pagefrom: a.pagefrom || "list",
      id      : a.id
    });
    // var e = this;
    // r.default.trySyncUserInfo(function (a) {
    //   e.initialize();
    // });
  },
  //成为经纪人
  becomeAgent: function (a) {
    var e = this;
    wx.showModal({
      title:'是否确认',
      content:'成为经纪人之后，发房源会开放更多权限',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定');
          var i = (e.data.jumpSwiperUrls.phone || 0) + "";
          wx.makePhoneCall({
            phoneNumber: i
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    });
  },
  
  //选择区域
  cityAreaTap: function(a) {
    this.setData({
      panel_bg_shade: "panel-bg-shade",
      cityAreaDisplayClass: ""
    });
  },
  cityAreaSelect: function(a) {
    var e = a.currentTarget.dataset.id;
    e != this.data.city_area_id, this.setData({
      panel_bg_shade: "display-hide",
      cityAreaDisplayClass: "display-hide",
      city_area_id: a.currentTarget.dataset.id,
      city_area: a.currentTarget.dataset.name
    });
    //获取小区
    this.getXiaoQu(this.data.city_area_id);
  },
  
  //小区选择
  pickerChange: function(a) {
    a.currentTarget.dataset.name;
    let thi = this;
    var t = a.detail.value, i = {};
    this.setData({
      vill_id:t,
    });
    "vill_id" && (i.villageListIndex = t), this.setData(Object.assign({}, i));
    console.log(this.data.vill_id);
  },
  
  //装修选择
  decorationTap: function(a) {
    this.setData({
      panel_bg_shade: "panel-bg-shade",
      decorationDisplayClass: ""
    });
  },
  decorationSelect: function(a) {
    this.setData({
      panel_bg_shade: "display-hide",
      decorationDisplayClass: "display-hide",
      house_style_id: a.currentTarget.dataset.id,
      house_style: a.currentTarget.dataset.name
    });
  },
  
  //选择用途
  useTap: function(a) {
    this.setData({
      panel_bg_shade: "panel-bg-shade",
      useDisplayClass: ""
    });
  },
  useSelect: function(a) {
    this.setData({
      panel_bg_shade: "display-hide",
      useDisplayClass: "display-hide",
      house_lieb_id: a.currentTarget.dataset.id,
      house_lieb: a.currentTarget.dataset.name
    });
  },
  //图片
  onChooseImage: function() {
    var a = this;
    wx.chooseImage({
      count: 9,
      sizeType: [ "original", "compressed" ],
      sourceType: [ "album", "camera" ],
      success: function(e) {
        var t = a.data.imageArray;
        (t = t.concat(e.tempFilePaths)).length > 10 && (t = t.splice(t.length - 3, t.length - 1)),
          a.setData({
            imageList: t,
            imageArray: t
          });
      }
    });
  },
  
  //提交
  formSubmit: function(a) {
    console.log('表单数据：', a.detail.value);
    // console.log('用户信息：',this.data.userInfo.allow_num);
    // console.log('小区信息：',this.data.xiaoquList[a.detail.value.xiaoqu].id);
    var e = this;
    //判断发帖数量是否达到上限
    if (this.data.userInfo.allow_num <= 0)
      return t.default.alert("今日售价发已用完！", null, "温馨提示"), !1;
    var i = a.detail.value;
  
    // console.log('userid：',this.data.userInfo.id);
    // console.log('区域id：',i.city_area_id);
    // console.log('小区id：',this.data.xiaoquList[a.detail.value.xiaoqu].id);
    // console.log('装修：',i.house_style_id);
    // console.log('用途：',i.house_lieb_id);
    // console.log('屋名：',i.house_name);
    // console.log('售价：',i.house_total);
    // console.log('户型：',i.house_type);
    // console.log('年代：',i.house_age);
    // console.log('面积：',i.house_area);
    // console.log('楼层：',i.house_floor);
    // console.log('手机号：',i.mobile);
    // console.log('标签：',i.signarr);
    // console.log('描述：',i.house_description);
    // console.log('备注：',i.remark);
    // console.log('图片：',this.data.reallyImg);return;
  
    // if (i.is_show_house_age = this.data.isShowHouseAge ? 1 : 0, this.data.list.villageList[this.data.villageListIndex] ? i.vill_id = this.data.list.villageList[this.data.villageListIndex].id || 0 : i.vill_id = 0, 0 == i.city_area_id)
    if (i.city_area_id == 0)
      return this.showToastError("请先选择区域");
    if (0 == i.vill_id) return this.showToastError("请先选择小区"), !1;
    if (0 == i.house_style_id) return this.showToastError("请先选择装修"), !1;
    if (0 == i.house_lieb_id) return this.showToastError("请先选择用途"), !1;
    if ("" == i.house_name || null == i.house_name) return this.showToastError("请输入房屋名称"), !1;
    if ("" == i.house_total || null == i.house_total) return this.showToastError("请输入售价"), !1;
    var r = parseFloat(i.house_total);
    if (isNaN(r)) return this.showToastError("售价只能是数字!"), !1;
    // if ("" == i.rental_style || null == i.rental_style) return this.showToastError("请输入押金类型"), !1;
    if ("" == i.house_type) return this.showToastError("请先选择户型"), !1;
    if (0 == i.house_age && this.data.isShowHouseAge) return this.showToastError("请输入年代"), !1;
    if ("" == i.house_area || null == i.house_area) return this.showToastError("请输入住房面积"), !1;
    var o = parseFloat(i.house_area);
    if (isNaN(o)) return this.showToastError("住房面积为数字!"), !1;
    if ("" == i.house_floor || null == i.house_floor) return this.showToastError("楼层不能为空！"), !1;
    if ("" == i.mobile || null == i.mobile) return this.showToastError("手机号为空！"), !1;
    if (1 == this.data.list.is_validated_mobile && !1 === l.default.isMobile(i.mobile)) return !1;
    if ("" == i.house_description || null == i.house_description) return this.showToastError("描述不能为空！"), !1;
    if (this.data.reallyImg == "") return this.showToastError("请上传房屋图片！"), !1;
    let api = apiList.submitForm;
    wx.request({
      url   : api.url,
      method: api.method,
      data  : {
        wid        : api.data.wid,
        userid     : this.data.userInfo.id,
        areaid     : i.city_area_id,
        xiaoquid   : this.data.xiaoquList[a.detail.value.xiaoqu].id,
        zhuangxiuid: i.house_style_id,
        yongtuid   : i.house_lieb_id,
        name       : i.house_name,
        shoujia      : i.house_total,
        huxing     : i.house_type,
        niandai    : i.house_age,
        mianji     : i.house_area,
        louceng    : i.house_floor,
        phone      : i.mobile,
        biaoqian   : i.signarr,
        desc       : i.house_description,
        beizhu     : i.remark,
        pics       : this.data.reallyImg
      },
      success(resp) {
        let r = resp.data, rd = r.data;
        console.log('传递的数据2333333：', rd);
        if (r.status != 'success') {
          wx.showModal({title: '错误', content: r.msg || '未知错误'});
          return false;
        } else {
          wx.showModal({
            title  : '成功',
            content: '发成功！',
            success: function () {
              wx.navigateTo({
                url: "/subPackages/ZhaiMore/pages/house/index/index"
              })
            }
          });
        }
        // e.setData({
        //   test: rd
        // });
      },
      fail() {
        wx.showModal({title: '错误', content: '网络错误'});
      }
    });
  },
  chooseReally : function (e) {
    var that = this;
    let api  = apiList.uploadImg;
    wx.chooseImage({
      count     : 6,
      sizeType  : ['compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success   : function (resp) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var reallyimg = resp.tempFilePaths;
        // console.log('上传图片回调',reallyimg.length);return;
        for (var i = 0; i < reallyimg.length; i++) {
          wx.uploadFile({
            url     : api.url,
            filePath: reallyimg[i],
            name    : 'img',
            method  : 'POST',
            success : function (res) {
              let r   = JSON.parse(res.data);
              let url = r.data;
              console.log('url为：', url);
              let reallyImg = that.data.really;
              for (let i = 0; i < reallyImg.length; i++) {
                if (reallyImg[i] == url) {
                  wx.showToast({title: '图片已存在'});
                  return false;
                }
              }
              reallyImg.push(url);
              that.setData({reallyImg: reallyImg});
            }
          });
        }
      }
    })
  },
  //显示实景
  previewReally: function (e) {
    wx.previewImage({
      urls: this.data.reallyImg // 需要预览的图片http链接列表
    });
  },
  //提示错误
  showToastError: function(a) {
    wx.showToast({
      title: a,
      icon: "loading",
      duration: 800,
      mask: !0
    });
  },
  // initialize       : function (a) {
  //   var i = this, o = d + "/ResourceApi/getSellFormConfigList", r = {};
  //   s.default.get(o, r, function (a) {
  //     var s = {};
  //     s.city_area_index = i.data.city_area_index, s.city_area_id = i.data.city_area_id,
  //       s.city_area = i.data.city_area, 0 == s.city_area_index && a.cityAreaList[0] && (s.city_area = a.cityAreaList[0].name,
  //       s.city_area_id = a.cityAreaList[0].id, s.city_area_index = 0), i.setData(e({
  //       list: a
  //     }, s)), 0 != i.data.id ? i.afterInitialize(i.data.id) : (a.allow_number <= 0 && t.default.alert("今日出售发已用完！", null, "温馨提示"),
  //       i.initVillage(s.city_area_id));
  //   });
  // },
  // afterInitialize  : function (a) {
  //   var t = this, i = d + "/ResourceApi/sellInfo", r = {
  //     id: a
  //   };
  //   s.default.get(i, r, function (a) {
  //     var i = {};
  //     i.city_area_index = t.data.city_area_index, i.city_area_id = a.city_area_id, i.city_area = t.data.city_area;
  //     var s = !1, r = t.data.list.cityAreaList;
  //     r[0] && o.default.map(r, function (a, e) {
  //       return a.id == i.city_area_id && (s = !0, i.city_area_index = e, i.city_area = a.name),
  //         a;
  //     }), 0 == s && (i.city_area_id = t.data.city_area_id), t.setData(e({
  //       info: a
  //     }, a, i, {
  //       isShowHouseAge: "1" == a.is_show_house_age
  //     })), t.initVillage(i.city_area_id);
  //   }, this, {
  //     isShowLoading: !1
  //   });
  // },
  // initVillage      : function (a) {
  //   var e = this;
  //   console.log("initVillage");
  //   var t = d + "/ResourceApi/getVillageUnderCityAreaList", i = {
  //     city_area_id: a
  //   };
  //   s.default.get(t, i, function (a) {
  //     var t = e.data.list;
  //     if (a instanceof Array) {
  //       t.villageList = a;
  //       var i         = 0;
  //       if (0 != e.data.id) {
  //         var s = e.data.vill_id || 0;
  //         o.default.map(t.villageList, function (a, e) {
  //           return a.id == s && (i = e), a;
  //         });
  //       }
  //       e.setData({
  //         list            : t,
  //         villageListIndex: i
  //       });
  //     }
  //   }, this, {
  //     isShowLoading: !1
  //   });
  // },
  // cityAreaTap      : function (a) {
  //   this.setData({
  //     panel_bg_shade      : "panel-bg-shade",
  //     cityAreaDisplayClass: ""
  //   });
  // },
  // cityAreaSelect   : function (a) {
  //   var e = a.currentTarget.dataset.id;
  //   e != this.data.city_area_id && this.initVillage(e), this.setData({
  //     panel_bg_shade      : "display-hide",
  //     cityAreaDisplayClass: "display-hide",
  //     city_area_id        : a.currentTarget.dataset.id,
  //     city_area           : a.currentTarget.dataset.name
  //   });
  // },
  // decorationTap    : function (a) {
  //   this.setData({
  //     panel_bg_shade        : "panel-bg-shade",
  //     decorationDisplayClass: ""
  //   });
  // },
  // decorationSelect : function (a) {
  //   this.setData({
  //     panel_bg_shade        : "display-hide",
  //     decorationDisplayClass: "display-hide",
  //     house_style_id        : a.currentTarget.dataset.id,
  //     house_style           : a.currentTarget.dataset.name
  //   });
  // },
  // useTap           : function (a) {
  //   this.setData({
  //     panel_bg_shade : "panel-bg-shade",
  //     useDisplayClass: ""
  //   });
  // },
  // useSelect        : function (a) {
  //   this.setData({
  //     panel_bg_shade : "display-hide",
  //     useDisplayClass: "display-hide",
  //     house_lieb_id  : a.currentTarget.dataset.id,
  //     house_lieb     : a.currentTarget.dataset.name
  //   });
  // },
  // houseTypeTap     : function (a) {
  //   this.setData({
  //     panel_bg_shade       : "panel-bg-shade",
  //     houseTypeDisplayClass: ""
  //   });
  // },
  // houseTypeSelect  : function (a) {
  //   this.setData({
  //     panel_bg_shade       : "display-hide",
  //     houseTypeDisplayClass: "display-hide",
  //     house_type_id        : a.currentTarget.dataset.id,
  //     house_type           : a.currentTarget.dataset.name
  //   });
  // },
  // houseAgeTap      : function (a) {
  //   this.setData({
  //     panel_bg_shade      : "panel-bg-shade",
  //     houseAgeDisplayClass: ""
  //   });
  // },
  // houseAgeSelect   : function (a) {
  //   this.setData({
  //     panel_bg_shade      : "display-hide",
  //     houseAgeDisplayClass: "display-hide",
  //     house_age           : a.currentTarget.dataset.houseAge
  //   });
  // },
  // shadeHidden      : function (a) {
  //   this.setData({
  //     panel_bg_shade        : "display-hide",
  //     cityAreaDisplayClass  : "display-hide",
  //     villageDisplayClass   : "display-hide",
  //     decorationDisplayClass: "display-hide",
  //     useDisplayClass       : "display-hide",
  //     houseTypeDisplayClass : "display-hide",
  //     houseAgeDisplayClass  : "display-hide"
  //   });
  // },
  // showToastError   : function (a) {
  //   t.default.showToast({
  //     title   : a,
  //     icon    : "loading",
  //     duration: 800,
  //     mask    : !0
  //   });
  // },
  // formSubmit       : function (a) {
  //   var e = this;
  //   if (this.data.list.allow_number <= 0) return t.default.alert("今日出售发已用完！", null, "温馨提示"),
  //     !1;
  //   var i = a.detail.value;
  //   if (i.is_show_house_age = this.data.isShowHouseAge ? 1 : 0, this.data.list.villageList[this.data.villageListIndex] ? i.vill_id = this.data.list.villageList[this.data.villageListIndex].id || 0 : i.vill_id = 0,
  //   0 == i.city_area_id) return this.showToastError("请先选择区域"), !1;
  //   if (0 == i.vill_id) return this.showToastError("请先选择小区"), !1;
  //   if (0 == i.house_style_id) return this.showToastError("请先选择装修"), !1;
  //   if (0 == i.house_lieb_id) return this.showToastError("请先选择用途"), !1;
  //   if ("" == i.house_name || null == i.house_name) return this.showToastError("请先输入房屋名称"),
  //     !1;
  //   if ("" == i.house_total || null == i.house_total) return this.showToastError("请先输入售价"),
  //     !1;
  //   var o = parseFloat(i.house_total);
  //   if (isNaN(o)) return this.showToastError("售价只能是数字!"), !1;
  //   if (0 == i.house_type_id) return this.showToastError("请先选择户型"), !1;
  //   if (0 == i.house_age && this.data.isShowHouseAge) return this.showToastError("请先选择年代"),
  //     !1;
  //   if ("" == i.house_area || null == i.house_area) return this.showToastError("请先输入住房面积！"),
  //     !1;
  //   var r = parseFloat(i.house_area);
  //   if (isNaN(r)) return this.showToastError("住房面积只能是数字!"), !1;
  //   if ("" == i.house_floor || null == i.house_floor) return this.showToastError("楼层不能为空！"),
  //     !1;
  //   if ("" == i.mobile || null == i.mobile) return this.showToastError("手机号不能为空！"),
  //     !1;
  //   if (1 == this.data.list.is_validated_mobile && !1 === l.default.isMobile(i.mobile)) return !1;
  //   if ("" == i.house_description || null == i.house_description) return this.showToastError("描述不能为空！"),
  //     !1;
  //   if (this.data.imageList.length < 1 && "edit" != this.data.pagefrom) return this.showToastError("请先上传房屋图片！"),
  //     !1;
  //   var u = function (a) {
  //     if (console.log(a), "edit" == e.data.pagefrom && (e.data.house_photo != [] && (a = a.concat(e.data.house_photo)),
  //       i.method = "PUT", i.id = e.data.info.id), a == []) return e.showToastError("请先上传房屋图片！"),
  //       !1;
  //     i.house_photo = JSON.stringify(a), e.setData({
  //       submitIsLoading : !0,
  //       buttonIsDisabled: !0
  //     });
  //     var o = d + "/ResourceApi/sellInfo", r = i, l = "../../house/index/index";
  //     s.default.post(o, r, function (a) {
  //       t.default.showToast({
  //         title   : "添加成功！",
  //         icon    : "success",
  //         duration: 3e3,
  //         success : function (a) {
  //           t.default.switchTab({
  //             url : l,
  //             fail: function (a) {
  //               t.default.redirectTo({
  //                 url: l
  //               });
  //             }
  //           });
  //         }
  //       }), n && t.default.switchTab({
  //         url : l,
  //         fail: function (a) {
  //           t.default.redirectTo({
  //             url: l
  //           });
  //         }
  //       });
  //     }, e, {
  //       completeAfter: function () {
  //         e.setData({
  //           submitIsLoading : !1,
  //           buttonIsDisabled: !1
  //         });
  //       }
  //     });
  //   };
  //   this.data.imageList.length ? this.uploadImage(this.data.imageList, u) : u([]);
  // },
  // uploadImage      : function (a, e, t) {
  //   var i = this, o = a.shift();
  //   t = t || [], s.default.upload(d + "/BaseApi/uploadImg", o, "file", {}, function (s) {
  //     t.push(s), a.length ? i.uploadImage(a, e, t) : e.apply(i, [t]);
  //   });
  // },
  // onChooseImage    : function () {
  //   var a = this;
  //   t.default.chooseImage({
  //     count     : 9,
  //     sizeType  : ["original", "compressed"],
  //     sourceType: ["album", "camera"],
  //     success   : function (e) {
  //       var t = a.data.imageArray;
  //       (t = t.concat(n ? e.apFilePaths : e.tempFilePaths)).length > 10 && (t = t.splice(t.length - 3, t.length - 1)),
  //         a.setData({
  //           imageList : t,
  //           imageArray: t
  //         });
  //     }
  //   });
  // },
  // tapDeleteImage   : function (a) {
  //   var e = this, i = a.currentTarget.dataset, s = i.stage, o = i.index;
  //   t.default.confirm("确定要删除图片吗？", function (a) {
  //     if (a.confirm) if ("edit" == s) {
  //       var t = e.data.house_photo, i = e.data.house_photo_urls;
  //       t.splice(o, 1), i.splice(o, 1), e.setData({
  //         house_photo     : t,
  //         house_photo_urls: i
  //       });
  //     } else {
  //       var r = e.data.imageArray;
  //       r.splice(o, 1), e.setData({
  //         imageList: r
  //       });
  //     }
  //   }, "删除");
  // },
  // tapPreviewImage  : function (a) {
  //   var e = a.currentTarget.dataset, i = e.stage, s = e.src, r = "edit" == i ? this.data.house_photo_urls : this.data.imageList;
  //   n && o.default.map(r, function (a, e) {
  //     a == s && (s = e);
  //   }), t.default.previewImage({
  //     current: s,
  //     urls   : r
  //   });
  // },
  // becomeAgent      : function (a) {
  //   var e = this;
  //   t.default.confirm("成为经纪人之后，发房源会开放更多权限", function (a) {
  //     if (a.confirm) {
  //       var i = (e.data.list.phone_number || 0) + "";
  //       t.default.makePhoneCall({
  //         phoneNumber: i
  //       });
  //     }
  //   }, "温馨提示");
  // },
  // switchChange     : function (a) {
  //   var t = a.currentTarget.dataset.name, i = {};
  //   i[t] = !this.data[t], this.setData(e({}, i));
  // },
  // pickerChange     : function (a) {
  //   a.currentTarget.dataset.name;
  //   var t = a.detail.value || 0, i = {};
  //   "vill_id" && (i.villageListIndex = t), this.setData(e({}, i));
  // }
}, templateMethods, common));