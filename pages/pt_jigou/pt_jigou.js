// pages/pt_jigou/pt_jigou.js
var app = getApp();
var mer =[];
var species = [];
var id = 6;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentData: 1,
    merchants:[],
    preferred:[],
    prefer:[],
    currentPage:1,
    totalPage: '',
    isShelf:'',
    industry:[],
    tar: '', 
    species:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.preferred();
    that.getstores();
    that.getinstr();
    
    //商家
    wx.request({
      url: app.data.urlmall + "/appstore/allstore.do",
      data: {
        typeId: id,
        currentPage: that.data.currentPage
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      success: function (res) {
        //console.log(res.data.data)
        if (res.data.status === 100) {
          for (var i in res.data.data.data) {
            species.push(res.data.data.data[i])
          }
          that.setData({
            species: species,
            totalPage: res.data.data.totalPage
          })
        //  console.log(species)
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
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
      mer = [];
      that.preferred();
      that.getstores();
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
        icon: 'none'
      })
    } else {
      that.setData({
        currentPage: that.data.currentPage + 1
      })
      that.truns();
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
  //我的首选
  preferred:function(){
    var that = this;
    wx.request({
      url: app.data.urlmall + "/appuser/userinfo.do",
      data: {
        token:wx.getStorageSync('ptoken')
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      success: function (res) {
        wx.showToast({
          title: res.data.status,
        })
       // console.log(res.data.data)
        if (res.data.status === 100) {
          if (res.data.data.bindStoreId != null || res.data.data.bindStoreId != ""){
            wx.request({
              url: app.data.urlmall + "/appstore/detail.do",
              data: {
                token: wx.getStorageSync('ptoken'),
                id: res.data.data.bindStoreId,
                
              },
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              dataType: 'json',
              success: function (res) {
                if (res.data.status === 100) {
                  that.setData({
                    prefer: res.data.data,
                    isShelf: res.data.data.isShelf
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
          
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
            setTimeout(function(){
              wx.navigateTo({
                url: '../login/login',
              })
            },1000)
        } 
      }
    })
  },
  jump:function (e) {
    var that = this;
   // console.log(e)
    //var currrent = e.currentTarget.detaset.current
    that.setData({
      currentData: e.currentTarget.dataset.current
    })
  },
  index:function (e) {
    wx.redirectTo({
      url: '../pt_mall/pt_mall',
    })
  },
  my:function (e) {
    wx.redirectTo({
      url: '../pt_wode/pt_wode',
    })
  },
  detail: function (e) {
    // console.log(e)
    wx.navigateTo({
      url: '../pt_scx/pt_scx?id=' + e.currentTarget.id,
    })
  },
  // 入驻申请
  apply: function () {
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
  getstores:function(e){
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
       // console.log(res.data.data)
        if (res.data.status === 100) {
          for(var i in res.data.data.data) {
            mer.push(res.data.data.data[i])
          }
          that.setData({
            merchants: mer,
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
  //类别
  getinstr:function(e){
    var that = this;
    
    wx.request({
      url: app.data.urlmall + "/appstore/storetype.do",
      data: {

      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      success: function (res) {
        //console.log(res.data.data)
        if (res.data.status === 100) {
          that.setData({
            industry: res.data.data
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
  trun:function(e){
    var that = this;
    if (e){
      id = e.currentTarget.id;
      that.setData({
        tar: e.currentTarget.dataset.index,
      })
    }
     species = [];
    that.setData({  
      currentPage: '1',
      totalPage: '',
      species :[]
    })
    wx.request({
      url: app.data.urlmall + "/appstore/allstore.do",
      data: {
        typeId:id,
        currentPage:that.data.currentPage
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      success: function (res) {
        console.log(res.data.data)
        if (res.data.status === 100) {
          for(var i in res.data.data.data){
            species.push(res.data.data.data[i])
          }         
          that.setData({
            species:species,
            totalPage:res.data.data.totalPage
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
  truns: function (e) {
    var that = this;
    wx.request({
      url: app.data.urlmall + "/appstore/allstore.do",
      data: {
        typeId: id,
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
            species.push(res.data.data.data[i])
          }
          that.setData({
            species: species,
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
  }
})