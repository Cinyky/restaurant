function e(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}

var s = e(require("../../../utils/dg.js")), a = e(require("../../../utils/data.js")), i = e(require("../../../utils/requestUtil.js")), t = (e(require("../../../utils/underscore.js")), 
e(require("../../../utils/util.js")), e(require("../../house/tool/validator.js"))), o = s.default.os.isAlipay(), l = a.default.duoguan_host_api_url + "/index.php/addon/DuoguanHouse";
let app             = getApp();
let templateMethods = require("../../../../../utils/template_methods.js");
let myTools         = require('../../../../../utils/myTools');
let common          = require('../../../scripts/common');
let apiList         = require('../../../scripts/apiList');
Page(Object.assign({}, {
    data: {
        list: [],
        panel_bg_shade: "display-hide",
        cityAreaDisplayClass: "display-hide",
        decorationDisplayClass: "display-hide",
        useDisplayClass: "display-hide",
        houseTypeDisplayClass: "display-hide",
        city_area_id: 0,
        city_area: "",
        house_style_id: 0,
        house_style: "",
        house_lieb_id: 0,
        house_lieb: "",
        house_type_id: 0,
        house_type: "",
        house_floor: "",
        submitIsLoading: !1,
        buttonIsDisabled: !1
    },
    onLoad: function(e) {
      this.setMenu(this);
      app.globalData.getTop(this);
      //获取发帖条数
      this.getSetting();
      //获取用户信息
      this.addUserInfo();
    },
   
    // initialize: function(e) {
    //     var s = this, a = l + "/RegisterApi/getFormConfigList", t = {};
    //     i.default.get(a, t, function(e) {
    //         s.setData({
    //             list: e
    //         });
    //     });
    // },
    cityAreaTap: function(e) {
        this.setData({
            panel_bg_shade: "panel-bg-shade",
            cityAreaDisplayClass: ""
        });
    },
    cityAreaSelect: function(e) {
        this.setData({
            panel_bg_shade: "display-hide",
            cityAreaDisplayClass: "display-hide",
            city_area_id: e.currentTarget.dataset.id,
            city_area: e.currentTarget.dataset.name
        });
    },
    decorationTap: function(e) {
        this.setData({
            panel_bg_shade: "panel-bg-shade",
            decorationDisplayClass: ""
        });
    },
    decorationSelect: function(e) {
        this.setData({
            panel_bg_shade: "display-hide",
            decorationDisplayClass: "display-hide",
            house_style_id: e.currentTarget.dataset.id,
            house_style: e.currentTarget.dataset.name
        });
    },
    useTap: function(e) {
        this.setData({
            panel_bg_shade: "panel-bg-shade",
            useDisplayClass: ""
        });
    },
    useSelect: function(e) {
        this.setData({
            panel_bg_shade: "display-hide",
            useDisplayClass: "display-hide",
            house_lieb_id: e.currentTarget.dataset.id,
            house_lieb: e.currentTarget.dataset.name
        });
    },
    houseTypeTap: function(e) {
        this.setData({
            panel_bg_shade: "panel-bg-shade",
            houseTypeDisplayClass: ""
        });
    },
    houseTypeSelect: function(e) {
        this.setData({
            panel_bg_shade: "display-hide",
            houseTypeDisplayClass: "display-hide",
            house_type_id: e.currentTarget.dataset.id,
            house_type: e.currentTarget.dataset.name
        });
    },
    shadeHidden: function(e) {
        this.setData({
            panel_bg_shade: "display-hide",
            cityAreaDisplayClass: "display-hide",
            decorationDisplayClass: "display-hide",
            useDisplayClass: "display-hide",
            houseTypeDisplayClass: "display-hide"
        });
    },
    showToastError: function(e) {
        s.default.showToast({
            title: e,
            icon: "loading",
            duration: 800,
            mask: !0
        });
    },
    formSubmit: function(e) {
        var a = this, n = e.detail.value;
        if (0 == n.city_area_id) return this.showToastError("请先选择区域"), !1;
        if (0 == n.house_style_id) return this.showToastError("请先选择装修"), !1;
        if (0 == n.house_lieb_id) return this.showToastError("请先选择用途"), !1;
        if (0 == n.house_type_id) return this.showToastError("请先选择户型"), !1;
        if ("" == n.house_floor || null == n.house_floor) return this.showToastError("楼层不能为空！"), 
        !1;
        if ("" == n.mobile || null == n.mobile) return this.showToastError("手机号不能为空！"), 
        !1;
        if (1 == this.data.list.is_validated_mobile && !1 === t.default.isMobile(n.mobile)) return !1;
        if ("" == n.house_description || null == n.house_description) return this.showToastError("描述不能为空！"), 
        !1;
        this.setData({
            submitIsLoading: !0,
            buttonIsDisabled: !0
        }), n.is_sell = 1;
      let api = apiList.submitForm2;
      wx.request({
        url   : api.url,
        method: api.method,
        data  : {
          wid        : api.data.wid,
          userid     : this.data.userInfo.id,
          areaid     : n.city_area_id,
          // xiaoquid:this.data.xiaoquList[a.detail.value.xiaoqu].id,
          zhuangxiuid: n.house_style_id,
          yongtuid   : n.house_lieb_id,
          // name:i.house_name,
          // zujin:i.house_rental,
          // yajin:i.rental_style,
          huxing     : n.house_type,
          // niandai:i.house_age,
          // mianji:i.house_area,
          louceng    : n.house_floor,
          phone      : n.mobile,
          // biaoqian:i.signarr,
          desc       : n.house_description,
          type       : 2
          // beizhu:i.remark,
          // pics:this.data.reallyImg
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
                });
                a.setData({
                  submitIsLoading : !1,
                  buttonIsDisabled: !1
                });
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
        // var u = l + "/RegisterApi/add", d = n, r = "../../house/index/index";
        // i.default.post(u, d, function(e) {
        //     s.default.showToast({
        //         title: "添加成功！",
        //         icon: "success",
        //         duration: 3e3,
        //         success: function(e) {
        //             s.default.switchTab({
        //                 url: r,
        //                 fail: function(e) {
        //                     s.default.redirectTo({
        //                         url: r
        //                     });
        //                 }
        //             }), o && s.default.switchTab({
        //                 url: r,
        //                 fail: function(e) {
        //                     s.default.redirectTo({
        //                         url: r
        //                     });
        //                 }
        //             });
        //         }
        //     });
        // }, this, {
        //     completeAfter: function() {
        //         a.setData({
        //             submitIsLoading: !1,
        //             buttonIsDisabled: !1
        //         });
        //     }
        // });
    }
}, templateMethods, common));