// pages/pt_tjdd/pt_tjdd.js
const app = getApp();
var bcode;
var detail_id;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detaillist: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    detail_id = options.id;
    this.getdetaillist();
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
      path: '/pages/funcicle/funcicle?bindcode=' + bcode + "&scode=" + scode
    }
  },
  getdetaillist: function () {
    var that = this;
    wx.request({
      url: app.data.urlmall + "/appproduct/detail.do",
      data: {
        id: detail_id,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      success: function (res) {
        console.log(res.data.data)
        if (res.data.status === 100) {
          that.setData({
            detaillist: res.data.data,
          
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
  //提交订单
  getti: function () {
    var that = this;
    console.log(that.data.num)
    wx.request({
      url: app.data.urlmall + "/apppay/singlesuborder.do",
      data: {
        productId: detail_id,
        productCount: 1,
        token: wx.getStorageSync("ptoken"),
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      success: function (res) {
        //console.log(res.data.data)
        if (res.data.status === 100) {
           that.pay();
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  //支付
  pay: function (e) {
    var that = this;
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
          //console.log(res.data)
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
                duration: 2000
              })
              wx.redirectTo({
                url: '../pt_success/pt_success',
              })
            },
            fail(res) { }
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

})