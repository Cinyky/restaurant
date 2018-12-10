const app = getApp();
let zhctApi = require('../../api/zhctAPI');
let myTools = require('../../utils/myTools');
var templateMethods = require("../../utils/template_methods.js");
Page(Object.assign({}, {
  data: {
    tabTit: 1, //标签页
    cart_list_isshow: false, //显示购物车
    cate_id: 0,
    cateList: [{
      id: 0,
      name: '全部'
    }],
    prodList: [],
    cart_num: 0, //购物车菜品数量
    cart_price: 0, //购物车菜品价格
    commentList: [],
    comment_page: 0,
    comment_has_more: true,
  },
  onLoad: function(options) {
    let t = this,
      td = t.data;
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
    //type 0 dc 1wm
    let type = options.type;
    console.log(options);
    let setDt = {
      type: type,
    };
    if (type == 0) {
      setDt.tableId = options.tableId;

      let tableApi = zhctApi.setTable;
      wx.request({
        url: tableApi.url,
        data: {
          wid: tableApi.data.wid,
          tableId: setDt.tableId,
          status: 1,
        },
        method: 'POST',
        success(resp) {
          console.log(resp)
          let rData = resp.data;
          if (rData.status != 'success') {
            wx.showModal({
              title: '错误',
              content: rData.msg,
              showCancel: 0,
              success() {
                wx.navigateBack();
              }
            });
          } else {
            // 无需处理
          }
        },
        fail() {
          wx.showToast({
            title: '网络错误',
            mask: 1,
          });
        }
      });
    }
    t.setData(setDt);
    // 获取配置信息
    let api = zhctApi.getInfo;
    wx.request({
      url: api.url,
      data: {
        wid: api.data.wid
      },
      method: 'POST',
      success(resp) {
        console.log(resp);
        let rData = resp.data;
        wx.setNavigationBarTitle({
          title: rData.data.name || '智慧餐饮'
        });
        if (rData.status != 'success') {
          wx.showModal({
            title: '错误',
            content: rData.msg,
            showCancel: 0
          });
        } else {
          let setting = rData.data;
          if (type == 0 && setting.is_open_sm != 1) {
            wx.showModal({
              title: '提示',
              content: "对不起，暂不支持店内" + this.data.editData_h.diancan,
              showCancel: false,
              success() {
                wx.navigateBack();
              }
            });
            return false;
          }
          if (type == 1 && setting.is_open_wm != 1) {
            wx.showModal({
              title: '提示',
              content: "对不起，暂不支持" + this.data.editData_h.waimai,
              showCancel: false,
              success() {
                wx.navigateBack();
              }
            });
            return false;
          }
          // 处理里面的数字变量,防止view中比较数字出问题
          let num_field_ls = ['wm_min_price', 'wm_radius', 'wm_base_price', 'wm_base_distance', 'wm_ext_price', 'first_order_discount', 'lng', 'lat'];
          for (let i = 0; i < num_field_ls.length; ++i) {
            setting[num_field_ls[i]] = parseFloat(setting[num_field_ls[i]]);
          }
          t.setData({
            setting: setting,
          });
          // 在回调中进行wm范围判断和计算
          if (td.type == 1) {
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
    // 获取分类信息
    let cateApi = zhctApi.getCateList;
    wx.request({
      url: cateApi.url,
      data: {
        wid: cateApi.data.wid
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
          let cateList = [...td.cateList, ...rData.data];
          t.setData({
            cateList: cateList,
          });
        }
      },
      fail() {
        wx.showToast({
          title: '网络错误',
          mask: 1,
        });
      }
    });
    // 获取全部菜品
    let prodApi = zhctApi.getProdList;
    wx.request({
      url: prodApi.url,
      data: {
        wid: prodApi.data.wid,
        type: type
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
            prodList: rData.data,
          });
        }
      },
      fail() {
        wx.showToast({
          title: '网络错误',
          mask: 1,
        });
      }
    });
    // 获取优惠券列表
    let couponApi = zhctApi.getCouponList;
    wx.request({
      url: couponApi.url,
      data: {
        wid: couponApi.data.wid
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
            couponList: rData.data,
          });
        }
      },
      fail() {
        wx.showToast({
          title: '网络错误',
          mask: 1,
        });
      }
    });
    // 获取评价信息
  },
  onShow: function() {
    let t = this,
      td = t.data;
    // 加载购物车
    t.setData({
      cart_num: wx.getStorageSync('zhct_cart_num') || 0,
      cart_price: wx.getStorageSync('zhct_cart_price') || 0,
    });
  },
  // 计算位置信息
  getLocInfo(e = null) {
    let t = this,
      td = t.data;
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
            base_price += parseFloat(set.wm_ext_price) * ext_distance; // 额外的配送费
          }
          setDt.wm_price = myTools.toMoney(base_price);
          t.setData(setDt);
          e && e();
        }
      },
      fail(err) {
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
  // 切换分类
  tapClassify: function(e) {
    var id = e.target.dataset.id;
    console.log(id);
    this.setData({
      cate_id: id
    });
  },
  //选择规格
  guige_select_bind: function(e) {
    let t = this,
      td = t.data,
      ds = e.currentTarget.dataset;
    // 把商品存起来
    let prodIdx = ds.idx;
    let prod = td.prodList[prodIdx];
    // 弹出
    t.setData({
      prod: prod,
      show_guige: true,
      tmp_spIdx: 0,
      tmp_sp: prod.spec[0]
    });
  },
  //选择规格，点击某个规格
  select_attr_bind: function(e) {
    let t = this,
      td = t.data,
      ds = e.currentTarget.dataset;
    let spIdx = ds.idx;
    let sp = td.prod.spec[spIdx];
    t.setData({
      tmp_spIdx: spIdx,
      tmp_sp: sp
    });
  },
  // 关闭规格弹窗
  attr_select_clost_bind: function() {
    this.setData({
      show_guige: false,
    });
  },
  // 加入购物车
  bind_join_car: function(e) {
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
    let t = this,
      td = t.data;
    let prod = td.prod,
      spIdx = td.tmp_spIdx,
      sp = td.tmp_sp; // 商品 规格下标 规格 取出当前选定的待添加到购物车的对象
    // 获取当前的购物车内容，为空则初始化购物车
    let cart = wx.getStorageSync('zhct_cart');
    if (!cart) {
      cart = [];
    }
    // 查找当前添加的菜品是否存在同样的规格，存在则+1，不存在就push
    let exists = false;
    let sd = {
      show_guige: false
    }; //要设置的数据
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
    sd.cart_price = myTools.toMoney(parseFloat(td.cart_price) + parseFloat(sp.price)); //购物车总价格等于当前价格加上新添加的这个规格的价格
    t.setData(sd);
    // 存储新的购物车/购物车数量/价格
    wx.setStorageSync('zhct_cart', cart);
    wx.setStorageSync('zhct_cart_num', td.cart_num);
    wx.setStorageSync('zhct_cart_price', td.cart_price);
  },
  //显示隐藏购物车
  cart_list_show_bind: function() {
    console.log('显示隐藏购物车');
    let t = this,
      td = t.data;
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
  cart_delete_bind: function() {
    let t = this,
      td = t.data;
    wx.showModal({
      title: '提示',
      content: "确认要清空购物车吗",
      confirmText: "确定",
      cancelText: "取消",
      success: function(res) {
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
  bind_cart_number_jian: function(e) {
    // 获取点击的idx
    let t = this,
      td = t.data,
      ds = e.currentTarget.dataset;
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
  bind_cart_number_jia: function(e) {
    // 获取点击的idx
    let t = this,
      td = t.data,
      ds = e.currentTarget.dataset;
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
  // 查看菜品信息
  goods_info_bind: function(e) {
    let t = this,
      td = t.data,
      ds = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/zhct_prod/zhct_prod?type=' + td.type + '&tableId=' + td.tableId + '&id=' + e.currentTarget.id
    });
  },
  // 领取优惠券
  bind_get_coupon(e) {
    let t = this,
      td = t.data,
      ds = e.currentTarget.dataset;
    let cid = ds.id; //优惠券id
    // 后台请求获取优惠券
    wx.showLoading({
      title: '正在获取',
      mask: true
    });
    let cpApi = zhctApi.getCoupon;
    wx.request({
      url: cpApi.url,
      method: cpApi.method,
      data: {
        wid: cpApi.data.wid,
        openid: app.globalData.UserInfo.WeiXinOpenId,
        coupon_id: cid,
      },
      success(resp) {
        let rData = resp.data;
        let data = rData.data;
        if (rData.status == 'success') {
          wx.showModal({
            title: '恭喜',
            content: rData.msg,
            showCancel: false
          });
        } else {
          wx.showModal({
            title: '提示',
            content: rData.msg,
            showCancel: false
          });
        }
      },
      complete() {
        wx.hideLoading();
      }
    });
  },
  // 查看活动/公告信息
  huodong_info_bind: function() {
    wx.navigateTo({
      url: '/pages/zhct_notice/zhct_notice'
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
  //下单
  bind_submit_order: function() {
    // 跳转到订单提交页面
    let t = this,
      td = t.data;
    let myDate = new Date();
    let myHours = myDate.getHours();
    if (myHours < 10) {
      myHours = '0' + myHours;
    }
    let myMinutes = myDate.getMinutes();
    if (myMinutes < 10) {
      myMinutes = '0' + myMinutes;
    }
    let myTimes = myHours + ':' + myMinutes;
    console.log(myTimes);
    let ct_times = td.setting.ct_times;
    let wm_times = td.setting.wm_times;
    let ST_H = 0;
    console.log(ct_times);
    console.log(wm_times);
    console.log(td.setting);
    let url = '/pages/zhct_order/zhct_order?type=' + td.type;
    if (td.type == 0) {
      for (let i = 0; i <= ct_times.length - 1; i++) {
        // console.log(t.Trim(ct_times[i]));
        let ct_Time = ct_times[i].split("~");
        console.log(ct_Time);
        console.log(myTimes);
        if (t.Trim(ct_Time[0]) > t.Trim(ct_Time[1])) {
          let ct1 = t.Trim(ct_Time[1]);
          let ct0 = '00:00';
          ct_Time[1] = '24:00';
          if (myTimes >= ct0 && myTimes <= ct1) {
            ST_H = 1;
            break;
          } else {
            ST_H = 0;
          }
        }
        if (myTimes >= t.Trim(ct_Time[0]) && myTimes <= t.Trim(ct_Time[1])) {
          ST_H = 1;
          console.log(ST_H);
          break;
        } else {
          ST_H = 0;
          console.log(ST_H);
        }
      }
      if (ST_H == 1) {
        console.log(ST_H);
        console.log('营业范围内')
        url += '&tableId=' + td.tableId;
        wx.navigateTo({
          url: url
        });
      } else {
        console.log(ST_H);
        wx.showModal({
          title: '提示',
          content: '当前不在营业时间内',
          showCancel: 0
        });
      }

    } else {
      // wm
      for (let i = 0; i <= wm_times.length - 1; i++) {
        // console.log(t.Trim(wm_times[i]));
        let ct_Time = wm_times[i].split("~");
        console.log(ct_Time);
        console.log(myTimes);
        if (t.Trim(ct_Time[0]) > t.Trim(ct_Time[1])) {
          let ct1 = t.Trim(ct_Time[1]);
          let ct0 = '00:00';
          ct_Time[1] = '24:00';
          if (myTimes >= ct0 && myTimes <= ct1) {
            ST_H = 1;
            break;
          } else {
            ST_H = 0;
          }
        }
        if (myTimes >= t.Trim(ct_Time[0]) && myTimes <= t.Trim(ct_Time[1])) {
          ST_H = 1;
          console.log(ST_H);
          break;
        } else {
          ST_H = 0;
          console.log(ST_H);
        }
      }
      if (ST_H == 1) {
        t.getLocInfo(function() {
          wx.navigateTo({
            url: url
          });
        });
      } else {
        wx.showModal({
          title: '提示',
          content: '当前不在营业时间内',
          showCancel: 0
        });
      }
    }
  },
  Trim: function(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
  },
  // 切换标签页
  tabSubBind: function(e) {
    var that = this;
    var this_target = e.target.id;
    that.setData({
      tabTit: this_target
    });
    if (this_target == 2) {
      // 重新加载评价
      this.loadComment(true);
    }
  },
  // 加载评价
  loadComment(reload = false) {
    let t = this;
    if (reload) {
      t.setData({
        commentList: [],
        comment_page: 0,
        comment_has_more: true,
      }); //先清空评论
    } else {
      if (!t.data.comment_has_more) return false;
    }
    // 加载评论
    wx.showLoading({
      title: '加载中'
    });
    let api = zhctApi.getCommentList;
    wx.request({
      url: api.url,
      method: api.method,
      data: {
        wid: api.data.wid,
        page: t.data.comment_page,
      },
      success(resp) {
        let r = resp.data,
          rd = r.data;
        if (r.status == 'success') {
          let setDt = {};
          // page++
          setDt.comment_page = t.data.comment_page + 1;
          // 判断是否有下一页
          if (rd.length == 0) {
            setDt.comment_has_more = false;
            return false;
          } else {
            setDt.comment_has_more = true;
          }
          // 设置数据
          let oldList = t.data.commentList;
          setDt.commentList = [...oldList, ...rd];
          t.setData(setDt);
        } else {
          wx.showModal({
            title: '提示',
            content: r.msg,
            showCancel: 0
          });
        }
      },
      fail() {
        wx.showModal({
          title: '错误',
          content: '网络错误',
          showCancel: 0
        });
      },
      complete() {
        wx.hideLoading();
      }
    });
  },

  //跳转到订单页面
  go_user_order_bind: function(e) {
    wx.navigateTo({
      url: '/pages/zhct_orderlist/zhct_orderlist'
    });
  },


}, templateMethods));