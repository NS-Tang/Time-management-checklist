import DataService from '../../datas/DataService';
// import { LEVEL } from '../../datas/Config';
import {
    promiseHandle,
    log,
    formatNumber
} from '../../utils/util';

Page({
    /**事项各项数据.
     * data作用域Page
     */
    data: {
        showMonth: {},
        data: {
            showMonth: ''
        },
        selectDateText: '', //当日date信息
        pickerDateValue: '', //日期选择器value的值
        isSelectMode: false, //是否选择模式
        isMaskShow: false,
        isEditMode: false, //是否编辑模式

        // modal
        isModalShow: false,
        modalMsg: '',

        // //事项等级数据
        // levelSelectedValue: LEVEL.normal,
        // levelSelectData: [LEVEL.normal, LEVEL.warning, LEVEL.danger],

        // updatePanel 数据
        updatePanelTop: 10000,
        updatePanelAnimationData: {},
        todoInputValue: '',
        todoTextAreaValue: '',

        // 事项列表
        itemList: [],
        editItemList: [] //编辑勾选中的事项id
    },

    onLoad() {
        let _this = this;

        promiseHandle(wx.getSystemInfo).then((data) => {
            _this.setData({
                updatePanelTop: data.windowHeight
            });
        });

        changeDate.call(this);
    },

    onReady() {
        loadItemListData.call(this);
    },
    /**日期选择器 value 改变时触发 change 事件 */
    datePickerChangeEvent(e) {
        const date = new Date(Date.parse(e.detail.value));
        changeDate.call(this, new Date(date.getFullYear(), date.getMonth(), 1));
    },
    /**改变日期 */
    changeDateEvent(e) {
        const {
            year,
            month
        } = e.currentTarget.dataset;
        changeDate.call(this, new Date(year, parseInt(month) - 1, 1));
    },

    /**点击事务 */
    dateClickEvent(e) {
        const {
            year,
            month,
            date
        } = e.currentTarget.dataset;
        const {
            data
        } = this.data;
        let selectDateText = '';

        // 字符串作为数组下标，是一种对象访问方式.
        data['selected']['year'] = year;
        data['selected']['month'] = month;
        data['selected']['date'] = date;

        this.setData({
            data: data
        });

        changeDate.call(this, new Date(year, parseInt(month) - 1, date));
    },

    showUpdatePanelEvent() {
        showUpdatePanel.call(this);
        this.setData({
            isEditMode: true
        }); //进入编辑模式
    },

    closeUpdatePanelEvent() {
        closeUpdatePanel.call(this);
    },

    /**编辑事件 */
    editClickEvent() {
        this.setData({
            isEditMode: true
        }); //进入编辑模式
    },

    /** 事项列表项长按动作事件
     * 其实被点击动作调用了……
     */
    listItemLongTapEvent(e) {
        const {
            isEditMode
        } = this.data;
        const {
            id
        } = e.currentTarget.dataset;
        let _this = this;
        //如果不是编辑勾选模式下才生效
        if (!isEditMode) {
            const itemList = ['详情', '删除'];
            //promiseHandle来自util.js
            promiseHandle(wx.showActionSheet, {
                    itemList: itemList,
                    itemColor: '#2E2E3B'
                })
                .then((res) => {
                    if (!res.cancel) {
                        switch (itemList[res.tapIndex]) {
                            case '详情':
                                wx.navigateTo({
                                    url: '../detail/detail?id=' + id
                                });
                                break;
                            case '删除':
                                new DataService({
                                    _id: id
                                }).delete().then(() => {
                                    loadItemListData.call(_this);
                                });
                                break;
                        }
                    }
                });
        }
    },

    /**取消编辑事件
     * 点击「取消」键
     */
    cancelEditClickEvent() {
        this.setData({
            isEditMode: false
        });
        resetItemListDataCheck.call(this);
    },

    /** 事项标题文本框变化事件*/
    todoInputChangeEvent(e) {
        const {
            value
        } = e.detail;
        this.setData({
            todoInputValue: value
        });
    },

    /**事项内容多行文本域变化事件*/
    todoTextAreaChangeEvent(e) {
        const {
            value
        } = e.detail;
        this.setData({
            todoTextAreaValue: value
        });
    },

    /*   // 选择事项等级事件  
      levelClickEvent(e) {
        const { level } = e.currentTarget.dataset;
        this.setData({ levelSelectedValue: level });
      },
     */

    /**保存事项数据.*/
    saveDataEvent() {
        const {
            /**事项具体时间.*/
            todoInputValue,
            /**事项内容.*/
            todoTextAreaValue
        } = this.data; //data作用域Page
        const {
            year,
            month,
            date
        } = this.data.data.selected; //selected选中的年月日
        console.log(todoTextAreaValue); //控制台写日志
        if (todoInputValue !== '') {
            let promise = new DataService({ //数据传给一个中间类
                title: todoInputValue,
                content: todoTextAreaValue,
                // level: levelSelectedValue,
                year: year,
                month: parseInt(month) - 1,
                date: date
            }).save();
            promise && promise.then(() => {
                //清空表单
                this.setData({ //微信小程序API 详见 https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html#Page.prototype.setData(Object%20data,%20Function%20callback)
                    todoTextAreaValue: '',
                    todoInputValue: ''
                });
                loadItemListData.call(this);
            })

            closeUpdatePanel.call(this);
        } else {
            showModal.call(this, '请填写事项内容');
        }
    },

    /**批量删除事件
     * 这里批量删除指的是选中后批量删除选中项目
     */
    removeRangeTapEvent() {
        let {
            itemList
        } = this.data;
        if (!itemList) return;
        let _this = this;
        wx.showModal({
            title: '提示',
            content: '确定要删除选定的事项？',
            success: (res) => {
                if (res.confirm) {
                    DataService.deleteRange(_this.data.editItemList).then(() => {
                        loadItemListData.call(_this);
                    });
                    _this.setData({ //setData见 https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html#Page.prototype.setData(Object%20data,%20Function%20callback)
                        editItemList: [],
                        isEditMode: false
                    });
                }
            }
        });
    },

    /** 事项列表项的点击事件*/
    listItemClickEvent(e) {
        const {
            isEditMode
        } = this.data;
        const {
            id
        } = e.currentTarget.dataset;

        if (!isEditMode) {
            this.listItemLongTapEvent(e); //由于元素的长按和点击事件有冲突，暂时合并在一起，直接调用长按事件（本文件）
            return;
        }
        let data = this.data.itemList || []; //data作用域listItemClickEvent(e)
        //若itemList有值则不变，无值则取[]
        let editItemList = this.data.editItemList || []; //若editItemList有值则不变，无值则取[]
        //findIndex:JavaScript API
        //查找目标元素，找到就返回元素的位置，找不到就返回-1
        const index = data.findIndex((item) => {
            return item['_id'] == id;
        });

        if (index >= 0) {
            data[index]['checked'] = !data[index]['checked'];
            const tIndx = editItemList.findIndex((item) => {
                return item == id;
            });
            if (data[index]['checked']) {
                tIndx >= 0 || editItemList.push(id);
            } else {
                editItemList.splice(tIndx, 1);
            }
            this.setData({
                itemList: data,
                editItemList: editItemList
            });
        }
    },

    //提示模态窗口关闭事件
    closeModalEvent() {
        closeModal.call(this);
    }
});






