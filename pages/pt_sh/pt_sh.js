// pages/pt_sh/pt_sh.js
const app = getApp();
var bcode;
var detail_id;
var token;
var deletid;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:[],
    ishide:true,
    adre:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.getaddress();
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
    this.getaddress();
    wx.getStorage({
      key: 'userinfo',
      success: function (res) {
        bcode = res.data.user_id;
        //console.log(bcode + "----")
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
    clearTimeout()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    wx.showToast({
      title: '加载中',
      icon: "none"
    })
    var that = this;
    //模拟加载
    setTimeout(function () {

      this.getaddress();
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新

    }, 1000);
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
  add:function(){
    wx.navigateTo({
      url: '../pt_dz/pt_dz',
    })
  },
  getaddress: function () {
    var that = this;
    wx.request({
      url: app.data.urlmall + "/appuseraddress/list.do",
      data: {
        token: wx.getStorageSync("ptoken"),
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      success: function (res) {
        console.log(res.data.data.data)
        if (res.data.status === 100) {
          that.setData({
             address: res.data.data.data,
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
  delet:function(e){
    var that = this;
    console.log(e)
     deletid = e.currentTarget.id
    that.setData({
      ishide: !that.data.ishide
    })
  },
  // 删除地址
  delets:function(e){
    console.log(e)
    var that = this;
    var id = deletid;
    console.log(id)
    wx.request({
      url: app.data.urlmall + "/appuseraddress/delete.do",
      data: {
        token: wx.getStorageSync("ptoken"),
        id: id
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
            title: '删除成功',
            icon: 'success'
          })
          that.setData({
            ishide: !that.data.ishide
          })
          that.getaddress();
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  //修改地址
  edit:function(e){
    console.log(e)
    wx.redirectTo({
      url: '../pt_addressedit/pt_addressedit?id=' + e.currentTarget.id ,
    })
  },
  //选择地址
  choose:function(e){
    console.log(e)
    var that = this;
    wx.request({
      url: app.data.urlmall + "/appuseraddress/goedit.do",
      data: {
        token: wx.getStorageSync("ptoken"),
        id: e.currentTarget.id
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      success: function (res) {
        console.log(res.data.data)
        if (res.data.status === 100) {
          // that.setData({
          //   adre: res.data.data,
          // })
          wx.setStorage({
            key: 'address',
            data: res.data.data,
          })
          wx.navigateBack({
            delta: 1,
          })

        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  //  setTimeout(function(){
  //    wx.setStorage({
  //      key: 'address',
  //      data: that.data.adre,
  //    })
  //    wx.navigateBack({
  //      delta: 1,
  //    })
  //  },500)
   
  
  }
})