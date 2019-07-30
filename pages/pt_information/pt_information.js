// pages/pt_information/pt_information.js
const app = getApp();
var bcode;
var detail_id;
var token;
var poster;
var postersis;
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
    posters: '../../images/chuan_03.png',
    postersies: '../../images/chuan_03.png',
    info:'',
    contact:'',
    numb:'',
    scope:'',
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
    industry:[],
    duindex:0,
    isDefault: 0,
    isDefaults: false,
    checked: false,
    iscity: true,
    isqu: true,
    isjie: true,
    sign:[],
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
      typeName: '所属行业'
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
            province:province
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
    wx.getStorage({
      key: 'ptoken',
      success: function (res) {
        token = res.data;
      },
    })
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
  //企业LOGO
  chooseImage(e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        console.log(res.tempFilePaths[0]);
        var tempFilePaths = res.tempFilePaths;
        wx.showLoading();
        wx.uploadFile({
          url: app.data.urlmall + '/appfile/xcxfileprogerssupload.do', // 仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            "Content-Type": "multipart/form-data",
            'accept': 'application/json',
          },
          formData: {
            
            'token': wx.getStorageSync("ptoken")
          },
          dataType: 'json',
          success(res) {

            console.log(token)
            let datas = JSON.parse(res.data)
            console.log(datas.data.fileName)
            poster = datas.data.fileName;
            console.log(poster)
            wx.hideLoading();
            // do something
          }
        })
        that.setData({
          posters: res.tempFilePaths[0]
        })
      }
    })
  },
  //营业执照
  chooseImages(e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        console.log(res.tempFilePaths[0]);
        var tempFilePaths = res.tempFilePaths;
        wx.showLoading();
        wx.uploadFile({
          url: app.data.urlmall + '/appfile/xcxfileprogerssupload.do', // 仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            "Content-Type": "multipart/form-data",
            'accept': 'application/json',
          },
          formData: {
            'token': wx.getStorageSync("ptoken")
          },
          dataType: 'json',
          success(res) {
            console.log(token)
            let datas = JSON.parse(res.data)
            console.log(datas)
            postersis = datas.data.fileName;
            console.log(poster)
            wx.hideLoading();
            // do something
          }
        })
        that.setData({
          postersies: res.tempFilePaths[0]
        })
      }
    })
  },
  //企业信息
  infor:function(e){
    
    var info = e.detail.value
    this.setData({
      info:info
    })
  },
  //经营范围
  scope:function(e){
    var scope = e.detail.value
    this.setData({
      scope: scope
    })
    if(scope.length >= '30'){
      wx.showToast({
        title: '请保持30字以内',
      })
    }
  },
  //详细地址
  adress:function(e){
    var adress = e.detail.value
    this.setData({
      adress:adress
    })
  },
  //联系人
  contact: function (e) {
    var contact = e.detail.value
    this.setData({
      contact: contact
    })
  },
  //号码
  num: function (e) {
   var numb = e.detail.value
    this.setData({
      numb: numb
    })
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
   
    
    that.setData({
      checked: !checked,
      
    })
    
  },
  //所属行业
  getindustry:function(e){
    var that = this;
    console.log(e)
    that.setData({ //给变量赋值
      duindex: e.detail.value,
     
    })
    industry_id = that.data.industry[e.detail.value].id;
    console.log(industry_id)
  },
  //支付
  pay: function (e) {
    var that = this;
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
    // wx.redirectTo({
    //   url: '../pt_success/pt_success',
    // })
  },
  //提交验证
  getxcx:function(e){
    var that = this;
    wx.request({
      url: app.data.urlmall + "/appapply/enter/xcxpay.do",
      data: {
        token:wx.getStorageSync('ptoken'),
        enterpriseName:that.data.info,
        enterpriseLogo:  poster,
        businessLicense: postersis,
        typeId:industry_id,
        provinceId:province_id,
        cityId:city_id,
        areaId:area_id,
        townId:town_id,
        address:that.data.adress,
        businessScope: that.data.scope,
        phone: that.data.numb,
        contactUser: that.data.contact,       
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      success: function (res) {
        console.log(res.data.data)
        if (res.data.status == 100) {
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
                url: '../pt_service/pt_service',
              })
            },
            fail(res) { }
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
  //输入验证
  valid:function(e){
    
  },
  //查看协议
  chak:function(e){
    wx.navigateTo({
      url: '../pt_agree/pt_agree',
    })
  },
  //入驻提交
  submit: function (e) {
    var that = this;
    var phonereg = that.data.numb;
    var namereg = that.data.info;
    var contactreg = that.data.contact;
    var province_idreg = province_id;
    var city_idreg = city_id;
    var area_idreg = area_id;
    var town_idreg = town_id;
    var addressreg = that.data.adress
    var phonetel = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (namereg == '') {
      wx.showToast({
        title: '请输入企业信息',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return false
    } else if (that.data.posters == '../../images/upimg.png') {
      wx.showToast({
        title: '请上传企业LOGO',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if (that.data.postersies == '../../images/upimg.png') {
      wx.showToast({
        title: '请上传营业执照',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if (industry_id == '') {
      wx.showToast({
        title: '请选择所属行业',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if (province_idreg == '') {
      wx.showToast({
        title: '请输入所在省',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if (city_idreg == '') {
      wx.showToast({
        title: '请输入所在市',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if (area_idreg == '') {
      wx.showToast({
        title: '请输入所在区',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if (town_idreg == '') {
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
    } else if (contactreg == '') {
      wx.showToast({
        title: '请填写联系人',
        icon: 'none'
      })
      return false
    } else if (phonereg == '') {
      wx.showToast({
        title: '请填写手机号',
        icon: 'none'
      })
      return false
    } else if (phonereg == '') {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      })
      return false
    } else if (phonereg.length != 11) {
      wx.showToast({
        title: '手机号长度有误！',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if (!that.data.checked) {
      wx.showToast({
        title: '请同意申请协议',
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
    return that.getxcx();
  },
})