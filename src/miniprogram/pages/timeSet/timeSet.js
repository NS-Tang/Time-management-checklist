const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        Num: 0,
        allNum: 0,
        restTime: 0,
        taskTime: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    lcStatis: function() {
        wx.navigateTo({
            url: '../timeSet/statis/statis'
        })
    },
    onLoad: function(options) {
        this.setData({
            taskTime: (app.globalData.TaskTime) / 60,
            Num: app.globalData.count,
            allNum: (app.globalData.allTime) / 60
        })
        console.log(2)
    },
    sliderTask(e) {
        app.globalData.TaskTime = e.detail.value * 60
    }
})