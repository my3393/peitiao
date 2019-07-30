// pages/ pt_service/pt_service.js
const app = getApp();
var bcode;
var store = [];
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
     banner:[],  
     merchants:[],
     currentPage:1,
     totalResult: '',
     totalPage: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: app.data.urlmall + "/appmatchhome/matchproduct.do",
      data: {
        type: 2
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      success: function (res) {
        // console.log(res.data.data)
        if(res.data.status === 100){
          that.setData({
              banner:res.data.data
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    }),
     that.getstore();
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
  // 页面隐藏
  onHide:function(){
    this.setData({
      currentPage: 1,
      totalResult: '',
      totalPage: '',
    })
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

      that.setData({
        merchants: [],
        totalPage: '',
        currentPage: 1
      })
      store = [];
      that.getstore();
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新

    }, 1000);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    if (that.data.currentPage == that.data.totalPage) {
      wx.showToast({
        title: '没有更多了',
        icon: 'none'
      })
    } else {
      that.setData({
        currentPage : that.data.currentPage + 1
      })
     
      this.getstore();
    }
  },

  /**
     * 用户点击右上角分享
     */
  onShareAppMessage: function () {
    console.log(wx.getStorageSync("userinfo"))
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
  enters:function(e){
     wx.navigateTo({
       url: '../pt_mall/pt_mall',
     })
  },
  bannde:function(e){
    console.log(e)
    if (e.currentTarget.dataset.type == 1) {
      wx.navigateTo({
        url: '../pt_puxq/pt_puxq?id=' + e.currentTarget.id,
      })
    } else if (e.currentTarget.dataset.type == 2) {
      wx.navigateTo({
        url: '../pt_package/pt_package?id=' + e.currentTarget.id,
      })
    } else {
      wx.navigateTo({
        url: '../pt_fwxq/pt_fwxq?id=' + e.currentTarget.id,
      })
    }
  },
  detail:function (e) {
  // console.log(e)
    wx.navigateTo({
      url: '../pt_scx/pt_scx?id='+e.currentTarget.id,
    })
  },
  // 入驻申请
  apply:function(){
    wx.navigateTo({
      url: '../pt_rz/pt_rz',
    })
  },
  // 精确查找
  find: function () {
    wx.navigateTo({
      url: '../pt_findone/pt_findone',
    })
  },
  //全部商家
  getstore: function (e) {
    var that = this;
    wx.request({
      url: app.data.urlmall + "/appmatchhome/allmatchstore.do",
      data: {
        currentPage: that.data.currentPage
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      success: function (res) {
        console.log(res.data.data)
        if (res.data.status === 100) {
          for (var i in res.data.data.data) {
            store.push(res.data.data.data[i])
          }
          that.setData({
            merchants: store,
            totalResult: res.data.data.totalResult,
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
  }
})