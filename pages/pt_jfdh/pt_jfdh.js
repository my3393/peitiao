// pages/pt_my_paying/pt_my_paying.js
var app = getApp();
var order = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: [],
    orders: '',
    orderId: '',
    isfund: true,
    isconfirm:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      orderId: options.id
    })
    that.detail();

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    console.log(wx.getStorageSync("userinfo").is_actor)
    var isactor = wx.getStorageSync("userinfo").is_actor;
    var isleagure = wx.getStorageSync("userinfo").shareIdentityType;
    var hasdiol = wx.getStorageSync("userinfo").idol_id;
    var bcode;
    var scode;
    if (isactor == 2) {
      bcode = wx.getStorageSync("userinfo").user_id;
      scode = wx.getStorageSync("userinfo").user_id;
    } else if (isleagure != 0 && hasdiol == null) {
      bcode = wx.getStorageSync("userinfo").user_id;
      scode = wx.getStorageSync("userinfo").user_id;
    } else if (isleagure != 0 && hasdiol != null) {
      bcode = wx.getStorageSync("userinfo").idol_id;
      scode = wx.getStorageSync("userinfo").user_id;
    } else if (hasdiol != null || hasdiol != "") {
      bcode = wx.getStorageSync("userinfo").idol_id;
      scode = wx.getStorageSync("userinfo").user_id;
    } else {
      bcode = wx.getStorageSync("userinfo").user_id;
      scode = wx.getStorageSync("userinfo").user_id;
    }
    return {
      title: '明星家园，我为自己代言',
      path: '/pages/pt_mall/pt_mall?bindcode=' + bcode + "&scode=" + scode
    }
  },
  //
  detail: function () {
    var that = this;
    wx.request({
      url: app.data.urlmall + "/appmyorder/orderdetail.do",
      data: {
        orderId: that.data.orderId,
        token: wx.getStorageSync("ptoken"),
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      success: function (res) {
        console.log(res.data.data)
        if (res.data.status === 100) {
          for (var key in res.data.data.orders) {
            order[key] = res.data.data.orders[key];
          }
          that.setData({
            detail: res.data.data,
            orders: order[0]
          })
          console.log(that.data.orders)
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  // 联系商家
  callkf: function (e) {
    wx.makePhoneCall({
      phoneNumber: this.data.detail.servicePhone
    })
  },
  //取消订单
  cancelorder: function (e) {
    var that = this;
    wx.request({
      url: app.data.urlmall + "/appmyorder/cancelorder.do",
      data: {
        orderId: that.data.orderId,
        token: wx.getStorageSync("ptoken"),
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      success: function (res) {
        console.log(res.data.data)
        if (res.data.status === 100) {
          wx.showToast({
            title: '取消成功',
            icon: 'none'
          })
          setTimeout(function () {
            wx.redirectTo({
              url: '../pt_jfdd/pt_jfdd',
            })
          }, 500)
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  pay: function (e) {
    var that = this;
    console.log(e)

    wx.request({
      url: app.data.urlmall + "/apppay/gopay.do",
      data: {
        orderId: that.data.orderId,
        token: wx.getStorageSync("ptoken"),
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      success: function (res) {
        console.log(res.data.data)
        if (res.data.status === 100) {
          wx.request({
            url: app.data.urlmall + "/apppay/xcxpay.do",
            data: {
              token: wx.getStorageSync("ptoken"),
              payType: 1,
            },
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            dataType: 'json',
            success: function (res) {
              if (res.data.status === 100) {
                console.log(res.data)
                wx.requestPayment({
                  timeStamp: res.data.data.sign.timeStamp,
                  nonceStr: res.data.data.sign.nonceStr,
                  package: res.data.data.sign.package,
                  signType: 'MD5',
                  paySign: res.data.data.sign.paySign,
                  success(res) {
                    wx.showToast({
                      title: '支付成功',
                      icon: 'none',
                      duration: 1000
                    })
                    wx.redirectTo({
                      url: '../pt_success/pt_success',
                    })
                  },
                  fail(res) {
                    wx.showToast({
                      title: '支付失败',
                      icon: 'none',
                      duration: 1000
                    })
                  }
                })


              } else {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none'
                })
              }
            }
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })

  },
  //收货
  confir: function () {
    this.setData({
      isconfirm: !isconfirm
    })
  },
  //取消
  cancelfund: function () {
    this.setData({
      isconfirm: !isconfirm
    })
  },
  confirm: function () {
    var that = this;
    wx.request({
      url: app.data.urlmall + "/appmyorder/confirmreceipt.do",
      data: {
        orderId: that.data.orderId,
        token: wx.getStorageSync("ptoken"),
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      success: function (res) {
        console.log(res.data.data)
        if (res.data.status === 100) {

        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
    that.onLoad();
  },
})