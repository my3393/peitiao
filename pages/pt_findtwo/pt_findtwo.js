// pages/pt_findtwo/pt_findtwo.js
const app = getApp();
var province_id = '';
var city_id = '';
var area_id = '';
var town_id = '';
var industry_id = '';
var detail=[];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:[],
    areaidx:'',
    townidx:'',
    province_id : '',
    city_id : '',
    area_id : '',
    town_id:'',
    type_id:'',
    show:true,
    industry: [],
    duindex: 0,
    isshow:true,
    dind:'',
    totalPage:'',
    currentPage:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options)
    that.setData({
      province_id : options.provinceId,
      city_id : options.cityId,
      area_id : options.areaId,
      dind    : options.dindex,
    })
    if(options.typeId != ' '){
     
     that.setData({
       type_id:options.typeId
     })
    }
    if(options.townId != ''){
      that.setData({
        town_id:options.townId
      })
      console.log(that.data.town_id)
    }
    
    wx.request({
      url: app.data.urlmall + "/appstore/allstore.do",
      data: {
        typeId: that.data.type_id,
        provinceId: that.data.province_id,
        cityId: that.data.city_id,
        areaId: that.data.area_id,
        townId: that.data.town_id,
        currentPage: that.data.currentPage,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      success: function (res) {
        console.log(res.data.data)
        if (res.data.status == 100) {
          for (var i in res.data.data.data) {
            detail.push(res.data.data.data[i])
          }
          that.setData({
            detail: detail,
            totalPage: res.data.data.totalPage,
            
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
    //获取所有行业
    var industry = [{
      id: '',
      typeName: '全部'
    }]
    // 获取所有区
    wx.request({
      url: app.data.urlmall + "/apparea/nextlist.do",
      data: {
        grade: '3',
        id:that.data.city_id
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      success: function (res) {
        console.log(res.data.data)
        if (res.data.status == 100) {
          that.setData({
            area: res.data.data,
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
    // 获取所有街道
    wx.request({
      url: app.data.urlmall + "/apparea/nextlist.do",
      data: {
        grade: '4',
        id: that.data.area_id
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      success: function (res) {
        console.log(res.data.data)
        if (res.data.status == 100) {
          that.setData({
            town: res.data.data,
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
    //获取所属行业
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
        console.log(res.data.data)
        if (res.data.status === 100) {
          for (var i in res.data.data) {
            industry.push(res.data.data[i])
          }
          that.setData({
            industry: industry,
            duindex:that.data.dind , 
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
    //获取所有商家
   
      //that.getstore();
   
    
    
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
     detail = [];
     this.setData({
       detail:[],
     })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    detail = [];
    this.setData({
      detail: [],
    })
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
    if (that.data.currentPage == that.data.totalPage) {
      wx.showToast({
        title: '已经到底了',
        icon: 'none'
      })
    } else {
      that.setData({
        currentPage: that.data.currentPage + 1
      })
      that.getstore();
    }
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
      title: '一手明星资源，尽在娱乐世界！',
      path: '/pages/pt_mall/pt_mall?bindcode=' + bcode + "&scode=" + scode
    }
  },
  //获取商家
  getstore:function(e){
    
    var that = this;
    wx.request({
      url: app.data.urlmall + "/appstore/allstore.do",
      data: {
        typeId: that.data.type_id,
        provinceId: that.data.province_id,
        cityId: that.data.city_id,
        areaId: that.data.area_id,
        townId: that.data.town_id,
        currentPage: that.data.currentPage
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      success: function (res) {
        console.log(res.data.data)
        if (res.data.status == 100) {
          for(var i in res.data.data.data){
            detail.push(res.data.data.data[i])
          }
          that.setData({
            detail: detail,
            totalPage: res.data.data.totalPage
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
  //获取所属行业

  // 点击街道进行筛选
  getarea: function (e) {
     var that = this;
     console.log(e.currentTarget);
     detail = []
    that.setData({
      detail:[],
      townidx: e.currentTarget.id,
      town_id: e.currentTarget.id,
    })
    console.log(that.data.detail)
    console.log(that.data.area_id)
    console.log(that.data.town_id)
    // 获取街道
    wx.request({
      url: app.data.urlmall + "/appstore/allstore.do",
      data: {
        typeId: that.data.type_id,
        provinceId: that.data.province_id,
        cityId: that.data.city_id,
        areaId: that.data.area_id,
        townId: that.data.town_id,
        currentPage:that.data.currentPage,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      success: function (res) {
        console.log(res.data.data)
        if (res.data.status == 100) {
          for (var i in res.data.data.data) {
            detail.push(res.data.data.data[i])
          }
          that.setData({
            detail: detail,
            totalPage:res.data.data.totalPage,
            show:true,
            isshow:true,
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
  //点击区改变街道信息
  selectd:function(e){
     var that = this;
     console.log(e)
     that.setData({
       areaidx: e.currentTarget.id,
       area_id: e.currentTarget.id,
     })
    console.log(that.data.area_id)
    // 获取街道
    wx.request({
      url: app.data.urlmall + "/apparea/nextlist.do",
      data: {
        grade: '4',
        id: e.currentTarget.id
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      success: function (res) {
        console.log(res.data.data)
        if (res.data.status == 100) {
          // for (var i in res.data.data) {
          //   towns.push(res.data.data[i])
          // }
          that.setData({
            town: res.data.data,
           
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
  isshow:function(){
    var that = this;
    that.setData({
      show:!that.data.show,
      
    })
  },
  //所属行业
  getindustry: function (e) {
    var that = this;
    console.log(e);
    detail=[];
    that.setData({ //给变量赋值
      duindex: e.detail.value,
      detail:[],
      totalPage:'',
      currentPage:1,
      type_id: that.data.industry[e.detail.value].id,
    })
   
    industry_id = that.data.industry[e.detail.value].id;
    console.log(that.data.typeId)
    // 获取街道
    wx.request({
      url: app.data.urlmall + "/appstore/allstore.do",
      data: {
        typeId: that.data.type_id,
        provinceId: that.data.province_id,
        cityId: that.data.city_id,
        areaId: that.data.area_id,
        townId: that.data.town_id,
        currentPage:that.data.currentPage,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      success: function (res) {
        console.log(res.data.data)
        if (res.data.status == 100) {
          for(var i in res.data.data.data){
            detail.push(res.data.data.data[i])
          }
          that.setData({
            detail: detail ,
            totalPage: res.data.data.totalPage,
            show: true
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
  // 入驻申请
  apply: function () {
    wx.navigateTo({
      url: '../pt_rz/pt_rz',
    })
  },
  detail:function(e){
    console.log(e)
    wx.navigateTo({
      url: '../pt_scx/pt_scx?id=' + e.currentTarget.id,
    })
  },
  //所有区
  wholecity:function(e){
    var that = this;
    console.log(e);
    detail = [];
    that.setData({ //给变量赋值
      area_id:'',
      town_id:'',
      detail: [],
      totalPage: '',
      currentPage: 1,  
    })
    wx.request({
      url: app.data.urlmall + "/appstore/allstore.do",
      data: {
        typeId: that.data.type_id,
        provinceId: that.data.province_id,
        cityId: that.data.city_id,
        areaId: that.data.area_id,
        townId: that.data.town_id,
        currentPage: that.data.currentPage,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      success: function (res) {
        console.log(res.data.data)
        if (res.data.status == 100) {
          for (var i in res.data.data.data) {
            detail.push(res.data.data.data[i])
          }
          that.setData({
            detail: detail,
            totalPage: res.data.data.totalPage,
            show: true
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
  }
})