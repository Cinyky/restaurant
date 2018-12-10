var app = getApp(),
	$ = require("../../utils/util.js"),
  activityapi = require("../../api/bespeakivityAPI.js"),
  ACTapi = require("../../api/bespeakcategoryAPI.js");
var templateMethods = require("../../utils/template_methods.js");
Page(Object.assign({},templateMethods,{
	data: {
		pageNumber: 1,
		PageSize: 10,
		ispage: !1,
		flag: !0,
		dataList: [],
		windowHeight: 0,
		categoryId: 0,
		Title: "",
    winHeight: "",
    currentTab: 0, 
    scrollLeft: 0, 
    expertList: [],
    fid: 0,
    Category: [],
    CategoryTwo: []
    	},
	onLoad: function(e) {
    this.setMenu(this);
    app.globalData.getTop();
		this.setData({
			categoryId: e.cid
		});
    this.GetCategoryList();
    try {
      var t = wx.getSystemInfoSync();
      this.setData({
        windowHeight: t.windowHeight
      })
    } catch (n) {
      console.log(" Do something when catch error")
    }
    this.GetNewsletterList(), this.GetNewsletterCategory()
    var that = this;
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 180;
        console.log(calc)
        that.setData({
          winHeight: calc
        });
      }
    });
	},
	GetNewsletterCategory: function() {
		var e = {
			categoryId: this.data.categoryId || 0
		},
			t = this;
		$.xsr($.makeUrl(activityapi.GetNewsletterCategory, e), function(e) {
			console.log(e), t.setData({
				Title: e.dataList
			}), wx.setNavigationBarTitle({
				title: t.data.Title.Name
			})
		})
	},
	GetNewsletterList: function() {
		var e = {
			pageNumber: this.data.pageNumber,
			PageSize: 10,
			categoryId: this.data.categoryId || 0
		},
			t = this;
		$.xsr($.makeUrl(activityapi.GetNewsletterList, e), function(e) {
			$.isNull(e.dataList), !$.isNull(e.dataList) && e.errcode == 0 ? (e.dataList.length < 10 && t.setData({
				flag: !1
			}), t.setData({
				ispage: !0,
				dataList: t.data.dataList.concat(e.dataList)
			})) : t.setData({
				flag: !1,
				ispage: !0
			})
		})
	},
	scrollbottom: function() {
		if (this.data.flag) {
			var e = this;
			clearTimeout(t);
			var t = setTimeout(function() {
				e.setData({
					pageNumber: e.data.pageNumber + 1
				}), e.GetNewsletterList()
			}, 500)
		}
	},

  GetCategoryList: function () {
    var e = this,
      t = {
        fatherCategoryId: this.data.fid
      };
    $.xsr1($.makeUrl(ACTapi.GetCategorylist, t), function (n) {
      console.log(n), t.fatherCategoryId == 0 ? (e.setData({
        Category: n.dataList
      }), n.dataList.length > 0 && (e.setData({
        fid: n.dataList[0].id
      }), e.GetCategoryList())) : e.setData({
        CategoryTwo: n.dataList
      })
    })
  },

  switchTab: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
    this.checkCor();
  },
  swichNav: function (e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) { return false; }
    else {
      this.setData({
        currentTab: cur
      })
    }
  },
  checkCor: function () {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },

  footerTap: app.footerTap
}));
