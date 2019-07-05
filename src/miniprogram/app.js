//app.js
import {
    log,
    promiseHandle
} from 'utils/util';
App({
    onLaunch: function() {

        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)
        // 登录
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
            }
        })
        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            this.globalData.userInfo = res.userInfo

                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                        }
                    })
                }
            }
        })

        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力')
        } else {
            wx.cloud.init({
                traceUser: true,
            })
        }

        this.globalData = {}
    },

    getUserInfo(cb) {
        if (typeof cb !== "function") return;
        let that = this;
        if (that.globalData.userInfo) {
            cb(that.globalData.userInfo);
        } else {
            promiseHandle(wx.login).then(() => promiseHandle(wx.getUserInfo)).then(res => {
                that.globalData.userInfo = res.userInfo;
                cb(that.globalData.userInfo);
            }).catch(err => {
                log(err);
            });
        }
    },
    globalData: {
        // itemList:[],
        openid: null,
        id: null,
        needRefresh: false,
        userInfo: null,
        count: 0,
        category: 0,
        workNum: 0,
        studyNum: 0,
        thinkNum: 0,
        writeNum: 0,
        sportNum: 0,
        readNum: 0,
        taskMusic: "https://7869-xiao622-8a4de3-1258684935.tcb.qcloud.la/music/Evan Call - Across the Violet Sky.mp3?sign=52c68f43e73603a589fb6dc2b45a868e&t=1551084994",
        TaskTime: 1500,
        allTime: 0,
    },

    //自定义配置
    settings: {
        debug: true, //是否调试模式
    },
    //app.js

    systemInfo: null,
    onLaunch: function () {
        wx.BaaS = requirePlugin('sdkPlugin')
        //让插件帮助完成登录、支付等功能
        wx.BaaS.wxExtend(wx.login,
            wx.getUserInfo,
            wx.requestPayment)

        wx.BaaS.init('a9e077e1c83371aab43b')
    },

    /* onLaunch(options) {
        const self = this;
        wx.BaaS = requirePlugin("sdkPlugin");
        //让插件帮助完成登录、支付等功能
        wx.BaaS.wxExtend(wx.login, wx.getUserInfo, wx.requestPayment);
        //初始化知晓云
        let clientID = "39eeb561660966d7d120";
        wx.BaaS.init(clientID);

        //同步获取id
        try {
            let localId = wx.getStorageSync("id");
            self.globalData.id = localId;
        } catch (e) {
            console.log(e);
        }

        if (!self.globalData.id) {
            wx.BaaS.login(false).then(
                res => {
                    console.log("login success");
                    console.log(res);
                    //保存id
                    wx.setStorage({
                        key: "id",
                        data: res.id
                    });
                },
                err => {
                    console.log("login fail");
                    console.log(err);
                }
            );
        }

        wx.getSystemInfo({
            success(res) {
                self.systemInfo = res;
            }
        });
        // 登录
        // wx.login({
        //   success: res => {
        //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
        //     console.log(res);
        //   }
        // });
    }, */
    onShow(options) {
        console.log("onShow");
    },
    onHide() {
        console.log("onHide");
    },
    onError(error) {
        console.log("onError");
    },
    onPageNotFound(options) {
        console.log("onPageNotFound");
    },



})