// pages/wol/detail.js
var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        idx: null,
        mode: 1,  // 模式: 1新建，2修改
        packets: [],
        formData: {},
        rules: [{
          name: 'macAddr',
          rules: { required: true, message: 'MAC地址是必填项' },
        }]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        var that = this
        var packets = wx.getStorageSync('wolPackets')
        if (packets) {
          that.setData({
            packets: packets
          })
        }
    
        var idxFromUrl = options.idx
        if (typeof(idxFromUrl) != "undefined") {
          var idx = parseInt(idxFromUrl)
          // console.log('packets:' + packets + ' type:' + typeof (packets))
          var item = packets[idx]
          if (typeof(item) != "undefined") {
            console.log('onLoad - 从url参数中获取索引idx(' + idx + ')数据，进入修改模式',item)
            that.setData({
              mode: 2,
              idx: idx,
              formData: item,
            })
          } else {
            console.log('onLoad - 获取索引idx(' + idx + ')数据为空，进入新建模式')
            that.setData({
              mode: 1,
              idx: null,
              formData: {},
            })
          }
        } else {
          console.log('onLoad - 进入新建模式')
          that.setData({
            mode: 1,
            idx: null,
            formData: {},
          })
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    },

    /**
     * 表单数据改动
     */
    formInputChange(e) {
      const { field } = e.currentTarget.dataset
      this.setData({
        [`formData.${field}`]: e.detail.value
      })
      console.log(this.data.formData)
    },
  
    /**
     * 保存
     */
    clickSave() {
      var that = this
      var packets = that.data.packets
      var formData = that.data.formData
      var mode = that.data.mode
      that.selectComponent('#form').validate((valid, errors) => {
        console.log('clickSave - 验证结果', valid, errors)
        if (!valid) {
          const firstError = Object.keys(errors)
          if (firstError.length) {
            that.setData({
              error: errors[firstError[0]].message
            })
          }
        } else {
          console.log('clickSave - 验证通过: mode:' + mode)
          if (mode === 1) {
            var packetsLen = packets.push(formData)
            that.setData({
              mode: 2,
              idx: packetsLen-1,
              packets: packets,
            })
            wx.setStorage({
              key: "wolPackets",
              data: that.data.packets,
            })
            console.log('clickSave - 创建完成: idx(' + that.data.idx + ')')
            wx.showToast({
              title: '创建完成'
            })
            wx.navigateBack({})
          } else {
            var idx = that.data.idx
            packets[idx] = formData
            that.setData({
              mode: 2,
              packets: packets,
            })
            wx.setStorage({
              key: "wolPackets",
              data: that.data.packets,
            })
            console.log('clickSave - 修改成功: idx(' + that.data.idx + ')')
            // wx.showToast({
            //   title: '修改成功'
            // })
            wx.navigateBack({})
          }
        }
      })
    },
  
    /**
     * 点击删除
     */
    clickDelete() {
      var that = this
      var packets = that.data.packets
      var formData = that.data.formData
      var idx = that.data.idx
      var mode = that.data.mode
      if (mode === 2) {
        wx.showModal({
          title: '删除',
          content: '确定要删除这条记录吗？',
          confirmColor: app.globalData.red,
          success(res) {
            if (res.confirm) {
              console.log('clickDelete - 删除条目操作: 用户点击确定')
              var items = packets.splice(idx, 1)
              that.setData({
                mode: 1,
                idx: null,
                packets: packets,
              })
              wx.setStorage({
                key: "wolPackets",
                data: that.data.packets,
              })
              console.log('clickDelete - 删除成功: idx(' + items[0] + ')')
              wx.navigateBack({})
            } else if (res.cancel) {
              console.log('clickDelete - 删除条目操作: 用户点击取消')
            }
          }
        })
      } else if (mode === 1) {
        wx.showModal({
          title: '当前模式不可删除',
          content: '请在修改模式下进行操作',
          showCancel: false,
          confirmText: '我知道了'
        })
      }
    }  
})