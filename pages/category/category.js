var app             = getApp(), $ = require("../../utils/util.js"), api = require("../../api/categoryAPI.js");
var templateMethods = require("../../utils/template_methods.js");
Page(Object.assign({}, templateMethods, {
    data              : {fid: 0, Category: [], CategoryTwo: []},
    onLoad            : function () {
      this.setMenu(this);
      this.GetCategoryList();
      app.globalData.getTop();
    }, ckCategoryitem : function (e) {
      this.setData({fid: e.currentTarget.dataset.id}), this.GetCategoryList();
    }, GetCategoryList: function () {
      var e = this, t = {fatherCategoryId: this.data.fid};
      $.xsr1($.makeUrl(api.GetCategorylist, t), function (n) {
        console.log(n), t.fatherCategoryId == 0 ? (e.setData({Category: n.dataList}), n.dataList.length > 0 && (e.setData({fid: n.dataList[0].id}), e.GetCategoryList())) : e.setData({CategoryTwo: n.dataList});
        if(n.dataList[0].is_dan){
          console.log('成功！');
          e.setData({
            productList:n.dataList[0].product
          })
          // wx.navigateTo({
          //   url:"/pages/search_product/search_product?cid="+n.dataList[0].id+"&cname="+n.dataList[0].name
          // })
        }
      });
    },
    onShareAppMessage : function () {
      return {
        title: app.globalData.VendorInfo.ShopName + '商品分类列表',
        desc : app.globalData.VendorInfo.VendorInfo + '商品分类列表',
        path : "/pages/category/category"
      };
    }
  })
);