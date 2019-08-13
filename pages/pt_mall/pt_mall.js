// pages/pt_mall/pt_mall.js
var app = getApp();
var pt = [];
var ids=[];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentData:0,
    currentPage:1,
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    details:[],
    totalPage:'',
    banner:[],
    integral:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     var that = this
   
     if(!wx.getStorageSync('ptoken')){
      setTimeout(function(){
        wx.navigateTo({
          url: '/pages/login/login',
        })
      },500)
     }
     that.getdetail();
     that.getbanner();
     that.getintegral();
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
    wx.setStorage({
      key: 'current',
      data: that.data.currentData,
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
      details: [],
      totalPage: '',
    })
    pt = [];
   
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
        details: [],
        totalPage: '',
        currentPage:1
      })
      pt = [];
      that.getdetail();
      that.getbanner();
      that.getintegral();
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
         title: '已经到底了',
         icon:'none'
       })
    } else {
      that.setData({
        currentPage :that.data.currentPage + 1
      })
     that.getdetail();
    }
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
  getbanner: function () {
    var that = this;
    wx.request({
      url: app.data.urlmall + "/appmallhome/banner.do",
      data: {
       
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      success: function (res) {
        if (res.data.status === 100) {
        //  console.log(res.data.data)
          
          for(var i in res.data.data){
            res.data.data[i].ids=res.data.data[i].webUrl.split('=')[1]
            
          }
         
          that.setData({
            banner:res.data.data
          })
         // console.log(that.data.banner)
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  //积分乐园
  getintegral:function(){
    var that = this;
    wx.request({
      url: app.data.urlmall + "/appmallhome/integralproduct.do",
      data: {
        
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      success: function (res) {
        if (res.data.status === 100) {
          console.log(res.data.data)
          that.setData({
            integral: res.data.data,          
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
  //全部商品
  getdetail: function () {
    var that = this;
    wx.request({
      url: app.data.urlmall + "/appproduct/allproduct.do",
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
          for(var i in res.data.data.data){
            pt.push(res.data.data.data[i])
          }
          that.setData({
            details: pt,
            totalPage: res.data.data.totalPage
          })
         console.log(that.data.totalPage)
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },

  jump:function(e){
    var that = this;
    console.log(e)
    //var currrent = e.currentTarget.detaset.current
    that.setData({
      currentData: e.currentTarget.dataset.current
    })
  },
  jg:function(e){
    wx.redirectTo({
      url: '../pt_jigou/pt_jigou',
    })
  },
  my: function (e) {
    wx.redirectTo({
      url: '../pt_wode/pt_wode',
    })
  },
  enters:function(e){
    console.log(e)
    if (e.currentTarget.dataset.type == 0) {
      wx.navigateTo({
        url: '../pt_virtual_d/pt_virtual_d?id=' + e.currentTarget.id,
      })
    }else if (e.currentTarget.dataset.type == 1) {
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
  into:function(e){
    wx.navigateTo({
      url: '../pt_jfly/pt_jfly',
    })
  }
})