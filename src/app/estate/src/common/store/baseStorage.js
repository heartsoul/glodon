import { Component } from 'react'
import { AsyncStorage } from 'react-native';
import { BASE_URL } from '../constant/server-config';
/**
 *  数据存储对象
 */
export default class BaseStorage extends Component {
    constructor() {
        super();
        this.storage = AsyncStorage; // 数据存储核心对象
        this.storageData = {};  // 内存数据对象
        // this._loadStorageData(); // 首次加载数据到内存
    }
    // 存储数据
    _setItem = (key, value) => {
        //  console.log("_setItem:"+value)
        this.storage.setItem(key, value, (error, result) => {
        });
    }

    // 查询数据
    _getItem = (key, result) => {
        this.storage.getItem(key)
            .then((value) => {
                //  result(value);
            })
    }

    // 删除数据
    _removeItem = (key) => {
        AsyncStorage.removeItem(key.key);
    }

    // 存储数据，对外接口
    setItem = (key, value) => {
        this.storageData[key] = value;
        this._saveStorageData();
    }

    // 查询，对外接口
    getItem = (key) => {
        return this.storageData[key];
    }
    /**
     * 从内存获取数据，对外接口
     * 
     * @param {string} key 数据对象key 
     * @param {any} defaultValue 默认值
     * @param {function} retFun 异步返回函数
     * @returns 
     * @memberof BaseStorage
     */
    loadItem(key, defaultValue, retFun) {
        let retValue = this.getItem(key);
        if (retValue) {
            if (retFun) {
                retFun(retValue);
            }
            return retValue;
        } else {
            return defaultValue;
        }
    }
    // 删除 对外接口
    removeItem = (key) => {
        delete this.storageData[key];
        this._saveStorageData();
    }
    // 当前版本
    version = () => {
        console.log('BaseStorage version 1.1.0.0');
    }

    // 重置所有数据
    resetStorageData() {
        this.storageData = {};
        this._saveStorageData();
    }

    // 存储所有数据
    _saveStorageData() {
        this._setItem(__KEY_storageData, JSON.stringify(this.storageData));
    }

    // 加载所有数据
    _loadStorageData() {
        return AsyncStorage.getItem(__KEY_storageData)
            .then((value) => {
                this.storageData = JSON.parse(value);
                if (!value || value == null) {
                    this.storageData = {};
                }
                console.log(this.storageData);
                return {};
            });
    }
}
const __KEY_storageData = "__storageData_" + BASE_URL; // 所有数据