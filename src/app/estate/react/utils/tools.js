import { message } from 'antd';
import React from 'react';
import services from '../services/export';
import * as CONSTANT from '../CONSTANT/export';

const doc = window.document;
const Tools = {
    // 全局提示信息
  info: (info) => {
    message.info(info);
  },
  handleTime(time) {
    return `${(new Date(time.endTime).getTime() - new Date(time.beginTime).getTime()) / 3600000}H`;
  },
  // 扁平数据转成ant所需数据
  // convertListTotree: (arr, data) => {
  //   const cloneData = [...data];
  //   let newData = [];
  //   let parIndex = 0;
  //   array.forEach(function(element) {
  //   }, this); (const i in data) {
  //     const item = data[i];
  //     if (!item.parentId && !item.categoryId) {
  //       item.key = `0-${parIndex}`;
  //       item.title = item.name;
  //       item.type = 'category';
  //       parIndex += 1;
  //       item.children = [];
  //       newData.push(item);
  //       cloneData.splice(i, 1);
  //     }
  //   }
  //   if (!newData.length) {
  //     newData = arr;
  //   }
  //   for (const i in newData) {
  //     const itemPar = newData[i];
  //     let index = 0;
  //     for (const j in cloneData) {
  //       const itemSon = cloneData[j];
  //       if (itemSon.parentId === itemPar.id || itemSon.categoryId === itemPar.id) {
  //         itemSon.key = `${itemPar.key}-${index}`;
  //         itemSon.title = itemSon.name;
  //         itemSon.shoudDel = true;
  //         itemSon.type = itemSon.categoryId ? 'methods' : 'category';
  //         if (typeof itemPar.children === 'undefined') {
  //           itemPar.children = [];
  //         }
  //         itemPar.children.push(itemSon);
  //         arr.push(itemSon);
  //         index += 1;
  //       }
  //     }
  //     for (const k in cloneData) {
  //       const item = cloneData[k];
  //       if (item.shoudDel) {
  //         cloneData.splice(k, 1);
  //       }
  //     }
  //   }
  //   if (cloneData.length) {
  //     Tools.convertListTotree(arr, cloneData);
  //   }
  //   return newData;
  // },
  // 四舍五入指定小数位
  numRound: (x, num) => {
    const n = Math.pow(10, num);
    return Math.round(x * n) / n;
  },

  /**
   * 在指定索引位置增加新元素，未指定index时添加到最后面
   * @param array (array)
   * @param newItem   (object)
   * @param index (int)
   * @returns {*} 返回新数组
   */
  addItem: (array, newItem, index) => {
    if (typeof index !== 'undefined') {
      return [
        ...array.slice(0, index),
        newItem,
        ...array.slice(index + 1),
      ];
    } else {
      return [
        ...array,
        newItem,
      ];
    }
  },
  /**
   * 删除指定id的元素
   * @param array
   * @param id
   * @returns {[*,*]} 返回新数组
   */
  delItem: (array, id) => {
    const findIndex = array.findIndex(item => item.id === id);
    return [
      ...array.slice(0, findIndex),
      ...array.slice(findIndex + 1),
    ];
  },
  /**
   * 替换数组中指定的元素
   * @param array
   * @param id
   * @param newItem (object)
   * @returns {[*,*,*]} 返回新数组
   */
  modifyItem: (array, id, newItem) => {
    const findIndex = array.findIndex(item => item.id === id);
    return [
      ...array.slice(0, findIndex),
      {
        ...array[findIndex],
        ...newItem,
      },
      ...array.slice(findIndex + 1),
    ];
  },
  winSize: () => {
    return {
      width: doc.body.clientWidth,
      height: doc.body.clientHeight,
    };
  },
  setTimeCellHei: () => {
    return (this.winSize().height - 285) / 24;
  },
  getPar: (el, name) => {
      // while(el.parentNode !== name){
    const nameReg = new RegExp(name, 'i');
    let ele = el;
    while (ele.parentNode && ele.parentNode.getAttribute && !nameReg.test(ele.parentNode.getAttribute('class'))) {
      ele = ele.parentNode;
    }
    return ele.parentNode;
  },
  // 排班计划转换时间
  convertTime(time) {
    const convertTime = (str) => {
      return str.substr(0, 5);
    };
    return `${new Date(time).toLocaleDateString().replace(/\//g, '-')} ${convertTime(new Date(time).toTimeString())}`;
  },
  message(o) {
    o.dispatch({
      type: 'app/getData',
      payload: {
        showMsg: true,
        msgOps: {
          type: o.type,
          con: o.con,
        },
      },
    });
  },
  isClass(o) {
    if (o === null) return 'Null';
    if (o === undefined) return 'Undefined';
    return Object.prototype.toString.call(o).slice(8, -1);
  },
  deepClone(obj) {
    let result;
    const oClass = this.isClass(obj);
    if (oClass === 'Object') {
      result = {};
    } else if (oClass === 'Array') {
      result = [];
    } else {
      return obj;
    }
    for (const key in obj) {
      const copy = obj[key];
      if (this.isClass(copy) === 'Object') {
        result[key] = this.deepClone(copy); // 递归调用
      } else if (this.isClass(copy) === 'Array') {
        result[key] = this.deepClone(copy);
      } else {
        result[key] = obj[key];
      }
    }
    return result;
  },
  // const obj = [{equipmentCode: '1号塔吊', orgName: '2222', startAndEndTime: null, useTime: null }];
  // 扁平数据转成父子结构
  convertListData(data, parKey) {
    const arr = [];
    const parKeyArr = [];
    for (const item of data) {
      if (parKeyArr.indexOf(item[parKey]) === -1) {
        const equipmentCode = item[parKey];
        delete item[parKey];
        parKeyArr.push(equipmentCode);
        arr.push({
          equipmentCode,
          list: [{ ...item }],
        });
      } else {
        for (const it of arr) {
          if (it.equipmentCode === item[parKey]) {
            const list = it.list;
            delete item[parKey];
            list.push({ ...item });
          }
        }
      }
    }
    return arr;
  },
  // 在对象中根据某一键值排序,desc从大到小，asc从小到大
  sort(data, sortKey, type) {
    const newData = this.deepClone(data);
    const arr = [];
    const sortArr = [];
    for (const item of newData) {
      const num = parseFloat(item[sortKey]);
      if (sortArr.indexOf(num) === -1) {
        sortArr.push(num);
      }
    }
    if (type === 'asc') {
      sortArr.sort((a, b) => {
        return a - b;
      });
    } else if (type === 'desc') {
      sortArr.sort((a, b) => {
        return b - a;
      });
    }
    for (let i = 0; i < sortArr.length;) {
      for (const it of newData) {
        if (parseFloat(it[sortKey]) === sortArr[i]) {
          arr.push(it);
          // newData.splice(i, 1);
          // sortArr.splice(i, 1);
        }
      }
      i += 1;
    }
    return arr;
  },
  // type为输入类型 ， eventType为事件类型
  judgeInput(type, val, eventType) {
    switch (type) {
      case 'mobile':
        if (eventType === 'change') {
          // return /\D/.test(val);
          if (val.length === 1) {
            return /^1/.test(val);
          } else if (val.length === 2) {
            return /^1[3|5|7|8|4]/.test(val);
          } else if (val.length > 2 && val.length <= 11) {
            return /^1[3|5|7|8|4]\d+$/.test(val);
          } else if (val.length > 11 && !val.length) {
            return false;
          }
        } else if (eventType === 'blur') {
          return /^1[3|5|7|8|4]\d{9}$/.test(val);
        }
        break;
      case 'email':
        const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
        return reg.test(val);
      default:
        break;
    }
  },
  // 提示消息
  msgShow(type, res, dispatch) {
    dispatch({
      type: 'app/getData',
      payload: {
        showMsg: true,
        msgOps: {
          type,
          con: res,
        },
      },
    });
  },
  loginOut() {
    const p1 = new Promise((resolve) => {
      services.loginOut({}).then(() => {
        resolve();
      });
    });
    const p2 = new Promise((resolve) => {
      services.uaaLoginOut({}).then(() => {
        resolve();
      });
    });
    Promise.all([p1, p2]).then((aa) => {
      // console.log(aa);
      // window.location.href = '/entry.html';
      window.location.href = '/';
      // window.location.reload();
    });
  },
  getTop(e) {
    let offset = e.offsetTop;
    if (e.offsetParent != null) offset += this.getTop(e.offsetParent);
    return offset;
  },
  // 获取元素的横坐标（相对于窗口）
  getLeft(e) {
    let offset = e.offsetLeft;
    if (e.offsetParent != null) offset += this.getLeft(e.offsetParent);
    return offset;
  },
  // 事件委托
  on(interfaceEle, selector, type, fn) {
    const _ = this;
    if (interfaceEle.addEventListener) {
      interfaceEle.addEventListener(type, eventfn);
    } else {
      interfaceEle.attachEvent(`on ${type}`, eventfn);
    }
    function eventfn(ev) {
      const e = ev || window.event;
      const target = e.target || e.srcElement;
      const selectorName = selector.slice(1);
      if (_.getPar(target, selectorName) || new RegExp(`${selectorName}`, 'i').test(target.getAttribute('class'))) {
        if (fn) {
          fn.call(_.getPar(target, selectorName), e, _.getPar(target, selectorName));
        }
      }
    }
    // function matchSelector(ele, selor) {
    //   if (selor.charAt(0) === '#') {
    //     return ele.id === selor.slice(1);
    //   }
    //   if (selor.charAt(0) === '.') {
    //     return new RegExp(`${selor.slice(1)}\\s+`, 'i').test(`${ele.className}`);
    //   }
    //   return ele.tagName.toLowerCase() === selor.toLowerCase();
    // }
  },
  // 获取命名空间
  getModelName(state) {
    let name = '';
    const obj = CONSTANT.rs.modelName;
    const pathName = state.routing.locationBeforeTransitions.pathname;
    for (const item in obj) {
      const path = pathName.replace(/^\//, '');
      if (obj[item].indexOf(path) >= 0) {
        name = item;
      }
    }
    return name;
  },
  // 匹配高亮
  searchHeightLight({ keyWords, words, color, style = {}, className = '' }) {
    const arr = words.split(keyWords);
    const len = arr.length;
    return (
      <div
        className={className}
        title={words}
        style={style}
      >
        {
          arr.map((item, index) => {
            return (
              <span key={index}>
                {item}
                {
                  index !== len - 1 ? (<font
                    style={{
                      color,
                    }}
                  >{keyWords}</font>) : ''
                }
              </span>
            );
          })
        }
      </div>
    );
  },
  formatDate(date) {
    return new Date(date).toLocaleDateString().replace(/\//g, '-');
  },
  // 获取字符串长度
  getLength({ str, callFun }) {
    const obj = {
      len: 0,
      str: '',
    };
    for (let i = 0; i < str.length;) {
      if (str.charCodeAt(i) >= 0 && str.charCodeAt(i) <= 256) {
        obj.len += 1;
      } else {
        obj.len += 2;
      }
      obj.str += str.charAt(i);
      if (typeof callFun === 'function') {
        callFun(obj);
      }
      i += 1;
    }
    return obj;
  },
  autoRedirect({ url, target }) {
    const a = doc.createElement('a');
    a.href = url;
    a.target = target || '_self';
    a.click();
  },
};
export default Tools;
