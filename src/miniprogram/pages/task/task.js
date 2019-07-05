// pages/task/task.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tasks: [{
                name: "工作",
                url: "../../images/icon/gongzuobao.png",
                music: "https://7869-xiao622-8a4de3-1258684935.tcb.qcloud.la/music/Evan Call - Across the Violet Sky.mp3?sign=52c68f43e73603a589fb6dc2b45a868e&t=1551084994"
            },
            {
                name: "学习",
                url: "../../images/icon/xuexi.png",
                music: "https://7869-xiao622-8a4de3-1258684935.tcb.qcloud.la/music/Evan Call - Never Coming Back.mp3?sign=bddefe4736a36484a995433b7bb624ca&t=1551085028"
            },
            {
                name: "思考",
                url: "../../images/icon/sikao.png",
                music: "https://7869-xiao622-8a4de3-1258684935.tcb.qcloud.la/music/FELT - You're the Shine (Night Butterflies).mp3?sign=a5c98c35bf2ba31198eecd7429a9140d&t=1551085041"
            },
            {
                name: "写作",
                url: "../../images/icon/tubiaozhizuomoban-.png",
                music: "https://7869-xiao622-8a4de3-1258684935.tcb.qcloud.la/music/Icon For Hire - Hope of Morning.mp3?sign=657305d889965cac7b75ab436c0fcda6&t=1551085054"
            },
            {
                name: "运动",
                url: "../../images/icon/ziyuan.png",
                music: "https://7869-xiao622-8a4de3-1258684935.tcb.qcloud.la/music/Various Artists - Feast of Spring.mp3?sign=29d6cc84186b1249d93a1bb1fd83f3e3&t=1551085068"
            },
            {
                name: "阅读",
                url: "../../images/icon/yuedu.png",
                music: "https://7869-xiao622-8a4de3-1258684935.tcb.qcloud.la/music/コミネリサ - Resuscitated Hope.mp3?sign=0be36a63c033d0e6f1b6696dcf2c5ff3&t=1551085080"
            }
        ],
        TabIndex: 0,
        taskName: "工作",
    },
    Tab(e) {
        this.setData({
            TabIndex: e.currentTarget.dataset.index,
            //  taskName:e._relatedInfo.anchorRelatedText
        })
        let middle = this.data.TabIndex;
        app.globalData.category = middle;
        // console.log('A'+category);
    },
        
    start() {
        app.globalData.taskMusic = this.data.tasks[this.data.TabIndex].music
        wx.reLaunch({
            url: "../tomato/tomato"
        })

    },
})