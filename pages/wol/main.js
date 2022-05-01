// pages/wol/main.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        iconSize: 32,
        iconColor: app.globalData.green,
        slideButtons: [{
            type: 'warn',
            text: '删除',
        }],
        udpSocket: null,

        packets: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

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
        var that = this
        var packets = wx.getStorageSync('wolPackets')
        if (packets) {
            that.setData({
                packets: packets
            })
        }
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

    }
})