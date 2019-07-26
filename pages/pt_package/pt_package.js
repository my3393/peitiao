// pages/pt_package/pt_package.js
const app = getApp();
var bcode;
var detail_id;
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detaillist:[],
    merchants:[],
    banner:[],
    detail:[],
    details: "",
    tag: [
      { id: 1, name: '全部商品' },
      { id: 2, name: '礼品专区' }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    wx.getStorage({
      key: 'userinfo',
      success: function (res) {
        bcode = res.data.user_id;
        console.log(bcode + "----")
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
            banner: res.data.data.productImgs,
            detail: res.data.data.productDetails.replace(/\<img/gi, '<img style="max-width:100%;height:auto"')
          })
          WxParse.wxParse('article', 'html', res.data.data.productDetails, that, 5);
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
      phoneNumber: this.data.detaillist.servicePhone
    })
  },
  getdian:function(){
    wx.request({
      url: app.data.urlmall + "/appmatchhome/allmatchstore.do",
      data: {
        type: 2
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
            merchants: res.data.data.data
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
  //立即购买
  buy:function(e){
   wx.navigateTo({
     url: '../pt_fwtj/pt_fwtj?id=' + e.currentTarget.id,
   })
  },

  details: function (e) {
    // console.log(e)
    wx.navigateTo({
      url: '../pt_scx/pt_scx?id=' + e.currentTarget.id,
    })
  },
 
})