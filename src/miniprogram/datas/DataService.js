import {
  promiseHandle
} from '../utils/util';

var envID = "release-av6p4";

wx.cloud.init({
    env: envID
});

const db = wx.cloud.database({
    env: envID
});

const clct = db.collection('todos');
/**
 * 数据业务类
 */
class DataService {

<<<<<<< Updated upstream
  constructor(props) {
    props = props || {};
    this.id = props['_id'] || 0;
    this.content = props['content'] || '';
    this.date = props['date'] || '';
    this.month = props['month'] || '';
    this.year = props['year'] || '';
    // this.level = props['level'] || '';
    this.title = props['title'] || '';
  }

  /**
   * 保存当前对象数据
   */
  save() {
    if (this._checkProps()) {
      return DataRepository.addData({
        title: this.title,
        content: this.content,
        year: this.year,
        month: this.month,
        date: this.date,
        // level: this.level,
        addDate: new Date().getTime()
      });
=======
    constructor(props) {
        props = props || {};
        this.key = props['key'] || 0;
        this.content = props['content'] || '';
        this.date = props['date'] || '';
        this.month = props['month'] || '';
        this.year = props['year'] || '';
        // this.level = props['level'] || '';
        this.title = props['title'] || '';
    }

    /**
     * 保存当前对象数据
     */
    save() {
        if (this._checkProps()) {
            return clct.add({
                    data: {
                        title: this.title,
                        content: this.content,
                        year: this.year,
                        month: this.month,
                        date: this.date,
                        // level: this.level,
                        addDate: new Date().getTime(),
                        key: ('' + Date.UTC(this.year, this.month, this.date) + this.title + this.content)

                    }
                }).then(res => {
                    console.log(res)
                })
                .catch(console.error);
        }
>>>>>>> Stashed changes
    }
  }


  /**
   * 获取所有事项数据
   */
  static findAll() {
    return DataRepository.findAllData()
      .then(data => data.data ? data.data : []);
  }

<<<<<<< Updated upstream
  /**
   * 通过id获取事项
   */
  static findById(id) {
    return DataRepository.findBy(item => item['_id'] == id)
      .then(items => (items && items.length > 0) ? items[0] : null);
  }

  /**
   * 根据id删除事项数据
   */
  delete() {
    return DataRepository.removeData(this.id);
  }

  /**
   * 批量删除数据
   * @param {Array} ids 事项Id集合
   */
  static deleteRange(ids) {
    return DataRepository.removeRange(ids);
  }

  /**
   * 根据日期查找所有符合条件的事项记录
   * @param {Date} date 日期对象
   * @returns {Array} 事项集合
   */
  static findByDate(date) {
    if (!date) return [];
    return DataRepository.findBy(item => {
      return item && item['date'] == date.getDate() &&
        item['month'] == date.getMonth() &&
        item['year'] == date.getFullYear();
    }).then(data => data);
  }

  _checkProps() {
    return this.title && this.date && this.year && this.month;
  }
=======
    /**
     * 获取所有事项数据
     */
    static findAll() {
        return clct.get().then(res => {
                console.log(res)
            })
            .catch(console.error);
    }

    /**
     * 通过id获取事项
     */
    static findById(id) {
        console.log(id);
        return clct.where({
                key: id
            }).get()[0].then(res => {
                console.log(res)
            })
            .catch(console.error);
    }

    /**
     * 根据id删除事项数据
     */
    delete() {
        return clct.doc(tihs.id).remove().then(res => {
                console.log(res)
            })
            .catch(console.error);
    }

    /**
     * 批量删除数据
     * @param {Array} ids 事项Id集合
     */
    static deleteRange(ids) {
        if (!ids) return;
        for (let rIdx = 0, rLen = ids.length; rIdx < rLen; rIdx++) {
            clct.where(ids[rIdx]).remove();
        }
    }

    /**
     * 根据日期查找所有符合条件的事项记录
     * @param {Date} date 日期对象
     * @returns {Array} 事项集合
     */
    //这个方法通过传入一个日期来获取指定日期的事项。成功获取数据之后，在模板中遍历数据，根据level属性来显示不同颜色的图标，让事项等级一目了然。
    static findByDate(date) {
        var d = new Date();
        d = date;
        var _date = d.getDate();
        var _month = d.getMonth();
        var _year = d.getFullYear();
        var r = clct.where({
            year: _year,
            month: _month,
            date: _date
        }).get();
        return r.then(res => {
                console.log(res)
            })
            .catch(console.error);
    }

    _checkProps() {
        return (this.title && this.date && this.year && this.month).then(res => {
                console.log(res)
            })
            .catch(console.error);
    }
>>>>>>> Stashed changes
}

module.exports = DataService;