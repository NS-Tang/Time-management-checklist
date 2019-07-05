const app = getApp();

Page({
    data: {
        itemList: [{
                id: "timeSet",
                name: "设置番茄时长",
                page: "../timeSet/timeSet"
            },
            {
                id: "deleteDatabase",
                name: "清空数据库",
                page: "../deleteDatabase/deleteDatabase"
            },
            {
                id: "feedback",
                name: "意见反馈",
                page: "../feedback/feedback"
            },
            {
                id: "about",
                name: "关于",
                page: "../about/about"
            }

        ]
    },
    userInfoHandler(data) {
        wx.BaaS.handleUserInfo(data).then(
            res => {
                console.log(res);
            },
            res => {
                console.log(res);
            }
        );
    }
});