/**
 * 显示事项数据添加更新面板
 * 主要靠translateY来控制垂直方向的移动动画，刚进入页面的时候获取屏幕的高度，把面板的高度设置与屏幕高度一致，上滑的时候100%就刚好覆盖整个屏幕
 */
function showUpdatePanel() {
    //wx.createAnimation(object) 创建一个动画实例animation。调用实例的方法来描述动画。最后通过动画实例的export方法导出动画数据传递给组件的animation属性。
    //调用动画操作方法后要调用 step() 来表示一组动画完成，可以在一组动画中调用任意多个动画方法，一组动画中的所有动画会同时开始，一组动画完成后才会进行下一组动画。step 可以传入一个跟 wx.createAnimation() 一样的配置参数用于指定当前组动画的属性
    let animation = wx.createAnimation({
        duration: 600 //动画持续时间 ms默认值是400
    });
    //Animation.translateY(number translation) translation在 Y 轴平移的距离，单位为 px   对 Y 轴平移 translation为正时向Y轴正方向移动
    //step()函数表示一组动画已经完成
    animation.translateY('-100%').step();
    this.setData({
        updatePanelAnimationData: animation.export()
    });
}

/**
 * 显示模态窗口
 * @param {String} msg 显示消息
 */
function showModal(msg) {
    this.setData({
        isModalShow: true,
        isMaskShow: true,
        modalMsg: msg
    });
}

