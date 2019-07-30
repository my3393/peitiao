// pages/pt_jf_cg/pt_jf_cg.js
var timer = require('../../utils/timer.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    verifyCode: '', //6617
    captchaLabel: '获取验证码',
    seconds: timer.length,
    captchaDisabled: false
  },
  captcha: function (e) {
    var param = {
      phone: this.data.phone
    };
    // 禁用按钮点击
    this.setData({
      captchaDisabled: true
    });
    // 立刻显示重发提示，不必等待倒计时启动
    this.setData({
      captchaLabel: timer.length + '秒后重新发送'
    });
    // 启动以1s为步长的倒计时
    var interval = setInterval(() => {
      timer.countdown(this);
    }, 1000);
    // 停止倒计时
    setTimeout(function () {
      clearInterval(interval);
    }, timer.length * 1000);

    if (this.data.seconds == timer.length) {
      console.log('post');
      wx.showToast({
        title: '发送成功'
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  getBtn: function (options) {
    var that = this;
    var currentTime = that.data.currentTime;
    that.setData({
      time: currentTime + '秒'
    })
    interval = setInterval(function () {
      that.setData({
        time: (currentTime - 1) + '秒'
      })
      currentTime--;
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          time: '重新获取',
          currentTime: 60,
          disabled: false
        })
      }
    }, 1000)
  }
})