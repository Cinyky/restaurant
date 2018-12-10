function getNowFormatDate() {
  var e = new Date, t = "-", n = e.getMonth() + 1, r = e.getDate();
  n >= 1 && n <= 9 && (n = "0" + n), r >= 0 && r <= 9 && (r = "0" + r);
  var i = e.getFullYear() + t + n + t + r;
  return i;
}

var app = getApp(), $ = require("../../utils/util.js"), api = require("../../api/productAPI.js"),
  cartapi = require("../../api/cartAPI.js"), WxParse = require("../../wxParse/wxParse.js"),
  qiyeapi = require("../../api/supercard.js"),
  userapi = require("../../api/userAPI.js"), notice = require("../../utils/notice.js"), intervalDate;
Page({
  data: {
    selectsp: 0,
    selectct: 0,
    proId: 0,
    CommentImgList: [],
    splist: [],
    splistStr: [],
    numval: 1,
    stock: 0,
    inputval: 1,
    skuid: 0,
    selectimg: "",
    pname: "",
    desc: "",
    isCollection: !1,
    MEID: 0,
    eventId: 0,
    isdata: !0,
    tapindex: 1,
    ProductInfo: {},
    Coupons: [],
    isCancelSuccess: !0,
    isCancel: !0,
    CouponAmount: 0,
    IsNewUser: 0,
    flag: !1,
    flag1: !1,
    // 用户评价数据
    evPage: 1,
    evList: [],
    evHasMore: true,
    starNum: [1, 2, 3, 4, 5],
    jisu: false,
    tuikuan: false,
    baozhang: false,
    testarr: [],
    hidden: true,
    prurl: '',
    qrCodePath: '',

    demo: [
      {
        name: "weight",
        items: [1, 2, 3],
        selected: 2
      },
      {
        name: "height",
        items: [1, 2, 3],
        selected: 1
      },
      {
        name: "number",
        items: [1, 2, 3],
        selected: 3
      },
    ]
  }, onLoad: function (e) {
    var t = this;
    console.log('e下面的scene：', e.scene);
    var scene = decodeURIComponent(e.scene);
    console.log('获取到的scene：', scene);
    var scene_goodid = scene.split("=")[1];
    app.globalData.getTop();
    t.setData({tempE: e, scene_goodid: scene_goodid});
    //发送企业微信提示
    console.log('发送企业微信提示');
    t.sendQiYeMessage();
    t.saveEvent(2);
  }, onShow() {
    this.InitData(this.data.tempE);
  }, InitData: function (e) {
    var t = this;
    if (t.data.scene_goodid != undefined) {
      console.log('132');
      this.setData({
        proId: t.data.scene_goodid,
        splistStr: [],
        eventId: e.MEId
      }), $.isNull(app.globalData.UserInfo) ? app.GetUserInfo(function () {
        t.InitProduct();
      }, e.uid) : t.InitProduct();
    } else {
      this.setData({
        proId: e.id,
        splistStr: [],
        eventId: e.MEId
      }), $.isNull(app.globalData.UserInfo) ? app.GetUserInfo(function () {
        t.InitProduct();
      }, e.uid) : t.InitProduct();
    }

  }, InitProduct: function () {
    var e = this, t = {openId: app.globalData.UserInfo.WeiXinOpenId, proId: e.data.proId, eventId: e.data.eventId};
    // var e = this, t = {openId: 'otUkP0SZahBL8do47l__ehoidhms', proId: e.data.proId, eventId: e.data.eventId};
    $.xsr($.makeUrl(api.GetProductInfo, t), function (t) {
      e.setData({
        access_token: t.dataList.access_token
      });
      console.log('t为：', t);
      if (t.errcode > 0) e.setData({isdata: !1}); else {
        if (t.dataList[0].SpecLst.length > 0) for (var n in t.dataList[0].SpecLst) {
          for (var r in t.dataList[0].SpecLst[n].svLst) {
            if (t.dataList[0].SpecLst[n].svLst[r].IsChecked) {
              t.dataList[0].SpecLst[n].ckid = t.dataList[0].SpecLst[n].svLst[r].Id,
              e.data.splist.push(t.dataList[0].SpecLst[n].svLst[r].Id),
              e.data.splistStr.push(t.dataList[0].SpecLst[n].svLst[r].Name),
              e.setData(
               {selectimg: t.dataList[0].SpecLst[n].svLst[r].imagePath,
                stock:t.dataList[0].SpecLst[n].svLst[r].stock,
               });
            } else {
              e.setData({selectimg: t.dataList[0].ProductPic,
                        });
            }
          }
        }
        console.log(t.dataList[0].others);
        if (t.dataList[0].others) {
          for (var v in t.dataList[0].others) {
            console.log(v);
            if (t.dataList[0].others[v] == 'jisu') {
              e.setData({jisu: true});
            } else if (t.dataList[0].others[v] == 'tuikuan') {
              e.setData({tuikuan: true});
            } else if (t.dataList[0].others[v] == 'baozhang') {
              e.setData({baozhang: true});
            }
          }
        }
        wx.setNavigationBarTitle({title: t.dataList[0].SalesName}), e.setData({
          ProductInfo: t.dataList[0],
          isCollection: t.dataList[0].isCollection > 0 ? !0 : !1,
          skuid: t.dataList[0].ProductSKU_Id,
          desc: t.dataList[0].SellingPoints,
          pname: t.dataList[0].ProductName,
          //stock: t.dataList[0].Stock
        }), WxParse.wxParse("pinfo", "html", t.dataList[0].Describe, e), WxParse.wxParse("pinfo2", "html", t.dataList[0].ProductParameters, e);
        e.data.testarr[0] = e.data.ProductInfo.SpecLst[0].ckid;
        //e.stock = t.data.ProductInfo.SpecLst[0].svLst[0].stock;
      }
    });
  }, ckselectsp: function (e) {
    this.setData({change: e.currentTarget.offsetLeft, selectsp: 1, selectct: 1, flag: !0, flag1: !1});
  }, ckselectsp1: function (e) {
    this.setData({change: e.currentTarget.offsetLeft, selectsp: 1, selectct: 1, flag1: !0, flag: !1});
  }, closesp: function () {
    var e = this;
    e.setData({selectct: 0, flag: !1}), setTimeout(function () {
    e.setData({selectsp: 0});
    }, 1e3);
  }, selectsp: function (e) {
    var g = this.data.ProductInfo;
    // console.log(g);
    for (var n in g.SpecLst) {
      for (var r in g.SpecLst[n].svLst) {
        console.log(e.target);
        if (g.SpecLst[n].svLst[r].Id == e.currentTarget.dataset.spid) {
          var a = n, b = r;
        }
      }
    }
    for (var x in g.SpecLst[a].svLst) {
      g.SpecLst[a].svLst[x].IsChecked = false;
      if (x == b) {
        g.SpecLst[a].svLst[x].IsChecked = true;
      }
    }
    for (var nn in g.SpecLst) {
      for (var rr in g.SpecLst[nn].svLst) {
        if (g.SpecLst[nn].svLst[rr].IsChecked == true) {
          this.data.testarr[nn] = g.SpecLst[nn].svLst[rr].Id;
          if(g.SpecLst[nn].svLst[rr].Typess!=1){
            this.setData({
              selectimg:this.data.testarr[0].split('_')[1],
              stock:g.SpecLst[nn].svLst[rr].stock
            });
          }else{
            this.setData({
              stock:g.SpecLst[nn].svLst[rr].stock
            });
          }
        }
      }
    }
    console.log('g', g);
    console.log('testarr:', this.data.testarr);
    for (var aa in g.priceArray) {
      if (g.priceArray[aa].id.sort().toString() == this.data.testarr.sort().toString()) {
        // 这里改原价
        this.setData({
          SalePrice: g.priceArray[aa].price,
          MarketPrice: g.priceArray[aa].MarketpPrice
        });
        this.data.ProductInfo.SalePrice = g.priceArray[aa].price;
        this.data.ProductInfo.MarketPrice = g.priceArray[aa].MarketpPrice;
      }
    }
    this.setData({
      ProductInfo: g
    });
    return;
    //spid : id_属性用md5加密得到的id
    console.log('this.data.splist:', this.data.splist);
    var t = {
        spid: e.target.dataset.spid,
        ckid: e.target.dataset.ckid
      },
      n = [],
      r = this.data.splist;
    for (var i in r)
      r[i] == t.ckid ? n.push(t.spid) : n.push(r[i]);
    this.setData({splist: n, splistStr: []});
    var s = {
      proId: this.data.proId,
      Spec: this.data.splist.join(","),
      eventId: this.data.eventId
    }, o = this;
    $.xsr($.makeUrl(api.GetProductlistSpc, s), function (t) {
      console.log(t.dataList);
      for (var n in t.dataList[0].SpecLst)
        for (var r in t.dataList[0].SpecLst[n].svLst)//每种类型
          t.dataList[0].SpecLst[n].svLst[r].IsChecked && (t.dataList[0].SpecLst[n].ckid = t.dataList[0].SpecLst[n].svLst[r].Id, o.data.splist.push(t.dataList[0].SpecLst[n].svLst[r].Id), o.data.splistStr.push(t.dataList[0].SpecLst[n].svLst[r].Name)), t.dataList[0].SpecLst[n].svLst[r].Id == e.target.dataset.spid && o.setData({selectimg: t.dataList[0].SpecLst[n].svLst[r].imagePath});
      wx.setNavigationBarTitle({title: t.dataList[0].SalesName}), o.setData({
        ProductInfo: t.dataList[0],
        skuid: t.dataList[0].ProductSKU_Id,
        pname: t.dataList[0].ProductName,
        stock: t.dataList[0].Stock
      });
    });
  }, sub: function () {
    this.unifiedNum(2);
  }, add: function () {
    this.unifiedNum(1);
  }, writenum: function (e) {
    this.setData({inputval: e.detail.value}), this.unifiedNum(3);
  }, unifiedNum: function (e) {
    var t = {
      value: parseInt(this.data.numval),
      stock: parseInt(this.data.stock),
      inputval: parseInt(this.data.inputval)
    };
    if (t.stock <= 0) {
      $.alert("商品没有库存啦！");
      return;
    }
    e == 1 ? t.value = t.value + 1 : e == 2 ? t.value = t.value - 1 : (t.value = t.inputval, this.setData({numval: t.inputval}));
    if (t.value > t.stock) {
      this.setData({numval: t.stock});
      return;
    }
    if (t.value <= 0) {
      this.setData({numval: 1});
      return;
    }
    this.setData({numval: t.value});
  }, addCard: function () {
    // let sku_id;
    // if(this.data.testarr == ''){
    //   sku_id = this.data.ProductInfo.ProductSKU_Id
    // }else{
    //   sku_id = this.data.testarr
    // }
    var e = {
      openId: app.globalData.UserInfo.WeiXinOpenId,
      // openId : 'otUkP0SZahBL8do47l__ehoidhms',
      proId: this.data.proId,
      proName: this.data.pname,
      Amount: this.data.numval,
      SKU_Id: this.data.testarr
    };
    console.log('e为', e);
    if(this.data.ProductInfo.SpecLst.length == 0){
      if (this.data.ProductInfo.Stock <= 0) {
        $.alert("商品没有库存啦！");
        return;
      }
    }else{
      if (this.data.stock <= 0) {
        $.alert("商品没有库存啦！");
        return;
      }
    }
    var t = this;
    $.xsr($.makeUrl(cartapi.AddCart, e), function (e) {
      console.log('e为：', e);
      e.errcode == 0 && (notice.postNotificationName("RefreshProduct", !0), $.alert("商品已经成功添加到购物车"), t.setData({
        numval: 1,
        inputval: 1
      }));
    }), t.setData({selectct: 0}), setTimeout(function () {
      t.setData({selectsp: 0});
    }, 1e3);
  }, PDCollection: function (e) {
    var t = this;
    if (this.data.isCollection) {
      var n = {openId: app.globalData.UserInfo.WeiXinOpenId, proId: e.currentTarget.dataset.id};
      $.xsr($.makeUrl(api.DelUserAttention, n), function (e) {
        t.setData({isCollection: !1}), $.alert("已取消收藏！");
      });
    } else {
      var n = {openId: app.globalData.UserInfo.WeiXinOpenId, proId: e.currentTarget.dataset.id};
      $.xsr($.makeUrl(api.AddAttention, n), function (e) {
        t.setData({isCollection: !0}), $.alert("已收藏！");
      });
    }
  }, picDetail: function () {
    this.setData({tapindex: 1});
  }, spcParam: function () {
    this.setData({tapindex: 2});
  }, onShareAppMessage: function () {
    if (this.data.ProductInfo.zhuan_pic) {
      return {
        title: this.data.pname,
        desc: this.data.desc,
        imageUrl: this.data.ProductInfo.zhuan_pic,
        path: "/pages/goods/goods?id=" + this.data.proId + "&uid=" + app.globalData.UserInfo.Id
      };
    } else {
      return {
        title: this.data.pname,
        desc: this.data.desc,
        path: "/pages/goods/goods?id=" + this.data.proId + "&uid=" + app.globalData.UserInfo.Id
      };
    }
  }, buynow: function (e) {
    for (var i in this.data.testarr) {
      this.data.splistStr[i] = this.data.testarr[i].split("_")[1];
    }
    if(this.data.ProductInfo.SpecLst.length == 0){
      if (this.data.ProductInfo.Stock <= 0) {
        $.alert("商品没有库存啦！");
        return;
      }
    }else{
      if (this.data.stock <= 0) {
        $.alert("商品没有库存啦！");
        return;
      }
    }
    var t = {
      Amount: this.data.numval,
      ProductId: this.data.proId,
      ProductSKU_Id: this.data.testarr,
      AddTime: getNowFormatDate(),
      orderType: 1,
      ProductSaleName: this.data.pname,
      SalePrice: this.data.ProductInfo.SalePrice,
      CostPrice: this.data.ProductInfo.CostPrice,
      MarketPrice: this.data.ProductInfo.MarketPrice,
      ProductPic: this.data.ProductInfo.ProductPic,
      baoyou: this.data.ProductInfo.baoyou,
      openId: app.globalData.UserInfo.WeiXinOpenId,
      speStr: JSON.stringify(this.data.splistStr).replace("[", "").replace("]", "").replace(/\,/g, "  ").replace(/\"/g, "")
    };
    console.log(t);
    wx.navigateTo({url: "/pages/ordersubmit/ordersubmit?spid=" + JSON.stringify(t)}), this.setData({selectct: 0});
    var n = this;
    setTimeout(function () {
      n.setData({selectsp: 0});
    }, 1e3);
  }, receivenow: function () {
    this.cancel(), this.userReceiveCoupon();
  }, cancel: function () {
    this.setData({isCancel: !1});
  }, cancelsuccess: function () {
    this.setData({isCancelSuccess: !0});
  }, innertouch: function () {
  }, userReceiveCoupon: function () {
    var e = {openId: app.globalData.UserInfo.WeiXinOpenId, IsNewUser: this.data.IsNewUser}, t = this;
    $.xsr($.makeUrl(userapi.UserReceiveCoupon, e), function (e) {
      e.Code == 0 ? t.setData({isCancelSuccess: !1, Coupons: e.Info}) : $.alert(e.Msg);
    });
  }, ImgTap: function (e) {
    var t = this, n = [];
    for (var r in this.data.ProductInfo.Productcommentpic) n.push(this.data.ProductInfo.Productcommentpic[r].Path);
    var i = e.target.dataset.src;
    wx.previewImage({current: i, urls: n});
  },
  userEvaluation() {
    this.setData({
      tapindex: 3,
      // 点击标签之后重设数据
      evPage: 1,
      evList: [],
      evHasMore: true
    });
    //请求数据
    this.fetchEvData();
  },
  // 获取评论列表
  fetchEvData() {
    const that = this;
    let page = that.data.evPage;
    let hasMore = that.data.evHasMore;
    let evList = that.data.evList;
    let product_id = that.data.ProductInfo.Id;
    if (!hasMore) {
      return false;
    }
    // 获取api信息
    const evApi = api.GetEvaluationList;
    const requestObj = {
      url: evApi.url,
      method: 'POST',
      data: Object.assign(evApi.post, {
        product_id,
        page
      }),
      success(resp) {
        const data = resp.data;
        console.log('评价信息', data);
        if (data.length == 0) {
          hasMore = false;
          that.setData({
            evHasMore: hasMore
          });
        } else {
          evList = [...evList, ...data];
          hasMore = true;
          page += 1;
          that.setData({
            evList,
            evHasMore: hasMore,
            evPage: page
          });
        }
      },
      error() {
        console.log('评价加载失败');
      },
      complete() {
        wx.hideLoading();
      }
    };
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    wx.request(requestObj);
  },
  onReachBottom() {
    let that = this;
    if (that.data.tapindex == 3) {
      that.fetchEvData();
    }
  },
  share() {
    console.log('点击分享了~');
    let that = this;
    wx.request({
      url: api.GetAccessToken.url,
      method: 'POST',
      data: {
        wid: api.GetAccessToken.data.wid,
        goodid: that.data.proId
      },
      success: function (res) {
        console.log(res.data);
        if (res) {
          wx.showModal({
            title: '生成图片',
            content: '二维码生成成功，点击确定生成图片！',
            success: function (e) {
              if (e.confirm) {
                console.log('用户点击确定');
                that.getCode(res.data.data);
              } else if (e.cancel) {
                console.log('用户点击取消');
              }
            },
            fail: function () {
              console.log('生成失败！');
            }
          });
        }
      }
    });
    console.log('1');

  },
  getCode: function (src) {
    console.log('src是：',src);
    let that = this;
    // that.drawSharePic(that.data.ProductInfo.ProductPic, src);return;
    wx.getImageInfo({
      src: src,//服务器返回的带参数的小程序码地址
      success: function (e) {
        //res.path是网络图片的本地地址
        that.setData({
          qrCodePath: e.path
        });
        console.log('二维码路径是：',e.path);
        // that.drawSharePic('../../assets/fail.png','../../assets/fail.png');
        // console.log(that.data.ProductInfo.ProductPic);


        wx.getImageInfo({
          src: that.data.ProductInfo.ProductPic,//服务器返回的带参数的小程序码地址
          success: function (f) {
            console.log('商品图片路径是：',f.path);
            // that.drawSharePic('../../assets/fail.png','../../assets/fail.png');
            that.drawSharePic(f.path, that.data.qrCodePath);
          },
          fail: function (e) {
            //失败回调
            wx.showModal({
              content: '生成失败，请重试！',
            });
          }
        });


        // that.drawSharePic(that.data.ProductInfo.ProductPic, that.data.qrCodePath);
      },
      fail: function (e) {
        //失败回调
        wx.showModal({
          content: '生成失败，请重试！',
        });
      }
    });
  },
  saveEvent:function(eventId){
    wx.request({
      url: qiyeapi.saveCardEvent.url,
      data: Object.assign({}, {
        open_id: app.globalData.UserInfo.WeiXinOpenId,
        event_id: eventId,
      }, qiyeapi.saveCardEvent.data),
      method: 'POST',
      success: res => {
        if (res.data.success) {
          console.log(res.data.msg);
        } else {
          console.log(res.data.msg);
        }
      }
    })
  },
  sleep: function (func, time) {
    setTimeout(typeof func === 'function' && func(), time);
  },

  drawSharePic: function (goodsPicPath, qrCodePath) {
    let that = this;
    wx.showLoading({
      title: '正在生成图片...',
      mask: true,
    });
    const canvasCtx = wx.createCanvasContext('shareCanvas');
    //绘制背景
    canvasCtx.setFillStyle('white');
    canvasCtx.fillRect(0, 0, 300, 600);
    // //绘制商品图片
    canvasCtx.drawImage(goodsPicPath, 0, 0, goodsPicPath.width, goodsPicPath.height, 10, 10, 280, 200);
    // //绘制二维码
    canvasCtx.drawImage(qrCodePath, 0, 0, qrCodePath.width, qrCodePath.height, 30, 350, 240, 250);
    // x 10~280 y 220~380（160）
    //长标题
    canvasCtx.setFontSize(20);
    canvasCtx.setFillStyle("#000000");
    var text = that.data.ProductInfo.ProductName;//这是要绘制的文本
    let txtArr = [];
    let tmpArr = [];
    for (let i = 0; i < text.length; i++) {
      tmpArr.push(text[i]);
      let mt = canvasCtx.measureText(tmpArr.join(''));
      if (mt.width > 270) {
        tmpArr.pop();
        if(txtArr.length==1){
          tmpArr.pop();
          tmpArr.pop();
          tmpArr.push('...');
        }
        txtArr.push(tmpArr.join(''));
        tmpArr = [text[i]];
      }
    }
    txtArr.push(tmpArr.join(''));
    if(txtArr.length>2){
      txtArr = txtArr.slice(0, 2);
    }

    for (let i=0;i<txtArr.length;i++) {
      canvasCtx.fillText(txtArr[i], 10, 210+25*(i+1));
    }

    //绘制价格
    const price = that.data.ProductInfo.SalePrice;
    canvasCtx.setFontSize(30);
    canvasCtx.setFillStyle('#f9555c');
    canvasCtx.setTextAlign('left');
    canvasCtx.fillText('￥'+price, 10, 300);
    canvasCtx.draw();
    //绘制之后加一个延时去生成图片，如果直接生成可能没有绘制完成，导出图片会有问题。
    setTimeout(function () {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 300,
        height: 600,
        destWidth: 300,
        destHeight: 600,
        canvasId: 'shareCanvas',
        success: function (res) {
          console.log(res.tempFilePath);
          that.setData({
            prurl: res.tempFilePath,
            hidden: false
          });
          wx.hideLoading();
        },
        fail: function (res) {
          console.log(res);
          wx.hideLoading();
        }
      });
    }, 2000);
  },
  closeImg: function () {
    this.setData({
      hidden: true
    });
  },
  saveShareImg: function () {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.prurl,
      success(res) {
        console.log('保存成功');
      },
      fail() {
        console.log('保存失败！');
      }
    });
  },
  //发送企业微信通知
  sendQiYeMessage:function(){
    wx.request({
      url: qiyeapi.sendQiYeMessage.url,
      data: Object.assign({}, {
        userInfo: app.globalData.UserInfo,
        type:'goods'
      }, qiyeapi.sendQiYeMessage.data),
      method: 'POST',
      success: res => {
        if (res.data.status) {
          console.log('日志发送成功!');
        } else {
          wx.showModal({
            title: '出错啦',
            content: '啊哈哈哈哈',
            showCancel: false
          })
        }
      }
    })
  },

});