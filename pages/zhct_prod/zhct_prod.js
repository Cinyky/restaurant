var app = getApp();
let zhctApi = require('../../api/zhctAPI');let myTools=require('../../utils/myTools');
var templateMethods = require("../../utils/template_methods.js");
let WxParse = require("../../wxParse/wxParse.js");
Page(Object.assign({}, {
  data: {},
  onLoad: function (options) {
    let t = this, td = t.data;
    this.setMenu(this);
    app.globalData.getTop();
    // 获取配色设置
    let main_color = wx.getStorageSync('zhct_main_color');
    if (!main_color) {
      wx.setStorageSync('main_color', '#fe5848');
      main_color = '#fe5848';
    }
    this.setData({
      main_color: main_color,
      editData_h: app.globalData.editData_h
    });
    t.setData({
      type: options.type,
      id: options.id,
      tableId: options.tableId
    });
    // 获取配置信息
    let api = zhctApi.getInfo;
    wx.request({
      url: api.url,
      data: {
        wid: api.data.wid
      },
      method: 'POST',
      success(resp) {
        let rData = resp.data;
        if (rData.status != 'success') {
          wx.showModal({
            title: '错误',
            content: rData.msg,
            showCancel: 0
          });
        } else {
          let setting=rData.data;
          // 处理里面的数字变量,防止view中比较数字出问题
          let num_field_ls=['wm_min_price','wm_radius','wm_base_price','wm_base_distance','wm_ext_price','first_order_discount','lng','lat'];
          for(let i=0;i<num_field_ls.length;++i){
            setting[num_field_ls[i]]=parseFloat(setting[num_field_ls[i]]);
          }
          t.setData({
            setting: setting,
          });
          // 在回调中进wm范围判断和计算
          if(td.type==1){
            t.getLocInfo();
          }
        }
      },
      fail() {
        wx.showToast({
          title: '网络错误',
          mask: 1,
        });
      }
    });
    // 获取菜品
    let prodApi = zhctApi.getProd;
    wx.request({
      url: prodApi.url,
      data: {
        wid: prodApi.data.wid,
        type: td.type,
        id: td.id
      },
      method: 'POST',
      success(resp) {
        let rData = resp.data;
        if (rData.status != 'success') {
          wx.showModal({
            title: '错误',
            content: rData.msg,
            showCancel: 0
          });
        } else {
          t.setData({
            prod: rData.data,
          });
          WxParse.wxParse("pinfo", "html", rData.data.desc, t);
        }
      },
      fail() {
        wx.showToast({
          title: '网络错误',
          mask: 1,
        });
      }
    });
  },
  onShow: function () {
    let t = this, td = t.data;
    // 加载购物车
    t.setData({
      cart_num: wx.getStorageSync('zhct_cart_num') || 0,
      cart_price: wx.getStorageSync('zhct_cart_price') || 0,
    });
  },
  // 计算位置信息
  getLocInfo(e = null) {
    let t = this, td = t.data;
    wx.getLocation({
      success(res) {
        console.log(res);
        let lat1 = res.latitude;
        let lng1 = res.longitude;
        let distance = myTools.geoDistance(lat1, lng1, td.setting.lat, td.setting.lng);
        let setDt = {
          distance: distance
        };
        // 判断是否超出wm的配送范围
        let radius = parseFloat(td.setting.wm_radius);
        if (radius > 0 && distance > radius) {
          // 无法配送
          setDt.can_wm = false;
          t.setData(setDt);
          wx.showModal({
            title: '提示',
            content: '您离店家太远，' + this.data.editData_h.waimai + '小哥送不到哦',
            showCancel: false
          });
        } else {
          // 可以配送
          setDt.can_wm = true;
          // 计算配送价格
          let set = td.setting;
          // 计算超出基本配送范围的距离
          let base_price = parseFloat(set.wm_base_price);
          let ext_distance = parseFloat(distance - parseFloat(set.wm_base_distance));
          if (ext_distance > 0) {
            base_price += parseFloat(set.wm_ext_price) * ext_distance;  // 额外的配送费
          }
          setDt.wm_price = myTools.toMoney(base_price);
          t.setData(setDt);
          e && e();
        }
      }, fail(err) {
        // 提示进行配置
        wx.showModal({
          title: '提示',
          content: '请允许我们获取位置信息，以方便进行配送，否则无法进行' + this.data.editData_h.waimai + '下单',
          showCancel: false,
          success() {
            wx.openSetting({
              success: (au) => {
                t.getLocInfo();
              }
            });
          }
        });
      }
    });
  },
  //选择规格
  guige_select_bind: function (e) {
    let t = this, td = t.data, ds = e.currentTarget.dataset;
    // 把商品存起来
    // let prodIdx = ds.idx;
    let prod = td.prod;
    // 弹出
    t.setData({
      // prod: prod,
      show_guige: true,
      tmp_spIdx: 0,
      tmp_sp: prod.spec[0]
    });
  },
  //选择规格，点击某个规格
  select_attr_bind: function (e) {
    let t = this, td = t.data, ds = e.currentTarget.dataset;
    let spIdx = ds.idx;
    let sp = td.prod.spec[spIdx];
    t.setData({
      tmp_spIdx: spIdx,
      tmp_sp: sp
    });
  },
  // 关闭规格弹窗
  attr_select_clost_bind: function () {
    this.setData({
      show_guige: false,
    });
  },
  // 加入购物车
  bind_join_car: function (e) {
    /*
    购物车中某一条的结构
    num 数量
    prodId
    prod  商品对象
    spIdx
    sp  规格对象
    price 当前条目的价格
    根据prodId和spIdx来判断是否存在
     */
    // 使用缓存来实现购物车，减少和后台数据库交互
    let t = this, td = t.data;
    let prod = td.prod, spIdx = td.tmp_spIdx, sp = td.tmp_sp;// 商品 规格下标 规格 取出当前选定的待添加到购物车的对象
    // 获取当前的购物车内容，为空则初始化购物车
    let cart = wx.getStorageSync('zhct_cart');
    if (!cart) {
      cart = [];
    }
    // 查找当前添加的菜品是否存在同样的规格，存在则+1，不存在就push
    let exists = false;
    let sd = {show_guige: false};//要设置的数据
    for (let i = 0; i < cart.length; ++i) {
      let item = cart[i];
      if (item.prodId == prod.id && item.spIdx == spIdx) {
        // 数量+1
        item.num += 1;
        cart[i] = item;
        exists = true;
        break;
      }
    }
    if (!exists) {
      // 购物车添加新条目
      let item = {
        num: 1,
        prodId: prod.id,
        prod: prod,
        spIdx: spIdx,
        sp: sp,
      };
      cart.push(item);
      // 已点菜品数量+1
      sd.cart_num = td.cart_num + 1;
    }
    // 已点菜品总价格增加
    sd.cart_price = myTools.toMoney(parseFloat(td.cart_price) + parseFloat(sp.price));//购物车总价格等于当前价格加上新添加的这个规格的价格
    t.setData(sd);
    // 存储新的购物车/购物车数量/价格
    wx.setStorageSync('zhct_cart', cart);
    wx.setStorageSync('zhct_cart_num', td.cart_num);
    wx.setStorageSync('zhct_cart_price', td.cart_price);
  },
  //显示隐藏购物车
  cart_list_show_bind: function () {
    console.log('显示隐藏购物车');
    let t = this, td = t.data;
    if (!td.cart_list_isshow) {
      // 要显示购物车，先加载出来缓存的购物车数据
      t.setData({
        cart: wx.getStorageSync('zhct_cart')
      });
    }
    t.setData({
      cart_list_isshow: !td.cart_list_isshow
    });
  },
  //清空购物车
  cart_delete_bind: function () {
    let t = this, td = t.data;
    wx.showModal({
      title: '提示',
      content: "确认要清空购物车吗",
      confirmText: "确定",
      cancelText: "取消",
      success: function (res) {
        if (res.confirm == true) {
          // 清空缓存
          wx.removeStorageSync('zhct_cart');
          wx.removeStorageSync('zhct_cart_num');
          wx.removeStorageSync('zhct_cart_price');
          // 页面数据重置+隐藏购物车
          t.setData({
            cart: [],
            cart_num: 0,
            cart_price: 0,
            cart_list_isshow: false
          });
        }
      }
    });
  },
  //减少数量
  bind_cart_number_jian: function (e) {
    // 获取点击的idx
    let t = this, td = t.data, ds = e.currentTarget.dataset;
    let idx = ds.index;
    // 获取当前的价格和数量
    let cart_price = wx.getStorageSync('zhct_cart_price');
    let cart_num = wx.getStorageSync('zhct_cart_num');
    // 加载购物车内容
    let cart = wx.getStorageSync('zhct_cart');
    let cartItem = cart[idx];
    if (cart[idx].num <= 1) {
      // 直接删除该条目
      cart.splice(idx, 1);
      cart_num -= 1;
    } else {
      // 数量减去1
      cart[idx].num -= 1;
    }
    // 重新计算价格
    cart_price = myTools.toMoney(parseFloat(cart_price) - parseFloat(cartItem.sp.price));
    // 设置购物车缓存
    wx.setStorageSync('zhct_cart', cart);
    wx.setStorageSync('zhct_cart_price', cart_price);
    wx.setStorageSync('zhct_cart_num', cart_num);
    // 更新页面数据
    t.setData({
      cart_price: cart_price,
      cart_num: cart_num,
      cart: cart
    });
    if (cart.length == 0) {
      // 清空缓存
      wx.removeStorageSync('zhct_cart');
      wx.removeStorageSync('zhct_cart_num');
      wx.removeStorageSync('zhct_cart_price');
      // 页面数据重置+隐藏购物车
      t.setData({
        cart: [],
        cart_num: 0,
        cart_price: 0,
        cart_list_isshow: false
      });
    }
  },
  //增加数量
  bind_cart_number_jia: function (e) {
    // 获取点击的idx
    let t = this, td = t.data, ds = e.currentTarget.dataset;
    let idx = ds.index;
    // 获取当前的价格和数量
    let cart_price = wx.getStorageSync('zhct_cart_price');
    let cart_num = wx.getStorageSync('zhct_cart_num');
    // 加载购物车内容
    let cart = wx.getStorageSync('zhct_cart');
    let cartItem = cart[idx];
    // 数量+1
    cart[idx].num += 1;
    // 重新计算价格
    cart_price = myTools.toMoney(parseFloat(cart_price) + parseFloat(cartItem.sp.price));
    // 设置购物车缓存
    wx.setStorageSync('zhct_cart', cart);
    wx.setStorageSync('zhct_cart_price', cart_price);
    wx.setStorageSync('zhct_cart_num', cart_num);
    // 更新页面数据
    t.setData({
      cart_price: cart_price,
      cart_num: cart_num,
      cart: cart
    });
  },
  //下单
  bind_submit_order: function () {
    // 跳转到订单提交页面
    let t = this, td = t.data;
    let url = '/pages/zhct_order/zhct_order?type=' + td.type;
    if (td.type == 0) {
      url += '&tableId=' + td.tableId;
      wx.navigateTo({
        url: url
      });
    }else{
      //wm
      t.getLocInfo(function () {
        wx.navigateTo({
          url: url
        });
      });
    }
  },

}, templateMethods));