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

    },

    /**
     * 获取单例UDPSocket连接
     */
    getUDPSocket() {
        var that = this
        if (!that.data.udpSocket) {
            var udpSocket = wx.createUDPSocket()
            try {
                udpSocket.bind()
                that.setData({
                    udpSocket: udpSocket,
                })
            } catch (e) {
                console.log('获取单例UDPSocket连接错误: ' + e)
            }
        }
        return that.data.udpSocket
    },

    /**
     * 从MAC地址生成魔术包
     */
    generateMagicPacket(rawMacAddr) {
        try {
            console.log('rawMacAddr:' + rawMacAddr)
            var mac = rawMacAddr.match(/(\w{2})/g)
            console.log('mac:' + mac)
            var magicPacket = new Uint8Array(102)
            for (var n = 0; n < 6; n++) {
                magicPacket[n] = 255
            }
            for (var i = 0; i < mac.length; i++) {
                var v = parseInt("0x" + mac[i])
                for (var x = 0; x < 16; x++) {
                    magicPacket[6 * (x + 1) + i] = v
                }
            }
            console.log('magicPacket:' + magicPacket)
            return magicPacket
        } catch (e) {
            console.log('从MAC地址生成魔术包错误: ' + e)
            wx.showModal({
                title: '生成魔术包失败',
                content: '请检查输入的MAC地址',
                showCancel: false,
                confirmColor: app.globalData.green,
            })
            return false
        }
    },

    /**
     * 发送魔术包
     */
    sendMagicPacket(ip, port, macAddr) {
        var that = this
        var udp = that.getUDPSocket()
        var magicPacket = that.generateMagicPacket(macAddr)
        if (magicPacket) {
            udp.send({
                address: ip || '255.255.255.255',
                port: parseInt(port) || 9,
                message: magicPacket
            })
            wx.showToast({
                title: '已发送',
            })
        }
    },

    /**
     * 唤醒当前条目记录
     */
    wakeCurrentItem(e) {
        var that = this
        var idx = e.currentTarget.dataset.idx
        var item = that.data.packets[idx]
        that.sendMagicPacket(item.ip, item.port, item.macAddr)
    },

    /**
     * 新建一条记录
     */
    createItem() {
        wx.navigateTo({
            url: './detail',
        })
    },

    /**
     * 点击进入某一条记录
     */
    tapItem(e) {
        var idx = e.currentTarget.dataset.idx;
        wx.navigateTo({
            url: './detail?idx=' + idx,
        })
    },

    /**
     * 滑动删除操作
     */
    slideButtonTa(e) {
        var that = this
        var packets = that.data.packets
        var idx = e.currentTarget.dataset.idx
        wx.showModal({
            title: '删除',
            content: '确定要删除这条记录吗？',
            confirmColor: app.globalData.red,
            success(res) {
                if (res.confirm) {
                    console.log('slideButtonTap - 删除条目操作: 用户点击确定')
                    var items = packets.splice(idx, 1)
                    that.setData({
                        packets: packets,
                    })
                    wx.setStorage({
                        key: "wolPackets",
                        data: that.data.packets,
                    })
                    console.log('slideButtonTap - 删除成功: idx(' + items[0] + ')')
                } else if (res.cancel) {
                    console.log('slideButtonTap - 删除条目操作: 用户点击取消')
                }
            }
        })
    }
})