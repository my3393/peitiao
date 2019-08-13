// pages/pt_package/pt_package.js
const app = getApp();
var bcode;
var a = [];
var detail_id;
var selectIndex;//选择的大规格key
var attrIndex;//选择的小规格的key
var selectIndexArray = [];//选择属性名字的数组
var selectAttrid = [];//选择的属性id
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detaillist: [],
    banner: [],
    detail: [],
    cans: [],
    spec: [],
    entries: [],
    ishidecs: true,
    ishidegg: true,
    num: '1',
    names: '',
    selectName: "",//已选的属性名字
    selectAttrid: [],//选择的属性id
    selected: "",
    price: '',//价格
    goodId: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    detail_id = options.id;
    this.getdetaillist();
    this.getsku();
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
      title: '一手明星资源，尽在娱乐世界！',
      path: '/pages/pt_mall/pt_mall?bindcode=' + bcode + "&scode=" + scode
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
          for (var i in res.data.data.specificationItems) {
            for (var j in res.data.data.specificationItems[i].entries) {
              res.data.data.specificationItems[i].entries[j].isSelect = false;
            }

          }
          that.setData({
            detaillist: res.data.data,
            banner: res.data.data.productImgs,
            detail: res.data.data.productDetails.replace(/\<img/gi, '<img style="max-width:100%;height:auto"'),
            cans: res.data.data.productParameter,
            spec: res.data.data.specificationItems,
            entries: res.data.data.specificationItems.entries,

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
  showcs: function (e) {
    var that = this;
    that.setData({
      ishidecs: !that.data.ishidecs
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
        for (var i in res.data.data) {
          a = [];
          for (var j in res.data.data[i].specificationValues) {
            a.push(res.data.data[i].specificationValues[j].id)
            res.data.data[i].ids = a.join(",")
          }
        }

        if (res.data.status === 100) {
          console.log(res.data.data)
          that.setData({
            sku: res.data.data,
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
  showgg: function (e) {
    var that = this;
    that.setData({
      ishidegg: !that.data.ishidegg
    })
  },
  // 立即购买
  goum: function (e) {
    var that = this;
    console.log(selectIndexArray.length)
    console.log(that.data.spec.length)
    console.log(e)
    if (selectIndexArray.length === that.data.spec.length) {
      wx.navigateTo({
        url: '../pt_integral/pt_integral?id=' + e.currentTarget.id + '&num=' + e.currentTarget.dataset.num
          + '&name=' + e.currentTarget.dataset.name  + '&goodId=' + e.currentTarget.dataset.goodid,
      })
    } else {
      wx.showToast({
        title: '请选择商品规格',
        icon: 'none'
      })
      return false;
    }
   
  },
  add: function (e) {
    var that = this;
    that.setData({
      num: ++that.data.num,
    })

  },
  reduction: function (e) {
    var that = this;
    if (that.data.num == 1) {
      wx.showToast({
        title: '最少选择一件',
        icon: 'none'
      })
    } else {
      that.setData({
        num: that.data.num - 1,
      })

    }
  },
  //规格选择
  pack: function (e) {
    var that = this;
    console.log(e);
    var selectIndex = e.currentTarget.dataset.selectIndex;//当前点击下标
    var attrIndex = e.currentTarget.dataset.attrIndex;//当前点击对象下标
    var spec = this.data.spec;
    var count = spec[selectIndex].entries.length;
    for (var i = 0; i < count; i++) {
      spec[selectIndex].entries[i].isSelect = false;
    }
    spec[selectIndex].entries[attrIndex].isSelect = true;
    selectIndexArray[selectIndex] = spec[selectIndex].entries[attrIndex].value;
    selectAttrid[selectIndex] = spec[selectIndex].entries[attrIndex].id;

    this.setData({
      spec: spec,//变换选择框
      selected: selectIndexArray.join("-"),
      selectAttrid: selectAttrid.join(','),
    });
    console.log(selectIndexArray.join(","))
    console.log(that.data.selectAttrid)
    if (selectAttrid.length == that.data.detaillist.specificationItems.length) {
      for (var i in that.data.sku) {
        if (selectAttrid == that.data.sku[i].ids) {
          that.setData({
            price: that.data.sku[i].price,
            goodId: that.data.sku[i].id
          })
        }
      }
    }
  },
  details: function (e) {
    // console.log(e)
    wx.navigateTo({
      url: '../pt_scx/pt_scx?id=' + e.currentTarget.id,
    })
  },
  // 联系商家
  callkf: function (e) {
    wx.makePhoneCall({
      phoneNumber: this.data.detaillist.servicePhone
    })
  },
})