/**
 * 数据存储类
 */

import { Component } from 'react'
import { AsyncStorage } from 'react-native';

// import { NavigationActions } from 'app-3rd/react-navigation'

/**
 *  权限操作对象
 */
class ActionRightsObject extends Component {
    constructor() {
        super();
        this.items = []; // 权限项目
    }
    // 权限数量
    size = () => {
        return this.items.length;
    }
    // 查找是否拥有某个权限
    contains = (key) => {
        return this.items.indexOf(key) >= 0;
    }
}

/**
 *  数据存储对象
 */
export default class BaseStorage extends Component {
    constructor() {
        super();
        this.storage = AsyncStorage; // 数据存储核心对象
        this.storageData = {};  // 内存数据对象
        this._loadStorageData(); // 首次加载数据到内存
    }
    // 存储数据
    _setItem = (key, value) => {
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
        AsyncStorage.getItem(__KEY_storageData)
            .then((value) => {
                this.storageData = JSON.parse(value);
                if (!value || value == null) {
                    this.storageData = {};
                }
            }).catch((err) => {
                console.log(err)
            });
    }
}

// 相关数据key
const __KEY_storageData = "storageData"; // 所有数据
const __KEY_userInfo = "userInfo"; // 用户数据
const __KEY_loginToken = "loginToken"; // token
const __KEY_currentProject = "currentProject"; // 当前项目
const __KEY_guide = "guide"; // 启动引导页面 0: 未启动 1:已经启动过了
const __KEY_currentProjectName = "currentProjectName"; // 当前选择项目名
const __KEY_currentTenant = "currentTenant"; // 当前租户
const __KEY_actionRights = "actionRights"; // 当前所有权限

class GLDStorage extends BaseStorage {
    constructor() {
        super();

        this.homeNavigation = null; // 主导航

        // 临时数据
        this.bimToken = {};
        this.fileId = '';
        this.projectIdVersionId = '';
        this.projectId = 0;
    }

    //保存用户信息
    saveUserInfo(userInfo) {
        this.setItem(__KEY_userInfo, userInfo);
    }
    //加载用户信息
    loadUserInfo(retFun) {
        return this.loadItem(__KEY_userInfo, {}, retFun);
    }
    // 保存登录token
    saveLoginToken = (token) => {
        this.setItem(__KEY_loginToken, token);
    }
    // 获取登录的token
    getLoginToken = () => {
        return this.loadItem(__KEY_loginToken, '', null);
    }
    // 是否已经登录了
    isLogin = () => {
        return this.getLoginToken() != '';
    }
    // 退出登录时清空所有缓存数据
    logout = () => {
        this.resetStorageData();
    }
    // 保存引导状态为引导过了
    saveGuide = () => {
        this.setItem(__KEY_guide, '1');
    }
    // 是否已经引导过了 true：引导过了
    isGuide = (retFun) => {
        return this.loadItem(__KEY_guide, '0', null) == '1';
    }
    // 保存当前租户
    saveTenant = (tenant) => {
        this.setItem(__KEY_currentTenant, "" + tenant);
    }
    // 获取当前租户
    loadTenant = (retFun) => {
        return this.loadItem(__KEY_currentTenant, '0', retFun)
    }
    // 保存当前项目，名称
    saveProject = (project, name) => {
        this.setItem(__KEY_currentProject, "" + project);
        this.setItem(__KEY_currentProjectName, "" + name);
    }
    // 获取当前选择项目
    loadProject = (retFun) => {
        return this.loadItem(__KEY_currentProject, '0', retFun);
    }
    // 获取当前选择项目名
    loadCurrentProjectName = (retFun) => {
        return this.loadItem(__KEY_currentProjectName, '首页', retFun);
    }
    // 获取权限项
    loadAuthority = (key) => {
        let actionRights = this.loadItem(__KEY_actionRights, {}, null);
        if (actionRights[key]) {
            let rights = new ActionRightsObject();
            rights.items = actionRights[key];
            return rights;
        } else {
            return new ActionRightsObject([]);
        }
    }
    // 保存权限项
    setActionRights = (key, value) => {
        if (!value) {
            return;
        }
        let actionRights = this.loadItem(__KEY_actionRights, {}, null);
        actionRights[key] = value;
        this.setItem(__KEY_actionRights, actionRights);
    }

    // 到登录页面
    gotoLogin = (navigation) => {
        let navigator = navigation;
        if (!navigator) {
            navigator = this.homeNavigation;
        }
        if (!navigator) {
            return;
        }
        let resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'LoginPage' })//要跳转到的页面名字
            ]
        });
        navigator.dispatch(resetAction);
    }
    // 到home页面
    gotoMainPage = (navigation) => {
        let navigator = navigation;
        if (!navigator) {
            navigator = this.homeNavigation;
        }
        if (!navigator) {
            return;
        }
        let resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'MainPage' })//要跳转到的页面名字
            ]
        });
        navigator.dispatch(resetAction);
    }
    // 是否选择了租户和项目
    hasChoose = (retFun) => {
        let t = this.loadTenant();
        let p = this.loadProject();
        let retValue = (t && p && t != '0' && p != '0');
        if (retFun) {
            retFun(retValue);
        }
        return retValue;
    }
    // 转到页面，会替换
    gotoMain = (navigation = null, name = "MainPage") => {
        let navigator = navigation;
        if (!navigator) {
            navigator = this.homeNavigation;
        }
        if (!navigator) {
            return;
        }
        this.hasChoose((ret) => {
            if (ret) {

                navigator.replace(name);
            } else {
                navigator.replace("ChoosePage");
            }
        })
    }
    // 转到页面，push模式
    pushNext = (navigation, name = "MainPage", params = {}) => {
        let navigator = navigation;
        if (!navigator) {
            navigator = this.homeNavigation;
        }
        if (!navigator) {
            return;
        }
        navigator.navigate(name, params);
    }
    // 返回到上一页面
    goBack = (navigation, params = {}) => {
        let navigator = navigation;
        if (!navigator) {
            navigator = this.homeNavigation;
        }
        if (!navigator) {
            return;
        }
        navigator.goBack();
    }

    //质量管理相关state
    //模型图纸选择后新建页面回调
    bimFileChooseCallback = (bimFile) => { }

    qualityState = {
        bimChooserKey: '',//选择图纸模型的时候记录目录页面的初始navigation key，goBack from this page.
        bimChooserCallback: () => { },//选择图纸模型后的回调
    };
}
// 全局变量
if (!global.storage) {
    global.storage = new GLDStorage();
}
