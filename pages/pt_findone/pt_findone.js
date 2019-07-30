// pages/pt_findone/pt_findone.js
const app = getApp();
var province_id = '';
var city_id = '';
var citys = [];
var areas = [];
var towns = [];
var area_id = '';
var town_id = '';
var industry_id = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    provinceId: '',
    cityId: '',
    areaId: '',
    townId: '',
    province: [],
    poindex: 0,
    city: [],
    cindex: 0,
    area: [],
    aindex: 0,
    town: [],
    tindex: 0,
    industry: [],
    duindex: 0,
    iscity: true,
    isqu: true,
    isjie: true,
    pId:'',
    cId:'',
    aId:'',
    tId:'',
    dId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    // 获取所有省
    var province = [{
      id: '',
      name: '请选择所在省'
    }]
    //获取所有行业
    var industry = [{
      id: '',
      typeName: '全部类型'
    }]
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
        // console.log(res.data.data)
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
          for (var i in res.data.data) {
            industry.push(res.data.data[i])
          }
          that.setData({
            industry: industry
          })
          console.log(that.data.industry)
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
     province_id = '';
     city_id = '';
     citys = [];
     areas = [];
     towns = [];
     area_id = '';
     town_id = '';
     industry_id = '';
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

  // 省跳市
  getprov: function (e) {
    var that = this;
    console.log(e)
    that.setData({ //给变量赋值
      poindex: e.detail.value,
      cindex: 0,
      aindex: 0,
      tindex: 0
    })
    province_id = that.data.province[e.detail.value].id;
    city_id = '';
    area_id = '';
    town_id = '';
    console.log(province_id);
    citys = [{
      id: '',
      name: '请选择所在市'
    }]
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
            iscity: false,
            pId:province_id,
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
    that.setData({ //给变量赋值
      cindex: e.detail.value,
      aindex: 0,
      tindex: 0,
      
    })
    city_id = that.data.city[e.detail.value].id;
    area_id = 0;
    town_id = 0;
    console.log(city_id);
    areas = [{
      id: '',
      name: '请选择所在区'
    }]
    that.setData({
      isqu: false
    })
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
            cId:city_id
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
    that.setData({ //给变量赋值
      aindex: e.detail.value,
      tindex: 0
    })
    area_id = that.data.area[e.detail.value].id;
    town_id = '';
    console.log(area_id);
    towns = [{
      id: '',
      name: '请选择街道（选填）'
    }]
    that.setData({
      isjie: false
    })
    // 获取街道
    wx.request({
      url: app.data.urlmall + "/apparea/nextlist.do",
      data: {
        grade: '4',
        id: area_id
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
            towns.push(res.data.data[i])
          }
          that.setData({
            town: towns,
            aId:area_id
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
  gettown: function (e) {
    var that = this;
    that.setData({ //给变量赋值
      tindex: e.detail.value,
      tId: that.data.town[e.detail.value].id
    })
    town_id = that.data.town[e.detail.value].id;
    console.log(town_id);
  },
  //所属行业
  getindustry: function (e) {
    var that = this;
    console.log(e)
    that.setData({ //给变量赋值
      duindex: e.detail.value,
      dId: that.data.industry[e.detail.value].id
    })
    industry_id = that.data.industry[e.detail.value].id;
    console.log(industry_id)
  },
  //提交验证
  getfind: function (e) {

    var that = this;
    
    wx.request({
      url: app.data.urlmall + "/appstore/allstore.do",
      data: {
        token: wx.getStorageSync('ptoken'),
        typeId: industry_id,
        provinceId: province_id,
        cityId: city_id,
        areaId: area_id,
        townId: town_id,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      success: function (res) {
        console.log(res.data.data)
        if (res.data.status == 100) {
           wx.navigateTo({
             url: '../pt_findtwo/pt_findtwo?id ',
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
  //入驻提交
  submit: function (e) {
    var that = this;
    console.log(e)
    var province_idreg = province_id;
    var city_idreg = city_id;
    var area_idreg = area_id;
    var town_idreg = town_id;
    var industry_idreg = industry_id;
   
    // if (province_idreg == '') {
    //   wx.showToast({
    //     title: '请输入所在省',
    //     icon: 'none',
    //     duration: 1500
    //   })
    //   return false;
    //  }
    //  else if (city_idreg == '') {
    //   wx.showToast({
    //     title: '请输入所在市',
    //     icon: 'none',
    //     duration: 1500
    //   })
    //   return false;
    // } 
   
    // else if (town_idreg == '') {
    //   wx.showToast({
    //     title: '请输入所在街道',
    //     icon: 'none',
    //     duration: 1500
    //   })
    //   return false;
    // }
    //  else if (industry_idreg == '') {
    //   wx.showToast({
    //     title: '请输入所属行业',
    //     icon: 'none',
    //     duration: 1500
    //   })
    //   return false;
    // }
    return wx.navigateTo({
            url: '../pt_findtwo/pt_findtwo?cityId=' + e.currentTarget.dataset.cityId + ' &provinceId=' + e.currentTarget.dataset.provinceId + ' &areaId=' + e.currentTarget.dataset.areaId + ' &townId=' + e.currentTarget.dataset.townId + ' &typeId=' + e.currentTarget.dataset.typeId + ' &dindex=' + e.currentTarget.dataset.dindex,
          })
       
  },
})