var app = getApp(), $ = require("../../utils/util.js"), cartapi = require("../../api/cartAPI.js");
var templateMethods = require("../../utils/template_methods.js");
Page(Object.assign({},templateMethods,{
  data: {isckall: !1, isck: !1, cartlist: {}, X_Start: 0, X_End: 0, T_Id: 0, Sel_Id: [], isdata: !1},
  onLoad(){
    this.setMenu(this);
  },
  onShow: function () {
    this.getcartlist();
    app.globalData.getTop();
  },
  onPullDownRefresh: function () {
    this.getcartlist();
  },
  ckalllength: function (e) {
    var t = this, n = [];
    if (!$.isNull(e.dataList.VendorList)) {
      var r = e.dataList.VendorList[0].ShoppingCartList, i = 0, s = r.length;
      for (var o in r) r[o].IsCheck && (i++ , n.push(r[o].Id));
      t.setData({Sel_Id: n}), i === s ? this.setData({isckall: !0}) : this.setData({isckall: !1}), i > 0 ? this.setData({isck: !0}) : this.setData({isck: !1});
    } else this.setData({isdata: !1});
  },
  ckitem: function (e) {
    var t = {
      openId: app.globalData.UserInfo.WeiXinOpenId,
      CID: e.currentTarget.dataset.id,
      IsCK: e.currentTarget.dataset.isck ? "false" : "true"
    }, n = this;
    $.xsr($.makeUrl(cartapi.CKCartItem, t), function (e) {
      if (e.errcode == 0) {
        n.getcartlist();
      }
    });
  },
  ckall: function (e) {
    var t = {
      openId: app.globalData.UserInfo.WeiXinOpenId,
      CID: "0",
      IsCK: e.currentTarget.dataset.isck ? "false" : "true"
    }, n = this;
    $.xsr($.makeUrl(cartapi.CKCartItem, t), function (e) {
      if (e.errcode == 0) {
        n.getcartlist();
      }
    });
  },
  sub: function (e) {
    var t = {
      btntype: 2,
      numval: e.currentTarget.dataset.num,
      CID: e.currentTarget.dataset.cid,
      stock: e.currentTarget.dataset.stock
    };
    this.unifiedNum(t);
  },
  add: function (e) {
    var t = {
      btntype: 1,
      numval: e.currentTarget.dataset.num,
      CID: e.currentTarget.dataset.cid,
      stock: e.currentTarget.dataset.stock
    };
    console.log(e), this.unifiedNum(t);
  },
  writenum: function (e) {
    var t = {
      btntype: 3,
      numval: e.detail.value,
      CID: e.currentTarget.dataset.cid,
      stock: e.currentTarget.dataset.stock
    };
    console.log(t.stock), this.unifiedNum(t);
  },
  unifiedNum: function (e) {
    var t = {value: parseInt(e.numval), stock: parseInt(e.stock)};
    e.btntype == 1 && (t.value = t.value + 1), e.btntype == 2 && (t.value = t.value - 1), t.value > t.stock && (t.value = t.stock), t.value <= 0 && (t.value = 1);
    var n = {openId: app.globalData.UserInfo.WeiXinOpenId, CID: e.CID, Num: t.value}, r = this;
    $.xsr($.makeUrl(cartapi.SetSetCartNum, n), function (e) {
      console.log("購物車===》", e);
      if (e.errcode == 0) {
        r.getcartlist();
      }
    });
  },
  getcartlist: function () {
    var e = this, t = {openId: app.globalData.UserInfo.WeiXinOpenId};
    $.xsr($.makeUrl(cartapi.GetCartList, t), function (t) {
      console.log("GetCartList====>", t), e.ckalllength(t), e.setData({
        cartlist: t.dataList,
        isdata: t.dataList.VendorList[0].ShoppingCartList.length ? !0 : !1
      }), wx.stopPullDownRefresh();
    });
  },
  removestart: function (e) {
    this.setData({X_Start: e.changedTouches[0].clientX});
  },
  removeload: function (e) {
    this.setData({X_End: e.changedTouches[0].clientX});
  },
  removeend: function (e) {
    this.setData({X_End: e.changedTouches[0].clientX}), this.direction(e.currentTarget.dataset.id);
  },
  direction: function (e) {
    var t = {xstart: this.data.X_Start, xend: this.data.X_End};
    t.xstart > t.xend ? t.xstart - t.xend > 100 && this.setData({T_Id: e}) : this.setData({T_Id: 0});
  },
  delcart: function (e) {
    var t = this;
    wx.showModal({
      title: "提示", content: "确认要删除这个商品吗？", success: function (n) {
        if (n.confirm) {
          var r = {SptrId: e.currentTarget.dataset.id};
          $.xsr($.makeUrl(cartapi.DelCartItem, r), function (e) {
            t.getcartlist();
          });
        }
      }
    });
  },
  submitorder: function () {
    this.data.isck ? wx.navigateTo({url: "/pages/ordersubmit/ordersubmit"}) : wx.showModal({
      title: "提示",
      content: "请选择需要结算商品！",
      showCancel: !1
    });
  },
  delAll: function () {
    var e = this;
    e.data.Sel_Id.length <= 0 ? $.confirm("请选择需要删除的商品！") : $.confirm("是否删除选中商品？", function (t) {
      if (t.confirm) {
        var n = {SptrId: e.data.Sel_Id.toString()};
        $.xsr($.makeUrl(cartapi.DelCartItem, n), function (t) {
          e.getcartlist();
        });
      }
    }, !0);
  }
}));