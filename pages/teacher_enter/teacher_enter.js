// pages/teacher_enter/teacher_enter.js
const app = getApp();
let province =[];
let citys = [];
let areas = [];
let province_id;
let city_id;
let area_id;
let p_name;
let c_name;
let q_name;
var count = 0;
var ids = [];
var moren = [];
var names = undefined;
var type = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isardess:true,
    iscity:true,
    isprov:false,
    address:'',
    showlabels:true,
    artist_type:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   var that = this;
   that.getprov();
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
  chooselabel: function (e) {
    console.log(e)
    var that = this;
    type = that.data.type;
    if (count == 3) {
      wx.showToast({
        title: '最多选择三项',
        icon: 'none'
      })
      return false;
    } else {
      names = undefined;
      ids = [];
      type[e.currentTarget.dataset.index].selected = !type[e.currentTarget.dataset.index].selected;
      that.setData({
        type: type
      })
      count = 0;
      for (var i in type) {
        if (type[i].selected == false) {
          count = count + 1;
          ids.push(type[i].id);
          if (names == undefined) {
            names = type[i].name;
          } else {
            names = names + "-" + type[i].name;
          }
        }
      }
    }
    console.log(ids)
  },
  quxiao: function (e) {
    var that = this;
    count = 0
    ids = [];
    that.setData({
      showlabels: !that.data.showlabels,
      type: moren
    })
    console.log(moren)
  },
  sure: function (e) {
    var that = this;
    console.log(names)
    that.setData({
      showlabels: !that.data.showlabels,
      artist_type: names
    })
  },
  //选择地址
  diz:function(){
    this.setData({
      isardess:false,
      isprov:false,
      isqu:true,
      iscity:true
    })
  },
  type(){
    var that = this;
    that.gettype();
    that.setData({
      showlabels: !that.data.showlabels
    })
  },
  gettype(){
    var that = this;
    wx.request({
      url: app.data.urlmall + "/appteacher/getteachertype.do",
      data: {
        token:wx.getStorageSync('ptoken')
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      success: function (res) {
        console.log(res.data.data)
        if (res.data.status == 100) {
          for (var i in res.data.data) {
            res.data.data[i].selected = true;
          }
          that.setData({
            type:res.data.data
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 500
          })
        }

      }
    })
  },
  //省
  getprov:function(){
    var that = this;
    wx.request({
      url: app.data.urlmall + "/apparea/nextlist.do",
      data: {
        grade: "1",
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      success: function (res) {
        console.log(res.data.data)
        if (res.data.status === 100) {
          for (var i in res.data.data) {
            province.push(res.data.data[i])
          }
          that.setData({
            province: province
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
  // 省跳市
  getprovs: function (e) {
    var that = this;
    console.log(e)
    citys = [];
    province_id = e.currentTarget.id;
    p_name = e.currentTarget.dataset.name
   
    // 获取所有市
    wx.request({
      url: app.data.urlmall + "/apparea/nextlist.do",
      data: {
        grade: '2',
        id: province_id
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      success: function (res) {
        console.log(res.data.data)
        if (res.data.status == 100) {
          for (var i in res.data.data) {
            citys.push(res.data.data[i])
          }
          that.setData({
            city: citys,
            isprov:true,
            iscity: false
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 500
          })
        }

      }
    })
  },
  // 市跳区
  getcity: function (e) {
    var that = this;
    areas = []
    city_id = e.currentTarget.id;;
    c_name = e.currentTarget.dataset.name
   
    // 获取所有区
    wx.request({
      url: app.data.urlmall + "/apparea/nextlist.do",
      data: {
        grade: '3',
        id: city_id
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      success: function (res) {
        console.log(res.data.data)
        if (res.data.status == 100) {
          for (var i in res.data.data) {
            areas.push(res.data.data[i])
          }
          that.setData({
            area: areas,
            iscity:true,
            isqu:false,

          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 500
          })
        }

      }
    })
  },
  // 区跳街道
  getarea: function (e) {
    var that = this;
    q_name = e.currentTarget.dataset.name
    that.setData({ //给变量赋值
      address:p_name + '-' + c_name + '-' + q_name,
      isardess:true,
    })
    
  },
})