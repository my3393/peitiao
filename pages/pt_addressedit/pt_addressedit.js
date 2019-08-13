// pages/pt_dz/pt_dz.js
const app = getApp();
var bcode;
var detail_id;
var token;
var cid;
var province_id = '';
var city_id = '';
var citys = [];
var areas = [];
var towns = [];
var area_id = '';
var town_id = '';
var check_id
Page({

  /**
   * 页面的初始数据
   */
  data: {
    check:[],
    addres: [],
    prov: [],
    citys: [],
    names: '',
    phones: '',
    provinces: '',
    addresss: '',
    provinceId: '',
    cityId: '',
    areaId: '',
    townId: '',
    address: '',
    province: [],
    poindex: 0,
    city: [],
    cindex: 0,
    area: [],
    aindex: 0,
    town: [],
    tindex: 0,
    isDefault: 0,
    checked: false,
    isDefaults: false,
    // iscity: false,
    // isqu: false,
    // isjie: false,
    checkn:'',
    checkp:'',
    checkx:'',
    provinceName:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
     console.log(options)
     check_id = options.id
     that.getcheck();


    // 获取所有省
    var province = [{
      id: '',
      name: '请选择所在省'
    }]

    wx.request({
      url: app.data.urlmall + "/apparea/nextlist.do",
      data: {
        grade: "1",
        id: that.data.provinceId
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
            province: province,
          })
          that.data.province.filter(function (item, index){
            if (that.data.provinceId == item.id){
              that.setData({
                  poindex : index  
                })
                console.log(that.data.poindex)
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
    // 市
    setTimeout(function(){
      wx.request({
        url: app.data.urlmall + "/apparea/nextlist.do",
        data: {
          grade: "2",
          id: that.data.provinceId
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        dataType: 'json',
        success: function (res) {
          console.log(res.data.data)
          if (res.data.status === 100) {
            res.data.data.filter(function (item, index) {
              for (var i in res.data.data) {
                citys.push(res.data.data[i])
              }

              that.setData({
                city: citys,
              })
              if (that.data.cityId == item.id) {
                that.setData({
                  cindex: index
                })
                console.log(that.data.cindex)
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
    },100)
    //区
    setTimeout(function () {
      wx.request({
        url: app.data.urlmall + "/apparea/nextlist.do",
        data: {
          grade: "3",
          id: that.data.cityId
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        dataType: 'json',
        success: function (res) {
          console.log(res.data.data)
          if (res.data.status === 100) {
            res.data.data.filter(function (item, index) {
              for (var i in res.data.data) {
                areas.push(res.data.data[i])
              }

              that.setData({
                area: areas,
              })
              if (that.data.areaId == item.id) {
                that.setData({
                  aindex: index
                })
                console.log(that.data.aindex)
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
    }, 200)
    //街道
    setTimeout(function () {
      wx.request({
        url: app.data.urlmall + "/apparea/nextlist.do",
        data: {
          grade: "4",
          id: that.data.areaId
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        dataType: 'json',
        success: function (res) {
          console.log(res.data.data)
          if (res.data.status === 100) {
            res.data.data.filter(function (item, index) {
              for (var i in res.data.data) {
                towns.push(res.data.data[i])
              }

              that.setData({
                town: towns,
              })
              if (that.data.townId == item.id) {
                that.setData({
                  tindex: index
                })
                console.log(that.data.tindex)
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
    }, 300)
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
        //console.log(bcode + "----")
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
    clearTimeout()
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
  getcheck:function(e){
    var that = this;
   // var id = e.currentTarget.id
    wx.request({
      url: app.data.urlmall + "/appuseraddress/goedit.do",
      data: {
         id:check_id,
         token: wx.getStorageSync("ptoken"),
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      success: function (res) {
        console.log(res.data.data)
        province_id = res.data.data.provinceId;
        city_id = res.data.data.cityId;
        area_id = res.data.data.areaId;
        town_id = res.data.data.townId;
        if (res.data.status === 100) {
            that.setData({
              names: res.data.data.name,
              phones: res.data.data.phone,
              addresss: res.data.data.address,
              provinceId: res.data.data.provinceId,
              cityId: res.data.data.cityId,
              areaId: res.data.data.areaId,
              townId: res.data.data.townId,
              isDefault: res.data.data.isDefault,
              
            })

            if(res.data.data.isDefault == 1){
              that.setData({
                checked: true,               
              })
            }else{
              that.setData({
                checked: false,
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
  //提交修改
  getaddress: function () {
    var that = this;
    wx.request({
      url: app.data.urlmall + "/appuseraddress/edit.do",
      data: {
        name: that.data.names,
        phone: that.data.phones,
        provinceId: province_id,
        cityId: city_id,
        areaId: area_id,
        townId: town_id,
        id:check_id,
        address: that.data.addresss,
        token: wx.getStorageSync("ptoken"),
        isDefault: that.data.isDefault,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      success: function (res) {
        console.log(res.data.data)
        if (res.data.status === 100) {
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 800
          })
          setTimeout(function () {
            wx.redirectTo({
              url: '../pt_sh/pt_sh',
            })
          }, 1500)

        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },

  bindname: function (e) {
   
    this.setData({
      names: e.detail.value
    })
  },
  bindphone: function (e) {

    this.setData({
      phones: e.detail.value

    })
  },
  bindregion: function (e) {

    this.setData({
      provinces: e.detail.value
    })
  },
  binddetail: function (e) {
    this.setData({
      addresss: e.detail.value
    })
  },
  submit: function (e) {
    
    var that = this;
    console.log(that.data.poindex == '')
    var phonereg = that.data.phones;
    var namereg = that.data.names;
    var province_idreg = province_id;
    var city_idreg = city_id;
    var area_idreg = area_id;
    var town_idreg = town_id;
    var addressreg = that.data.addresss
    var phonetel = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (namereg == '' ) {
      wx.showToast({
        title: '请输入用户名',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return false
    } else if (phonereg == '') {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      })
      return false
    } else if (phonereg.length != 11 ) {
      wx.showToast({
        title: '手机号长度有误！',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if (that.data.poindex == '' || that.data.provinceId == ''){
      wx.showToast({
        title: '请输入所在省',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if ( that.data.cindex == '') {
      wx.showToast({
        title: '请输入所在市',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if (that.data.aindex == '') {
      wx.showToast({
        title: '请输入所在区',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if ( that.data.tindex == '') {
      wx.showToast({
        title: '请输入所在街道',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if (addressreg == '') {
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    if (!phonetel.test(phonereg)) {
      wx.showToast({
        title: '手机号有误！',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    return that.getaddress();
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
    that.setData({ //给变量赋值
      cindex: e.detail.value,
      aindex: 0,
      tindex: 0
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
            area: areas
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
      name: '请选择所在街道'
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
            town: towns
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
    })
    town_id = that.data.town[e.detail.value].id;
    console.log(town_id);
  },
  //设置默认地址
  checkedTap: function (e) {
    var that = this;
    var checked = that.data.checked;
    var isDefaults = that.data.isDefaults
    console.log(isDefaults)
    that.setData({
      checked: !checked,
      isDefaults: !isDefaults
    })
    if (!isDefaults) {
      that.setData({
        isDefault: 1
      })
      console.log(that.data.isDefault)
    } else {
      that.setData({
        isDefault: 0
      })
      console.log(that.data.isDefault)
    }
  }
})