/**
 * 关闭模态窗口
 */
function closeModal() {
    this.setData({
        isModalShow: false,
        isMaskShow: false,
        modalMsg: ''
    });
}

/**
 * 关闭事项数据添加更新面板
 */
function closeUpdatePanel() {
    //wx.creatAnimation()
    let animation = wx.createAnimation({
        duration: 600
    });
    //step()函数表示一组动画已经完成
    animation.translateY('100%').step();
    this.setData({
        updatePanelAnimationData: animation.export()
    });
}

/**
 * 加载事项列表数据
 */
function loadItemListData() {
    const {
        year,
        month,
        date
    } = this.data.data.selected;
    let _this = this;
    //DataService.findByDate() 根据日期查找所有符合条件的事项记录 参数为{ Date } date日期对象 返回值为{ Array } 事项集合
    //Date.parse(datestring) parse() 方法可解析一个日期时间字符串，并返回 1970/1/1 午夜距离该日期时间的毫秒数 该方法是 Date 对象的静态方法。一般采用 Date.parse() 的形式来调用，而不是通过 dateobject.parse() 调用该方法。
    //arrayObject.join(separator) join() 方法用于把数组中的所有元素放入一个字符串 返回一个字符串。该字符串是通过把 arrayObject 的每个元素转换为字符串，然后把这些字符串连接起来，在两个元素之间插入 separator 字符串而生成的。
    DataService.findByDate(new Date(Date.parse([year, month, date].join('-')))).then((data) => {
        _this.setData({
            itemList: data
        });
    });

}

/**
 * 重置是项列表勾选记录
 */
function resetItemListDataCheck() {
    let data = this.data.itemList || []; //data作用域resetItemListDataCheck()
    for (let i = 0, len = data.length; i < len; i++) {
        data[i]['checked'] = false;
    }
    //setDate() 设置 Date 对象中月的某一天 (1 ~ 31)。 
    this.setData({
        itemList: data
    });
}

/**
 * 变更日期数据
 * @param {Date} targetDate 当前日期对象
 */
