const app = getApp();
const templateMethods = require("../../utils/template_methods.js");
const cfAPI = require("../../api/customFormAPI");
const sellerAPI = require('../../api/sellerAPI');
Page(Object.assign({}, {
  data: {
    form: null,  // 表单
    fields: null,  // 字段信息
    formData: {},  // 用户输入
  },
  onLoad(params) {
    let t = this;
    app.globalData.getTop();
    this.setMenu(this);
    // 获取表单数据
    if (!params.id) {
      wx.showModal({
        title: '错误',
        content: '缺少参数',
        showCancel: false,
        success() {
          wx.navigateBack();
        }
      });
    }
    const api = cfAPI.getForm;
    wx.request({
      url: api.url,
      data: {
        wid: api.data.wid,
        openid: app.globalData.UserInfo.WeiXinOpenId,
        form_id: params.id
      },
      method: 'POST',
      success(resp) {
        console.log(resp)
        let rData = resp.data;
        let data = rData.data;
        var titlePage_h = data.form.title;
        var idPage_h = data.form.id;
        t.setData({
          titlePage_h : data.form.title,
          idPage_h : data.form.id
        })
        if (rData.status != 'success') {
          wx.showModal({
            title: '错误',
            content: rData.msg,
            showCancel: false,
            success() {
              wx.navigateBack();
            }
          });
        } else {
          wx.setNavigationBarTitle({
            title: data.form.title
          });
          t.setData({
            form: data.form,
            fields: data.fields,
            attrMap: data.attrMap,
            fieldMap: data.fieldMap,
          });
          if (!data.can_submit) {
            wx.showModal({
              title: '提示',
              content: data.error_tip,
              showCancel: false,
              success() {
                wx.navigateBack();
              }
            });
          }
        }
      }
    });
  },
  bindInput(e) {
    // console.log(e);
    let t = this;
    let value = e.detail.value;
    let ds = e.currentTarget.dataset;
    let id = ds.id;
    let type = ds.type;
    let fd = t.data.formData;
    fd[id] = value;
    t.setData({
      formData: fd
    });
  },
  bindMenuChange(e) {
    // console.log(e);
    let t = this;
    let value = e.detail.value;
    let ds = e.currentTarget.dataset;
    let id = ds.id;
    let type = ds.type;
    let fieldIdx = ds.idx;
    let options = t.data.fields[fieldIdx].attr.options;
    let fd = t.data.formData;
    fd[id] = options[value];
    t.setData({
      formData: fd
    });
  },
  bindRadioChange(e) {
    // console.log(e);
    let t = this;
    let value = e.detail.value;
    let ds = e.currentTarget.dataset;
    let id = ds.id;
    let type = ds.type;
    let fd = t.data.formData;
    fd[id] = value;
    t.setData({
      formData: fd
    });
  },
  bindCheckboxChange(e) {
    // console.log(e);
    let t = this;
    let value = e.detail.value;
    let ds = e.currentTarget.dataset;
    let id = ds.id;
    let type = ds.type;
    let fd = t.data.formData;
    fd[id] = value;
    t.setData({
      formData: fd
    });
  },
  bindDateChange(e) {
    // console.log(e);
    let t = this;
    let value = e.detail.value;
    let ds = e.currentTarget.dataset;
    let id = ds.id;
    let type = ds.type;
    let fd = t.data.formData;
    fd[id] = value;
    t.setData({
      formData: fd
    });
  },
  bindAddrChange(e) {
    // console.log(e);
    let t = this;
    let value = e.detail.value;
    let ds = e.currentTarget.dataset;
    let id = ds.id;
    let type = ds.type;
    let fd = t.data.formData;
    fd[id] = value;
    t.setData({
      formData: fd
    });
  },
  bindUploadFile(e) {
    // console.log(e);
    let t = this;
    let value = e.detail.value;
    let ds = e.currentTarget.dataset;
    let id = ds.id;
    let idx = ds.idx;
    let field = t.data.fields[idx];
    let type = ds.type;
    let fd = t.data.formData;
    if (fd[id] && fd[id].length >= field.attr.file_max) {
      wx.showModal({
        title: '提示',
        content: '您最多上传' + field.attr.file_max + '张图片',
        showCancel: false,
      });
      return;
    }
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        if (tempFilePaths.length == 0) {
          return false;
        }
        let file = tempFilePaths[0];
        var size = res.tempFiles[0].size / 1024;
        if (size > 2048) {
          wx.showModal({
            title: '错误',
            content: '上传图片不能大于2M',
            showCancel: 0
          });
          return false;
        }
        wx.showLoading({
          title: '正在上传',
          mask: true,
        });
        // 上传
        wx.uploadFile({
          url: sellerAPI.uploadImg.url, //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'img',
          success: function (res) {
            var imgPath = res.data;
            console.log(imgPath);
            // 完成图片上传
            fd[id] = fd[id] ? [...fd[id], imgPath] : [imgPath];
            t.setData({
              formData: fd
            });
          },
          complete() {
            wx.hideLoading();
          }
        });
      }
    });

  },
  bindRemoveImg(e) {
    // console.log(e);
    let t = this;
    let value = e.detail.value;
    let ds = e.currentTarget.dataset;
    let id = ds.id;
    let type = ds.type;
    let idx = ds.idx;
    let fd = t.data.formData;
    let imgList = fd[id];
    if (!imgList) return false;
    imgList.splice(idx, 1);
    fd[id] = imgList;
    t.setData({
      formData: fd
    });
  },
  onShareAppMessage: function(){
    let t = this;
    let path = "pages/customform/customform?id=" + t.data.idPage_h;
    console.log(path);
    return {
      title: t.data.titlePage_h,
      path: path,
      success() {
        console.log('转发成功');
      }
    };
  },
  // Return_H: function () {
  //   wx.reLaunch({
  //     url: '/pages/index/index',
  //   })
  // },
  submitForm() {
    let t = this;
    let td = t.data;
    // 直接提交数据，后台验证
    // 注意表单支付
    console.log(t.data.formData);
    wx.showLoading({
      title: '正在提交',
      mask: true,
    });
    let api = cfAPI.submitForm;
    wx.request({
      url: api.url,
      data: Object.assign({}, api.data, {
        form_id: td.form.id,
        formData: td.formData,
        openid: app.globalData.UserInfo.WeiXinOpenId
      }),
      method: 'POST',
      success(resp) {
        resp = resp.data;
        let data = resp.data;
        console.log(resp);
        if (resp.status == 'success') {
          if (data.pay == true) {
            if (data.pay_params) {
              let payObj = data.pay_params;
              payObj.success = function (resp) {
                wx.showModal({
                  title: '成功',
                  content: resp.msg || td.form.submit_tip.success || '提交成功',
                  showCancel: false,
                  success: function () {
                    console.log('成功跳转');
                    wx.redirectTo({url:'/pages/customformcenter/customformcenter'})
                  }
                });
              };
              payObj.fail = function () {
                wx.showModal({
                  title: '提示',
                  content: '提交成功但未支付，请前往表单中心进行支付',
                  showCancel: false,
                  success: function () {
                    console.log('失败跳转');
                    wx.redirectTo({url:'/pages/customformcenter/customformcenter'})
                  }
                });
              };
              wx.requestPayment(payObj);
            } else {
              wx.showModal({
                title: '提示',
                content: '提交成功但未支付，请前往表单中心进行支付',
                showCancel: false,
                success: function () {
                  console.log('失败跳转');
                  wx.redirectTo({url:'/pages/customformcenter/customformcenter'})
                }
              });
            }
          } else {
            wx.showModal({
              title: '提交成功',
              content: resp.msg || td.form.submit_tip.success || '提交成功',
              showCancel: false,
              success: function () {
                console.log('成功跳转');
                wx.redirectTo({url:'/pages/customformcenter/customformcenter'})
              }
            });
          }
        } else {
          wx.showModal({
            title: '提交失败',
            content: resp.msg || td.form.submit_tip.fail || '提交失败',
            showCancel: false
          });
        }
      },
      complete() {
        wx.hideLoading();
      }
    });
  }
}, templateMethods));