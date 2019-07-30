// pages/pt_tjdd/pt_tjdd.js
const app = getApp();
var bcode;
var detail_id;
var token;
var sum;
var name;
var goodId;
var detailss =[];//全部数量累加
var sends = [];//待付款数量累加
var sendorders = [];//待发货数量累加
var waits = [];//待收货数量累加
Page({

  /**
   * 页面的初始数据
   */
  data: {  
    details: [],
    send:[],
    sendorder:[],
    wait:[],
    currentPage:1,
    totalPage: '',
    current:'',
    isShelf:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      current:options.current
    })
    that.getdetail();
    that.getsend();
    that.getsendorder();
    that.getwait();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
   this.setData({
     currentPage: 1,
     totalPage: '',
   })
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
        send: [],
        sendorder: [],
        wait: [],
        currentPage: 1,
        totalPage: '',
        
        isShelf: '',
      })
      detailss = [];//全部数量累加
      sends = [];//待付款数量累加
      sendorders = [];//待发货数量累加
      waits = [];//待收货数量累加
      that.getdetail();
      that.getsend();
      that.getsendorder();
      that.getwait();
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新

    }, 1000);
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
      that.getsend();
      that.getsendorder();
      that.getwait();
      console.log(that.data.currentPage)
    }
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
  
  getdetail: function (e) {
    //console.log(e)
    //var id = e.currentTarget.dataset
    var that = this;
    wx.request({
      url: app.data.urlmall + "/appmyorder/allorder.do",
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
          console.log(res.data.data.data)  
          for (var i in res.data.data.data) {
            detailss.push(res.data.data.data[i])
          }      
            that.setData({
              details: detailss,
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
  getsend:function(){
    var that = this;
    wx.request({
      url: app.data.urlmall + "/appmyorder/waitpayorder.do",
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
          console.log(res.data.data.data)
          for (var i in res.data.data.data) {
            sends.push(res.data.data.data[i])
          }
          that.setData({
            send: sends
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
  getsendorder: function () {
    var that = this;
    wx.request({
      url: app.data.urlmall + "/appmyorder/waitsendorder.do",
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
          console.log(res.data.data.data)
          for (var i in res.data.data.data) {
            sendorders.push(res.data.data.data[i])
          }
          that.setData({
            sendorder: sendorders
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
  getwait: function () {
    var that = this;
    wx.request({
      url: app.data.urlmall + "/appmyorder/waitproductorder.do",
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
          console.log(res.data.data.data)
          for (var i in res.data.data.data) {
            waits.push(res.data.data.data[i])
          }
          that.setData({
            wait: waits
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
  turn:function(e){
    console.log(e)
    detailss = [];
    sends = [];//待付款数量累加
    sendorders = [];//待发货数量累加
    waits = [];
    this.setData({
      current:e.currentTarget.dataset.current,
      currentPage: 1,
      totalPage: '',
      details: [],
      send: [],
      sendorder: [],
      wait: [],
    })
    this.getdetail();
    this.getsend();
    this.getsendorder();
    this.getwait()
    //console.log(this.data.details[0].status)
  },
  pay:function(e){
    var that = this;
    console.log(e)
    if (e.currentTarget.dataset.isshelf == '0'){
          wx.showToast({
            title: '该店铺已不存在',
            icon:'none'
          })
     }else{
       wx.request({
         url: app.data.urlmall + "/apppay/gopay.do",
         data: {
           orderId: e.currentTarget.id,
           token: wx.getStorageSync("ptoken"),
         },
         method: 'POST',
         header: {
           'content-type': 'application/x-www-form-urlencoded'
         },
         dataType: 'json',
         success: function (res) {
           console.log(res.data.data)
           if (res.data.status === 100) {
             wx.request({
               url: app.data.urlmall + "/apppay/xcxpay.do",
               data: {
                 token: wx.getStorageSync("ptoken"),
                 payType: 1,
               },
               method: 'POST',
               header: {
                 'content-type': 'application/x-www-form-urlencoded'
               },
               dataType: 'json',
               success: function (res) {
                 if (res.data.status === 100) {
                   console.log(res.data)
                   wx.requestPayment({
                     timeStamp: res.data.data.sign.timeStamp,
                     nonceStr: res.data.data.sign.nonceStr,
                     package: res.data.data.sign.package,
                     signType: 'MD5',
                     paySign: res.data.data.sign.paySign,
                     success(res) {
                       wx.showToast({
                         title: '支付成功',
                         icon: 'none',
                         duration: 1000
                       })
                       wx.redirectTo({
                         url: '../pt_success/pt_success',
                       })
                     },
                     fail(res) {
                       wx.showToast({
                         title: '支付失败',
                         icon: 'none',
                         duration: 1000
                       })
                     }
                   })


                 } else {
                   wx.showToast({
                     title: res.data.msg,
                     icon: 'none'
                   })
                 }
               }
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
   
  },
  detail:function(e){
    var that = this;
    console.log(e)
   wx.navigateTo({
     url: '../pt_my_paying/pt_my_paying?id=' + e.currentTarget.id,
   })
   }, 
   //进店
   stores:function(e){
     var that = this;
     console.log(e)
     if (e.currentTarget.dataset.isshelf == '0') {
       wx.showToast({
         title: '该店铺已不存在',
         icon: 'none'
       })
     }else{
       wx.navigateTo({
         url: '../pt_scx/pt_scx?id=' + e.currentTarget.id,
       })
     }
     
   }
  
})