function changeDate(targetDate) {
    let date = targetDate || new Date();
    let currentDateObj = new Date();

    let showMonth, //当天显示月份
        showYear, //当前显示年份
        showDay, //当前显示星期
        showDate, //当前显示第几天
        showMonthFirstDateDay, //当前显示月份第一天的星期
        showMonthLastDateDay, //当前显示月份最后一天的星期
        showMonthDateCount; //当前月份的总天数

    let data = []; //data作用域changeDate(targetDate)

    showDate = date.getDate(); //库函数 getDate() 从 Date 对象返回一个月中的某一天 (1 ~ 31)。
    showMonth = date.getMonth() + 1; //库函数 getMonth() 从 Date 对象返回月份 (0 ~ 11)。
    showYear = date.getFullYear(); //库函数 getFullYear() 从 Date 对象以四位数字返回年份。
    showDay = date.getDay(); //库函数 getDay() 从 Date 对象返回一周中的某一天 (0 ~ 6)。

    //getDay() 从 Date 对象返回一周中的某一天 (0 ~ 6)。
    //setDate() 设置 Date 对象中月的某一天 (1 ~ 31)。
    showMonthDateCount = new Date(showYear, showMonth, 0).getDate();
    date.setDate(1);
    showMonthFirstDateDay = date.getDay(); //当前显示月份第一天的星期
    date.setDate(showMonthDateCount);
    showMonthLastDateDay = date.getDay(); //当前显示月份最后一天的星期  

    let beforeDayCount = 0,
        beforeYear, //上页月年份
        beforMonth, //上页月份
        afterYear, //下页年份
        afterMonth, //下页月份
        afterDayCount = 0, //上页显示天数
        beforeMonthDayCount = 0; //上页月份总天数

    //上一个月月份
    beforMonth = showMonth === 1 ? 12 : showMonth - 1;
    //上一个月年份
    beforeYear = showMonth === 1 ? showYear - 1 : showYear;
    //下个月月份
    afterMonth = showMonth === 12 ? 1 : showMonth + 1;
    //下个月年份
    afterYear = showMonth === 12 ? showYear + 1 : showYear;

    //获取上一页的显示天数
    //showMonthFirstDataDay为当前显示月份第一天的星期
    if (showMonthFirstDateDay != 0)
        beforeDayCount = showMonthFirstDateDay - 1;
    else
        beforeDayCount = 6;

    //获取下页的显示天数
    //showMonthLastDataDay为当前显示月份最后一天的星期 
    if (showMonthLastDateDay != 0)
        afterDayCount = 7 - showMonthLastDateDay;
    else
        showMonthLastDateDay = 0;

    //如果天数不够6行，则补充完整
    //showMonthDateCount为当前月份的总天数 beforeDayCount为上个月在本页显示的天数 afterDayCount为下一个月再本月显示的天数
    let tDay = showMonthDateCount + beforeDayCount + afterDayCount;
    if (tDay <= 35)
        afterDayCount += (42 - tDay); //6行7列 = 42

    let selected = this.data.data['selected'] || { //对象的||or&&，进行布尔值的逻辑运算。当运算到某一个变量就得出最终结果之后，就返回哪个变量。
        //此处意为若selected为"" , false , 0 , null , undefined , NaN，返回后面的对象，否则不变。
        //selected作用域changeDate
        /**在本文件赋值 */
        year: showYear,
        /**在本文件赋值 */
        month: showMonth,
        /**在本文件赋值 */
        date: showDate
    };
    let selectDateText = selected.year + '年' + formatNumber(selected.month) + '月' + formatNumber(selected.date) + '日';

    //data作用域Page
    data = {
        currentDate: currentDateObj.getDate(), //当天日期第几天
        currentYear: currentDateObj.getFullYear(), //当天年份
        currentDay: currentDateObj.getDay(), //当天星期
        currentMonth: currentDateObj.getMonth() + 1, //当天月份
        showMonth: showMonth, //当前显示月份
        showDate: showDate, //当前显示月份的第几天 
        showYear: showYear, //当前显示月份的年份
        beforeYear: beforeYear, //当前页上一页的年份
        beforMonth: beforMonth, //当前页上一页的月份
        afterYear: afterYear, //当前页下一页的年份
        afterMonth: afterMonth, //当前页下一页的月份
        selected: selected,
        selectDateText: selectDateText
    };

    let dates = [];
    let _id = 0; //为wx:key指定

    /**
     *将日历表中该页显示的所有日期存入数组中
     */
    if (beforeDayCount > 0) {
        //getDate() 从 Date 对象返回一个月中的某一天 (1 ~ 31)
        beforeMonthDayCount = new Date(beforeYear, beforMonth, 0).getDate();
        for (let fIdx = 0; fIdx < beforeDayCount; fIdx++) {
            //arrayObject.unshift(newelement1,newelement2,....,newelementX) unshift() 方法可向数组的开头添加一个或更多元素，并返回新的长度
            dates.unshift({
                _id: _id,
                year: beforeYear,
                month: beforMonth,
                date: beforeMonthDayCount - fIdx
            });
            _id++;
        }
    }

    for (let cIdx = 1; cIdx <= showMonthDateCount; cIdx++) {
        //arrayObject.push(newelement1,newelement2,....,newelementX) push() 方法可向数组的末尾添加一个或多个元素，并返回新的长度
        dates.push({
            _id: _id,
            active: (selected['year'] == showYear && selected['month'] == showMonth && selected['date'] == cIdx), //选中状态判断
            year: showYear,
            month: showMonth,
            date: cIdx
        });
        _id++;
    }

    if (afterDayCount > 0) {
        for (let lIdx = 1; lIdx <= afterDayCount; lIdx++) {
            dates.push({
                _id: _id,
                year: afterYear,
                month: afterMonth,
                date: lIdx
            });
            _id++;
        }
    }

    data.dates = dates;


    this.setData({
        data: data,
        pickerDateValue: showYear + '-' + showMonth
    });
    // 加载事项列表数据
    loadItemListData.call(this);
}