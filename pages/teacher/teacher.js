// pages/teacher/teacher.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
     banner:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getbanner();
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

  },
  //老师入驻
  enter:function(){
    var that = this;
    wx.navigateTo({
      url: '../teacher_enter/teacher_enter',
    })
  },
  getbanner(){
    var that = this;
    wx.request({
      url: app.data.urlmall + "/appteacher/getbanner.do",
      data: {
        token:wx.getStorageSync('ptoken'),
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      success: function (res) {
        console.log(res.data.data)
        if (res.data.status == 100) {
          that.setData({
            banner: res.data.data,
            
          });
          
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  search:function () {
    var that = this;
    detail = [];
    wx.request({
      url: app.data.urlhead + "/ylsj-api-service/apphome/searchartist.do",
      data: {
        keywords:that.data.value,
        currentPage: that.data.currentPage
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      success: function (res) {
        console.log(res.data.data)
        if (res.data.status == 100) {
         
         
          for (var i in res.data.data.artists) {
            detail.push(res.data.data.artists[i]);
          }
          that.setData({
            detail: detail,
            totalPage: res.data.data.totalPage
          });
          
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