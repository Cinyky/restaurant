//logs.js
// const util = require('../../utils/util.js')
const app = getApp();
Page({
  data: {
    canvasSize: 'width:300px;height:468px;',
    tempPoster: null
  },
  /** 调整/设置画布尺寸 */
  adjustCanvasSize: function (w, h) {
    this.setData({
      canvasSize: `width:${w}px;height:${h}px;`
    })
  },
  /** 绘画时网络图片获取失败 */
  getImgErr: function (errLocated, msg) {
    wx.showModal({
      title: errLocated + '信息获取失败',
      content: msg,
      showCancel: false,
      complete: wx.navigateBack
    })
  },
  /** 完成绘制 */
  drawIt: function (ctx) {
    ctx.draw(false, wx.hideLoading)
  },
  /** 查询及获取相册权限 */
  auth: function () {
    wx.showLoading({ mask: true, title: '保存中...' })
    wx.getSetting({
      success: (res) => {
        // 首次请求权限
        if (res.authSetting['scope.writePhotosAlbum'] === undefined) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: () => {
              this.savePrepare()
            },
            fail: wx.hideLoading
          })
        } else if (res.authSetting['scope.writePhotosAlbum'] === false) {
          wx.hideLoading()
          // 提示开启权限
          wx.showModal({
            title: '',
            content: '请打开小程序使用相册的权限',
            confirmText: '去开启',
            success: (modalRes) => {
              if (modalRes.confirm) {
                wx.openSetting({
                  success: (settingRes) => {
                    if (settingRes.authSetting['scope.writePhotosAlbum']) {
                      this.savePrepare()
                    }
                  }
                })
              }
            }
          })
        } else {
          this.savePrepare()
        }
      }
    })
  },
  /** 保存canvas为图片到相册 */
  savePrepare: function () {
    // 已保存画布为临时文件
    if (this.tempPoster) {
      this.save(this.tempPoster)
      return
    }
    // 未保存
    wx.canvasToTempFilePath({
      canvasId: 'myCanvas',
      success: saveRet => {
        this.save(saveRet.tempFilePath)
        this.tempPoster = saveRet.tempFilePath
      },
      fail: err => {
        wx.showToast({
          title: '取消了保存',
          icon: 'none',
          duration: 2500
        })
      }
    }, this)
  },
  save(path) {
    wx.saveImageToPhotosAlbum({
      filePath: path,
      success: () => {
        wx.showToast({
          title: '保存成功'
        })
        setTimeout(this.preview, 1000)
      },
      fail: err => {
        wx.showToast({
          title: '保存失败',
          icon: 'none',
          duration: 2500
        })
      }
    })
  },
  /** 预览 */
  preview: function () {
    // 已保存画布为临时文件
    if (this.tempPoster) {
      wx.previewImage({
        urls: [this.tempPoster]
      })
      return
    }
    // 未保存
    wx.canvasToTempFilePath({
      canvasId: 'myCanvas',
      success: saveRet => {
        this.tempPoster = saveRet.tempFilePath
        wx.previewImage({
          urls: [this.tempPoster]
        })
      }
    }, this)
  },

  onLoad: function (options) {
    console.log('海报所需要的信息',options)
    app.globalData.getTop();
    wx.showLoading({
      title: '生成海报中...',
      mask: true
    })
    const that = this
    const systemInfo = wx.getSystemInfoSync()
    const ch = systemInfo.windowHeight - 50 // 海报高度
    const cw = 0.64 * ch // 海报宽度
    this.adjustCanvasSize(cw, ch)

    const mainW = 0.861 * cw // 主内容宽
    const mainOffset = 0.0695 * cw // 主内容边距
    const mainH = ch - 2 * mainOffset // 主内容高
    const contentSide = 0.129 * cw // 下部内容侧边距

    const nameY = cw

    const titleY = 1.06 * cw

    const logoSize = 0.1071 * cw
    const logoY = 0.9554 * cw
    const logoX = cw - contentSide - logoSize

    const tagsY = 1.11 * cw

    const hrY = 1.2123 * cw
    const hrX = contentSide - 5

    const phoneY = 1.2877 * cw
    const wechatY = 1.3423 * cw
    const addressY = 1.4 * cw
    const iconSize = 13
    const textX = 0.1915 * cw

    const mpcodeSize = 0.19 * cw
    const mpcodeY = 1.251 * cw
    const mpcodeX = cw - contentSide - mpcodeSize

    const ctx = wx.createCanvasContext('myCanvas')

    // 绘制灰色背景
    ctx.setFillStyle('#f7f7f7')
    ctx.fillRect(0, 0, cw, ch)
    // 绘制主体白色背景
    ctx.setFillStyle('white')
    ctx.fillRect(mainOffset, mainOffset, mainW, mainH)
    // 绘制一系列网络图片
    wx.getImageInfo({
      src: decodeURIComponent(options.avatar).replace('http:','https:'),
      success: avatarRes => {
        // 绘制头像
        ctx.drawImage(avatarRes.path, mainOffset, mainOffset, mainW, mainW)

        wx.getImageInfo({
          src: decodeURIComponent(options.logo).replace('http:','https:'),
          success: logoRes => {
            // 绘制公司logo
            ctx.drawImage(logoRes.path, logoX, logoY, logoSize, logoSize)

            wx.getImageInfo({
              src: decodeURIComponent(options.mpcode),
              success: mpcodeRes => {
                // 绘制小程序码
                ctx.drawImage(mpcodeRes.path, mpcodeX, mpcodeY, mpcodeSize, mpcodeSize)
                // 绘制剩余部分
                drawRest(ctx, options)
              },
              fail: err => {
                this.getImgErr('小程序码', err.errMsg || err.toString())
              }
            })
          },
          fail: err => {
            this.getImgErr('公司logo', err.errMsg || err.toString())
          }
        })
      },
      fail: err => {
        this.getImgErr('头像', err.errMsg || err.toString())
      }
    })

    function drawRest () {
      let name = options.name.length > 5 ? (options.name.substring(0, 5) + '...') : options.name
      let tagLeft = contentSide

      ctx.setFontSize(16)
      ctx.setFillStyle('black')
      ctx.fillText(name, contentSide, nameY)

      if (options.title) {
        ctx.setFontSize(13)
        ctx.setFillStyle('#888888')
        ctx.fillText(options.title, contentSide, titleY)
      }
      // 标签1
      if (options.tag0) {
        ctx.setFontSize(10)
        const tag0W = ctx.measureText(options.tag0).width
        ctx.setFillStyle('#ECECEC')
        ctx.fillRect(tagLeft, tagsY, tag0W + 20, 20)
        ctx.setFillStyle('#444444')
        ctx.fillText(options.tag0, tagLeft + 10, tagsY + 14)
        // 标签2
        if (options.tag1) {
          tagLeft += (tag0W + 30)
          const tag1W = ctx.measureText(options.tag1).width
          ctx.setFillStyle('#ECECEC')
          ctx.fillRect(tagLeft, tagsY, tag1W + 20, 20)
          ctx.setFillStyle('#444444')
          ctx.fillText(options.tag1, tagLeft + 10, tagsY + 14)
          // 标签3 最多画3个
          if (options.tag2) {
            tagLeft += (tag1W + 30)
            const tag2W = ctx.measureText(options.tag2).width
            ctx.setFillStyle('#ECECEC')
            ctx.fillRect(tagLeft, tagsY, tag2W + 20, 20)
            ctx.setFillStyle('#444444')
            ctx.fillText(options.tag2, tagLeft + 10, tagsY + 14)
          }
        }
      }
      // 绘制分割线
      ctx.setFillStyle('#f7f7f7')
      ctx.fillRect(hrX, hrY, cw - 2 * hrX, 1)
      // 手机号
      if (options.phone) {
        ctx.drawImage('../../assets/img/i-telephone.png', contentSide, phoneY - 11, iconSize, iconSize)
        ctx.setFontSize(12)
        ctx.setFillStyle('#333333')
        ctx.fillText(options.phone, textX, phoneY)
      }
      // 微信号
      if (options.wechat) {
        ctx.drawImage('../../assets/img/i-wechat0.png', contentSide, wechatY - 11, iconSize, iconSize)
        ctx.setFontSize(12)
        ctx.setFillStyle('#333333')
        ctx.fillText(options.wechat, textX, wechatY)
      }
      // 地址
      if (options.address) {
        ctx.drawImage('../../assets/img/i-locate.png', contentSide, addressY - 11, iconSize, iconSize)
        ctx.setFontSize(12)
        ctx.setFillStyle('#333333')
        const addressW = ctx.measureText(options.address).width
        const freeW = mpcodeX - textX - 14
        if (addressW > freeW) {
          // 需要换行
          ctx.fillText(options.address.substring(0, freeW / 12), textX, addressY)
          ctx.fillText(options.address.substring(freeW / 12), textX, addressY + 16)
        } else {
          ctx.fillText(options.address, textX, addressY)
        }
      }

      that.drawIt(ctx)
    }
  }
})
