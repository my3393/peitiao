// pages/pt_tjdd/pt_tjdd.js
const app = getApp();
var bcode;
var detail_id;
var token;
var detailss = [];//全部数量累加
Page({

  /**
   * 页面的初始数据
   */
  data: {
    details: [],
    currentPage: 1,
    totalPage: '',
    current: '',
    isShelf: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
  
    that.getdetail();

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
    var that = this;
    that.setData({
      adress: [],
    })

  },
  // 上拉触底
  onReachBottom: function () {
    var that = this;
    if (that.data.currentPage == that.data.totalPage) {
      wx.showToast({
        title: '没有更多了',
        icon: 'none'
      })
    } else {
      that.setData({
        currentPage: that.data.currentPage + 1,
      })
      that.getdetail();
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    wx.showToast({
      title: '刷新中',
      icon: "none"
    })
    var that = this;
    //模拟加载
    setTimeout(function () {

      that.setData({
        details: [],    
        currentPage: 1,
        totalPage: '',
        current: '',
        isShelf: '',
      })
      detailss = [];//全部数量累加
      that.getdetail();
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新

    }, 1000);
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

  getdetail: function () {
    var that = this;
    wx.request({
      url: app.data.urlmall + "/appmyorder/integralorder.do",
      data: {
        token: wx.getStorageSync("ptoken"),
        currentPage: that.data.currentPage
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      success: function (res) {
        if (res.data.status === 100) {
          console.log(res.data.data)
          for (var i in res.data.data.data) {
            detailss.push(res.data.data.data[i])
          }
          that.setData({
            details: detailss,
            totalPage: res.data.data.totalPage
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
  //查看详情
  detail: function (e) {
    var that = this;
    console.log(e)
    wx.navigateTo({
      url: '../pt_jfdh/pt_jfdh?id=' + e.currentTarget.id,
    })
  },
  //进店
  stores: function (e) {
    var that = this;
    console.log(e)
    if (e.currentTarget.dataset.isshelf == '0') {
      wx.showToast({
        title: '该店铺已不存在',
        icon: 'none'
      })
    } else {
      wx.navigateTo({
        url: '../pt_scx/pt_scx?id=' + e.currentTarget.id,
      })
    }

  },



})