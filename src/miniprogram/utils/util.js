import Promise from './es6-promise.min';


/**
 * function formatTime
 * 获取实时的时间，包括年、月、日、小时、分钟、秒
 *由于月份是从0开始，所以月份数字+1
 */
function formatTime(date) {
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()

    let hour = date.getHours()
    let minute = date.getMinutes()
    let second = date.getSeconds()

    /**
     * 将定义后date结果return为格式 ：
     * 年/月/日 小时：分钟：秒
     * 的形式
     */
    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}


/**
 * function formatNumber 
 * 用于把字符串n转化为数字
 */
function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}


/**
 * 获取date字符串
 * 提取信息return为
 * yyyy年mm月dd日
 */
function getDateStr(date) {
    if (!date) return '';
    return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日';
}

/**
 * 生成GUID序列号
 * @returns {string} GUID
 * GUID是给某一个实体创建的唯一标识码
 */
function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


/**
 * 记录日志
 * @param {Mixed} 记录的信息
 * @returns {Void}
 */
function log(msg) {
    if (!msg) return;
    if (getApp().settings['debug'])
        console.log(msg);
    let logs = wx.getStorageSync('logs') || [];
    logs.unshift(msg)
    wx.setStorageSync('logs', logs)
}

/**
 * @param {Function} func 接口
 * @param {Object} options 接口参数
 * @returns {Promise} Promise对象
 */
function promiseHandle(func, options) {
    options = options || {};
    return new Promise((resolve, reject) => {
        if (typeof func !== 'function')
            reject();
        options.success = resolve;
        options.fail = reject;
        func(options);
    });
}




/**
 * 模块接口，声明此模块对外暴露的内容
 * 分别都是之前定义的函数
 */
module.exports = {
    formatTime: formatTime,
    guid: guid,
    log: log,
    promiseHandle: promiseHandle,
    getDateStr: getDateStr,
    formatNumber: formatNumber
}