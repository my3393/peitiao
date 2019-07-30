// pages/pt_tjdd/pt_tjdd.js
const app = getApp();
var bcode;
var detail_id;
var token;
var sum;
var name;
var goodId;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detaillist: [],
    details: [],
    nums: '',
    pric: '',
    price: '',
    prices: '',//总共价格
    num: "", //选择的数量
    names: '',//选择的规格
    defalutaddres: [],//默认地址
    adress: [],//选择的地址
    mess: '',//留言
    addressId: '',
    goodId: '',
    sku: [],
    skus: [],
    defalutaddresId: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options)
    detail_id = options.id;

    that.setData({
      num: options.num,
      goodId: options.goodId,
      names: options.name
    })

    this.getdetaillist();

    this.getDefaultaddress();
    that.getsku();
    //setTimeout(function () {

    //   that.setData({
    //     prices: that.data.skus.price * options.num,

    //   })
    // }, 2500)
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

    wx.getStorage({
      key: 'address',
      success: function (res) {
        console.log(res.data)
        that.setData({
          adress: res.data
        })
      },
    })
    that.getDefaultaddress();
    that.getaddress();


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
    clearTimeout()
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
  //获取商品详情
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
            pric: (res.data.data.defaultPrice) * 10 / 100,
            price: res.data.data.defaultPrice
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
  //获取商品规格id
  getsku: function () {
    var that = this;
    wx.request({
      url: app.data.urlmall + "/appproduct/sku.do",
      data: {
        id: detail_id
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
            sku: res.data.data,
          })
          for (var i in res.data.data) {
            console.log(that.data.goodId)
            if (that.data.goodId == res.data.data[i].id) {
              that.setData({
                skus: res.data.data[i],
                prices: res.data.data[i].price * that.data.num,
              })
              console.log(that.data.skus)
            }

          }


        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  //提交订单
  getti: function () {
    var that = this;
    console.log(that.data.num)
    
  },
  //提交选择地址
  getdetail: function () {
    var that = this;
    console.log(that.data.defalutaddres != null)
    console.log(that.data.adress.length == 0)
    if (that.data.defalutaddres != null && that.data.adress.length == 0) {
      that.setData({
        addressId: that.data.defalutaddres.id,
      })
      console.log(111)

    } else if (that.data.defalutaddres != null && that.data.adress.length != 0) {
      that.setData({
        addressId: that.data.adress.id,
      })
      console.log(222)

    } else if (that.data.defalutaddres == null && that.data.adress.length != 0) {
      that.setData({
        addressId: that.data.adress.id,
      })
      console.log(333)


    } else if (that.data.defalutaddres == null && that.data.adress.length == 0) {
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none'
      })
      return false
    }
    //提交订单
    wx.request({
      url: app.data.urlmall + "/apppay/singlesuborder.do",
      data: {
        productId: detail_id,
        productCount: that.data.num,
        addressId: that.data.addressId,
        skuId: that.data.goodId,
        token: wx.getStorageSync("ptoken"),
        singleLeaveMessage: that.data.mess,
        shareUserId: wx.getStorageSync("bcode")
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
            url: app.data.urlmall + "/appchangenumber/xcxpay.do",
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
                  fail(res) { }
                })


              } else {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none'
                })
              }
            }
          })
          setTimeout(function () {
            wx.redirectTo({
              url: '../pt_success/pt_success',
            })
          }, 2000)
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
    //调取支付
    
  },
  pay: function (e) {
    var that = this;
   
  },
  getDefaultaddress: function () {
    var that = this;
    wx.request({
      url: app.data.urlmall + "/appuseraddress/getdefault.do",
      data: {
        token: wx.getStorageSync("ptoken"),
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      success: function (res) {
        if (res.data.status === 100) {
          console.log(res.data.data)
          if (res.data.data != null) {
            that.setData({
              defalutaddres: res.data.data,
              defalutaddresId: res.data.data.id,
            })
          }


        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },

  getaddress: function () {
    var that = this;
    wx.request({
      url: app.data.urlmall + "/appuseraddress/getdefault.do",
      data: {
        token: wx.getStorageSync("ptoken"),
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      success: function (res) {

        if (res.data.status === 100) {
          // console.log(res.data.data)
          that.setData({
            defalutaddres: res.data.data,
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

  choose() {
    var that = this;
    wx.navigateTo({
      url: '../pt_sh/pt_sh',
    })
  },
  mess: function (e) {
    this.setData({
      mess: e.detail.value
    })
  },
  submit: function (e) {
    var that = this;
    that.getdetail();
  }
})