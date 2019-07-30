// pages/pt_wode/pt_wode.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     currentData:2,
     datas:[]
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
    var that = this;
    wx.getStorage({
      key: 'userinfo',
      success: function (res) {
        that.setData({
          datas: res.data
        });
      },
    })
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
  jump: function (e) {
    var that = this;
    console.log(e)
    //var currrent = e.currentTarget.detaset.current
    that.setData({
      currentData: e.currentTarget.dataset.current
    })
  },
  index: function (e) {
    wx.redirectTo({
      url: '../pt_mall/pt_mall',
    })
  },
  jg: function (e) {
    wx.redirectTo({
      url: '../pt_jigou/pt_jigou',
    })
  },
  //全部订单
  all: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '../pt_jfdd/pt_jfdd?current=' + e.currentTarget.dataset.current,
    })
  },
  //收货地址
  sh:function(e){
    wx.navigateTo({
      url: '../pt_sh/pt_sh',
    })
  },
  //积分订单
  intergral:function(e){
    wx.navigateTo({
      url: '../pt_integralorder/pt_integralorder',
    })
  }
})