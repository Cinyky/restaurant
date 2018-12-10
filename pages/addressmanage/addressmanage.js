var app = getApp(),
  $ = require("../../utils/util.js"),
  userapi = require("../../api/userAPI.js"),
  notice = require("../../utils/notice.js");
Page({
  data: {
    Pindex: 0,
    Cindex: 0,
    Dindex: 0,
    PCDlist: {},
    Province: {},
    City: {},
    District: {},
    selectProId: 0,
    selectCid: 0,
    selectDid: 0,
    adid: 0,
    spid: "",
    addressinfo: {},
    seladstr: "",
    isShow: !1,
    isDefault: !1,
    showconsignee: "",
    showdetail: "",
    showphone: "",
    showisDefault: "",
    consignee: "",
    detail: "",
    value: [0, 0, 0],
    phone: "",
    isre: !0,
    issub: !1
  },
  onLoad: function(e) {
    var t = this;
    app.globalData.getTop();
    this.setData({
      issub: e.issub,
      adid: e.adid || 0,
      spid: e.spid || ""
    });
    var n = this;
    if (e.adid > 0) {
      wx.setNavigationBarTitle({
        title: "修改地址"
      });
      var r = {
        Id: e.adid
      };
      $.xsr($.makeUrl(userapi.GetAddressDetail, r), function(e) {
        n.setData({
          addressinfo: e.dataList[0],
          selectProId: e.dataList[0].province,
          selectCid: e.dataList[0].city,
          selectDid: e.dataList[0].district,
          showconsignee: e.dataList[0].consignee,
          showdetail: e.dataList[0].detail,
          showphone: e.dataList[0].phone,
          showisDefault: e.dataList[0].isDefault,
          consignee: e.dataList[0].consignee,
          detail: e.dataList[0].detail,
          isDefault: e.dataList[0].isDefault,
          phone: e.dataList[0].phone
        }), n.GetAllPCDList(function() {
          t.seladress()
        })
      })
    } else n.GetAllPCDList(function() {
      t.seladress()
    })
  },
  onShow: function () {
    var a = wx.getStorageSync('navigation');
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: a.selectedColor || '#000'
    });
    this.setData({ __wechat_main_color: a.selectedColor });
  },
  GetAllPCDList: function(e) {
    var t = this;
    $.getCache("pcdlist", function(n) {
      console.log(n), t.setData({
        PCDlist: n.data
      }), e()
    }, function(n) {
      $.xsr($.makeUrl(userapi.GetAllPCDList, ''), function(n) {
        $.setCache("pcdlist", n, function() {
          t.setData({
            PCDlist: n
          }), e()
        })
      })
    })
  },
  GetProvince: function() {
    var e = this.data.PCDlist.PList,
      t = [],
      n = [];
    for (var r in e) t.push(e[r].ProvinceName), n.push(e[r].ProvinceID), this.data.selectProId == e[r].ProvinceID && this.setData({
      Pindex: r
    });
    this.setData({
      Province: {
        pname: t,
        pid: n
      }
    })
  },
  inputconsignee: function(e) {
    this.setData({
      consignee: e.detail.value
    })
  },
  inputdetail: function(e) {
    return this.setData({
      detail: e.detail.value
    }), e.detail.value
  },
  inputphone: function(e) {
    this.setData({
      phone: e.detail.value
    }), /^1[34578]\d{9}$/.test(e.detail.value) ? this.setData({
      isre: !0
    }) : this.setData({
      isre: !1
    })
  },
  ckDefault: function(e) {
    this.setData({
      isDefault: e.detail.value
    })
  },
  submitinfo: function() {
    if ($.isNull(this.data.consignee)) return;
    if ($.isNull(this.data.detail)) return;
    if ($.isNull(this.data.phone)) return;
    if (!this.data.isre) return;
    if (this.data.selectCid <= 0) {
      $.alert("请选择省市区！");
      return
    }
    var e = {
        openId: app.globalData.UserInfo.WeiXinOpenId,
        consignee: this.data.consignee,
        province: this.data.selectProId,
        city: this.data.selectCid,
        district: this.data.selectDid,
        detail: this.data.detail,
        isDefault: this.data.isDefault,
        phone: this.data.phone,
        seladstr: this.data.seladstr
      },
      t = this;
    this.data.adid <= 0 ? $.xsr($.makeUrl(userapi.AddAddress, e), function(e) {
      e.errcode == 0 && wx.showToast({
        title: "添加成功",
        icon: "success",
        duration: 2e3,
        success: function() {
          t.data.issub === "true" ? t.data.adid < 0 ? $.backpage(1, function() {
            var n = {
              adid: e.dataList[0],
              spid: t.data.spid
            };
            notice.postNotificationName("RefreshOrder", n)
          }) : $.backpage(1, function() {
            var n = {
              adid: e.dataList[0],
              spid: t.data.spid
            };
            notice.postNotificationName("RefreshOrder", n)
          }) : $.backpage(1, function() {
            notice.postNotificationName("Refresh", "发送消息！")
          })
        }
      })
    }) : (e.id = this.data.adid, $.xsr($.makeUrl(userapi.EditAddress, e), function(e) {
      e.errcode == 0 && wx.showToast({
        title: "修改成功",
        icon: "success",
        duration: 2e3,
        success: function() {
          t.data.issub === "true" ? $.backpage(1, function() {
            var e = {
              adid: t.data.adid,
              spid: t.data.spid
            };
            notice.postNotificationName("RefreshOrder", e)
          }) : $.backpage(1, function() {
            notice.postNotificationName("Refresh", "发送消息！")
          })
        }
      })
    }))
  },
  bindChange: function(e) {
    e.detail.value[0] != this.data.value[0] ? this.setData({
      value: [e.detail.value[0], 0, 0]
    }) : e.detail.value[1] != this.data.value[1] ? this.setData({
      value: [e.detail.value[0], e.detail.value[1], 0]
    }) : this.setData({
      value: [e.detail.value[0], e.detail.value[1], e.detail.value[2]]
    }), this.seladress(this.data.value[0], this.data.value[1], this.data.value[2]), this.setData({
      Pindex: this.data.value[0],
      selectProId: this.data.Province.pid[this.data.value[0]],
      selectCid: this.data.City.cid[this.data.value[1]],
      selectDid: this.data.District.did[this.data.value[2]]
    })
  },
  seladress: function(e, t, n) {
    var r = this,
      i = [],
      s = [];
    for (var o in this.data.PCDlist.PList) i.push(this.data.PCDlist.PList[o].ProvinceName), s.push(this.data.PCDlist.PList[o].ProvinceID);
    this.setData({
      Province: {
        pname: i,
        pid: s
      }
    });
    var u = [],
      a = [];
    this.data.PCDlist.CList.map(function(t) {
      t.ProvinceID == (r.data.Province.pid[e || 0] ? r.data.Province.pid[e || 0] : r.data.Province.pid[0]) && (u.push(t.CityName), a.push(t.CityID))
    }), this.setData({
      City: {
        cname: u,
        cid: a
      }
    });
    var f = [],
      l = [];
    this.data.PCDlist.DList.map(function(e) {
      e.CityID == (r.data.City.cid[t || 0] ? r.data.City.cid[t || 0] : r.data.City.cid[0]) && (f.push(e.DistrictName), l.push(e.DistrictID))
    }), r.setData({
      District: {
        dname: f,
        did: l
      }
    });
    var c = [];
    $.isNull(r.data.Province.pname[e]) ? this.data.PCDlist.PList.map(function(e) {
      e.ProvinceID == r.data.selectProId && c.push(e.ProvinceName)
    }) : c.push(r.data.Province.pname[e]), $.isNull(r.data.City.cname[t]) ? this.data.PCDlist.CList.map(function(e) {
      e.CityID == r.data.selectCid && c.push(e.CityName)
    }) : c.push(r.data.City.cname[t]), $.isNull(r.data.District.dname[n]) ? this.data.PCDlist.DList.map(function(e) {
      e.DistrictID == r.data.selectDid && c.push(e.DistrictName)
    }) : c.push(r.data.District.dname[n]), this.setData({
      seladstr: $.isNull(c.toString()) ? "请选择地址" : c.toString()
    })
  },
  closead: function() {
    this.setData({
      isShow: !1
    })
  },
  showbox: function() {
    this.setData({
      isShow: !0
    })
  }
});