// pages/pt_scx/pt_scx.js
const app = getApp();
var bcode;
var detail_id;
var ptproduct = [];
var currentPage = 1;
var dynamic = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
     banner:[],
     information:[],
     giftlist:[],
     pageSize:6,
     totalResult:10,
     totalPage:1,
     currentPage:1,
     tar:"2",
     tab:"2",
     tag:[
       {id:1,name:'全部商品'},
       {id:2,name: '礼品专区'},
       {id:3, name: '微动态' }
     ],
    dynamic:[],
    img:[],
    video:[],
    idx:'',
    isvideo: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    detail_id = options.id;
    wx.request({
      url: app.data.urlmall + "/appstore/detail.do",
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
            information: res.data.data,
           
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    }),
    //用户终身绑定配套商家
      wx.request({
        url: app.data.urlmall + "/appstore/setbindstore.do",
        data: {
          id: detail_id,
          token: wx.getStorageSync('ptoken')
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
            //   information: res.data.data,

            // })
          } else {
            // wx.showToast({
            //   title: res.data.msg,
            //   icon: 'none'
            // })
          }
        }
      })
    //微动态
    wx.request({
      url: app.data.urlmall + "/appstore/dynamic.do",
      data: {
        id: detail_id,
        currentPage: that.data.currentPage,
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
            var l = [];
            for (var j in res.data.data.data[i].dynamicFiles) {
              if (res.data.data.data[i].type == 1) {
                l.push(res.data.data.data[i].dynamicFiles[j].filePathOss)
                res.data.data.data[i].img = l;
                res.data.data.data[i].video = [];
              } else {
                l.push(res.data.data.data[i].dynamicFiles[j].filePathOss)
                res.data.data.data[i].video = l;
                res.data.data.data[i].img = [];
              }
             
            }
          }
          console.log(res.data.data.data.length)
          that.setData({
            dynamic: res.data.data.data,
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getbannerlist();
    this.getgiftlist();
    wx.getStorage({
      key: 'userinfo',
      success: function (res) {
        bcode = res.data.user_id;
       
      },
    })
    var that = this;
    
    setTimeout(function(){
      console.log(that.data)
      wx.setNavigationBarTitle({
        title: that.data.information.storeName,
      })
    },500)
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    var that = this;
    setTimeout(function(){
      that.setData({
        banner: [],
        giftlist: [],

        pageSize: 6,
        totalResult: 10,
        totalPage: 1,
      })
    },500)
    ptproduct = [];
    totalPage: 1;
    currentPage = 1;
 
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var that = this;
    that.setData({
      banner: [],
      giftlist: [],
      information: [],
      pageSize: 6,
      totalResult: 10,
      totalPage: 1,
    })
    ptproduct = [] ;
    totalPage: 1;
    currentPage = 1;
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
    var that = this;
    if (currentPage == that.data.totalPage) {
      wx.showToast({
        title: '别拉了，已经到底了',
        icon: 'none'
      })
    } else {
      currentPage = currentPage + 1;
      this.getbannerlist();
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
      title: '一手明星资源，尽在娱乐世界！',
      path: '/pages/pt_mall/pt_mall?bindcode=' + bcode + "&scode=" + scode
    }
  },
  getbannerlist:function (){
    var that = this;
    wx.request({
      url: app.data.urlmall + "/appstore/sellproduct.do",
      data: {
        id: detail_id,
        currentPage: currentPage,

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
            ptproduct.push(res.data.data.data[i])
          }
          that.setData({
            banner: ptproduct,
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
  },
  getgiftlist: function () {
    var that = this;
    wx.request({
      url: app.data.urlmall + "/appstore/integralproduct.do",
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
            giftlist:res.data.data.data
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
  sinformation:function(e){
    //console.log(e)
    wx.navigateTo({
      url: '../pt_sjxx/pt_sjxx?id=' + e.currentTarget.id,
    })
  },
  // 联系商家
  callkf: function (e) {
    wx.makePhoneCall({
      phoneNumber: this.data.information.servicePhone
    })
  },
  details:function(e){
    console.log(e)
    if (e.currentTarget.dataset.type == 0) {
      wx.navigateTo({
        url: '../pt_virtual_d/pt_virtual_d?id=' + e.currentTarget.id,
      })
    }else if(e.currentTarget.dataset.type == 1){
      wx.navigateTo({
        url: '../pt_puxq/pt_puxq?id=' + e.currentTarget.id,
      })
    }else if(e.currentTarget.dataset.type == 2) {
      wx.navigateTo({
        url: '../pt_package/pt_package?id=' + e.currentTarget.id,
      })
    }else{
      wx.navigateTo({
        url: '../pt_fwxq/pt_fwxq?id=' + e.currentTarget.id,
      })
    }
     
   
  },
  //商品切换
  tag: function (e) {
    var that = this;
    console.log(e.currentTarget.dataset.num)
    that.setData({
      tar: e.currentTarget.dataset.num,
      tab: e.currentTarget.dataset.num
    })
    
  },
  //查看图片
  imgsrc: function (e) {
    var that =this;
   
    console.log(e)
    var num = e.currentTarget.dataset.num;
    var selectindex = e.currentTarget.dataset.src;//获取data-src
    var imgList = this.data.dynamic[num].img;//获取data-list
    //图片预览
    wx.previewImage({
      current: selectindex, // 当前显示图片的http链接   
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  //查看视频
  hidevideo: function (e) {
    var that = this;
    that.setData({
      isvideo: !that.data.isvideo
    })
  },
  seevideo: function (e) {
    var that = this;
    that.setData({
      isvideo: !that.data.isvideo,
      play: e.currentTarget.dataset.src
    })
  },
  
})