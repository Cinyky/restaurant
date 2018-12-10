let app = getApp();
let zhctApi = require('../../api/zhctAPI');
let myTools = require('../../utils/myTools');
let templateMethods = require("../../utils/template_methods.js");
Page(Object.assign({}, {
  data: {
    wm_price: 0,
    address: null,
    total_pkg_price: 0,
    is_show_quan_layer: false,//是否显示选择优惠券的层
    couponList: [],//优惠券列表
    // 选择的优惠券
    coupon_id: 0,
    coupon_name: '不使用优惠券',
    coupon_discount: 0,
    total_price2: '...',
    remark: null,
    show_payMethod: false,
  },
  onLoad: function (options) {
    console.log(options);
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
    t.setData(options);
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
          let setting = rData.data;
          // 处理里面的数字变量,防止view中比较数字出问题
          let num_field_ls = ['wm_min_price', 'wm_radius', 'wm_base_price', 'wm_base_distance', 'wm_ext_price', 'first_order_discount', 'lng', 'lat'];
          for (let i = 0; i < num_field_ls.length; ++i) {
            setting[num_field_ls[i]] = parseFloat(setting[num_field_ls[i]]);
          }
          t.setData({
            setting: setting,
            // pay_wx: rData.data.pay_wx,
            // pay_ye: rData.data.pay_ye,
          });
          if (td.type == 1) {
            // wm（先获取位置信息，计算配送费之后再获取满减等信息）
            t.getLocInfo(t.loadCart);
          } else {
            // 直接dc（传入当前的总金额）
            t.loadCart();
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
  },
  // 获取优惠信息
  loadCart() {
    let t = this, td = t.data;
    // 加载缓存的菜品
    // 加载购物车
    t.setData({
      cart: wx.getStorageSync('zhct_cart') || [],
      cart_num: wx.getStorageSync('zhct_cart_num') || 0,
      cart_price: wx.getStorageSync('zhct_cart_price') || 0,
    });
    // 计算打包费
    let total_pkg_price = 0;
    if (td.type == 1) {
      for (let i = 0; i < td.cart.length; i++) {
        total_pkg_price += parseFloat(td.cart[i].prod.pkg_price) * parseInt(td.cart[i].num);
      }
    }
    t.setData({
      total_pkg_price: myTools.toMoney(total_pkg_price)
    });
    if (!td.cart.length) {
      t.setData({
        empty_cart: true,
      });
    }
    // 获取首单、满减等优惠信息
    let total_price = myTools.toMoney(parseFloat(td.cart_price) + total_pkg_price + td.wm_price);
    let yhApi = zhctApi.getYouhui;
    wx.request({
      url: yhApi.url,
      method: yhApi.method,
      data: {
        wid: yhApi.data.wid,
        openid: app.globalData.UserInfo.WeiXinOpenId,
        total_price: total_price,
      }, success(resp) {
        let r = resp.data, data = r.data;
        if (r.status == 'success') {
          t.setData({
            // 首单立减
            first_discount: data.first.status,
            first_discount_price: parseFloat(data.first.discount),
            // 满减
            full_discount: data.full.status,
            full_discount_name: data.full.name,
            full_discount_price: parseFloat(data.full.discount),
          });
          // 计算首单、满减后的价格
          total_price = myTools.toMoney(total_price - td.first_discount_price - td.full_discount_price);
          if (total_price < 0) total_price = 0;
          t.setData({
            total_price: total_price,
            total_price2: total_price,
          });
        } else {
          wx.showModal({
            title: '错误',
            content: r.msg,
            showCancel: false,
            success() {
              wx.navigateBack();
            }
          });
        }
      }
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
          lat: lat1,
          lng: lng1,
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
  //选择收货地址
  select_address_bind: function () {
    let t = this, td = t.data;
    // 选择收货地址，回调设置到data中
    wx.chooseAddress({
      success(res) {
        console.log(res);
        t.setData({
          address: res
        });
      }, fail() {
        wx.showModal({
          title: '提示',
          content: '请允许我们获取您的收货地址，否则无法正常下单',
          success(eee) {
            if (eee.confirm) {
              // 打开授权页面，重新申请授权
              wx.openSetting({
                success: (res) => {
                  t.select_address_bind();
                }
              });
            } else if (eee.cancel) {
              // 暂时不获取收货地址，但是订单不允许提交
            }
          }
        });
      }
    });
  },
  // 输入备注信息
  input_beizhu(e) {
    let t = this, td = t.data;
    let val = e.detail.value;
    t.setData({
      remark: val
    });
  },
  // 弹出选择代金券
  go_select_dai_bind: function () {
    //加载用户优惠券
    let t = this, td = t.data;
    let myCpApi = zhctApi.getMyCoupon;
    wx.request({
      url: myCpApi.url,
      method: myCpApi.method,
      data: {
        wid: myCpApi.data.wid,
        openid: app.globalData.UserInfo.WeiXinOpenId
      },
      success(res) {
        let rData = res.data, data = rData.data;
        if (!data) data = [];
        t.setData({
          couponList: data,
          is_show_quan_layer: true,
        });
      }
    });

  },
  // 隐藏优惠券选择
  go_select_dai__hide_bind: function () {
    var that = this;
    that.setData({is_show_quan_layer: !that.data.is_show_quan_layer});
  },
  //选择代金券
  quan_select_one_bind: function (e) {
    let t = this, td = t.data, ds = e.currentTarget.dataset;
    if (ds.id == 0) {
      t.setData({
        is_show_quan_layer: false,
        coupon_id: 0,
        coupon_name: '不使用优惠券',
        coupon_discount: 0,
      });
    } else {
      t.setData({
        is_show_quan_layer: false,
        coupon_id: ds.id,
        coupon_name: ds.name,
        coupon_discount: myTools.toMoney(parseFloat(ds.price)),
      });
    }
    let new_total_price2 = myTools.toMoney(td.total_price - td.coupon_discount);
    new_total_price2 = new_total_price2 <= 0 ? 0 : new_total_price2;
    t.setData({
      total_price2: new_total_price2
    });
  },
  //提交订单并支付
  formSubmit: function (e) {
    let t = this, td = t.data;
    // 收集提交订单所需的参数
    let api = zhctApi.submitOrder;
    let form_id = e.detail.formId;
    let formData = {
      wid: api.data.wid,
      openid: app.globalData.UserInfo.WeiXinOpenId,
      type: td.type,
      remark: td.remark,
      form_id: form_id,
      cart: td.cart,
      coupon_id: td.coupon_id
    };
    if (td.type == 0) {
      formData.tableId = td.tableId;
    } else if (td.type == 1) {
      if (!td.address) {
        t.select_address_bind();
        return false;
      }
      formData.address = td.address;
      formData.lat = td.lat;
      formData.lng = td.lng;
      formData.wm_price = td.wm_price;
    }
    // 发送请求
    console.log(formData);
    wx.showLoading({
      title: '正在提交...',
      mask: true,
    });
    wx.request({
      url: api.url,
      method: api.method,
      data: formData,
      success(res) {
        let r = res.data, payObj = r.data;
        if (r.status == 'success') {
          wx.removeStorageSync('zhct_cart');
          wx.removeStorageSync('zhct_cart_num');
          wx.removeStorageSync('zhct_cart_price');
          if (payObj.need_pay==false) {
            // 直接跳转到订单页面
            console.log('支付成功');
            wx.redirectTo({url: '/pages/zhct_orderlist/zhct_orderlist'});
            return true;
          }
          payObj.success = function (res) {
            console.log(res);
            // redirect跳转到订单页面
            wx.redirectTo({url: '/pages/zhct_orderlist/zhct_orderlist'});
          };
          payObj.fail = function () {
            // redirect跳转到订单页面
            wx.showModal({
              title: '提示',
              content: '支付失败，请重新支付',
              showCancel: false,
              success() {
                wx.redirectTo({url: '/pages/zhct_orderlist/zhct_orderlist'});
              }
            });
          };
          wx.requestPayment(payObj);
        } else {
          wx.showModal({
            title: '提示',
            content: r.msg,
            showCancel: false,
          });
        }
      }, fail() {
        wx.showModal({
          title: '错误',
          content: '网络错误',
          showCancel: false,
        });
      }, complete() {
        wx.hideLoading();
      }
    });
  },
  // 显示支付方式
  show_payMethod: function () {
    let t = this;
    t.setData({
      show_payMethod: true
    })
  },
  hide_payMethod: function () {
    let t = this;
    t.setData({
      show_payMethod: false
    })
  },
  // 余额支付
  payMethod_Submit: function (e) {
    let t = this, td = t.data;
    // 收集提交订单所需的参数
    let api = zhctApi.submitVipOrder;
    let form_id = e.detail.formId;
    let formData = {
      wid: api.data.wid,
      openid: app.globalData.UserInfo.WeiXinOpenId,
      type: td.type,
      remark: td.remark,
      form_id: form_id,
      cart: td.cart,
      coupon_id: td.coupon_id
    };
    if (td.type == 0) {
      formData.tableId = td.tableId;
    } else if (td.type == 1) {
      if (!td.address) {
        t.select_address_bind();
        return false;
      }
      formData.address = td.address;
      formData.lat = td.lat;
      formData.lng = td.lng;
      formData.wm_price = td.wm_price;
    }
    // 发送请求
    console.log(formData);
    wx.showLoading({
      title: '正在提交...',
      mask: true,
    });
    wx.request({
      url: api.url,
      method: api.method,
      data: formData,
      success(res) {
        let r = res.data, payObj = r.data;
        console.log(res);
        console.log(payObj)
        if (r.status == 'success') {
          wx.removeStorageSync('zhct_cart');
          wx.removeStorageSync('zhct_cart_num');
          wx.removeStorageSync('zhct_cart_price');
          wx.redirectTo({
            url: "/pages/payment/payment?type=zhct&orderid=" + payObj
          });
        } else {
          wx.showModal({
            title: '提示',
            content: r.msg,
            showCancel: false,
          });
        }
      }, fail() {
        wx.showModal({
          title: '错误',
          content: '网络错误',
          showCancel: false,
        });
      }, complete() {
        wx.hideLoading();
      }
    });
  },
}, templateMethods));