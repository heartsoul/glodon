/**
 * 数据存储类
 */

import { Component } from 'react';
import ActionRightsObject from './actionRightsObject';
import BaseStorage  from './baseStorage';

function userId() {
    let uid = storage.getUserId();
    if (uid) return "_" + uid + "_";
    return "_0_";
}

class GLDStorage extends BaseStorage {
    constructor() {
        super();

        this.homeNavigation = null; // 主导航

        // 临时数据
        this.bimToken = {};
        this.fileId = '';
        this.projectIdVersionId = '';
        this.projectId = 0;
        this.currentRouteName = "";
    }
    setRootNavigation(navigation) {
        this.homeNavigation = navigation;
    }

    getRootNavigation=()=>{
        return this.homeNavigation;
    }
    //保存用户信息
    saveUserInfo(userInfo) {
        this.setItem(__KEY_userInfo + userId(), userInfo);
    }
    //加载用户信息
    loadUserInfo(retFun) {
        return this.loadItem(__KEY_userInfo + userId(), {}, retFun);
    }
    // 获取用户id
    getUserId = () => {
        return this.loadItem(__KEY_userId, '0', null);
    }
    // 保存登录token
    saveLoginToken = (token, userId = '0', userName = '') => {
        // console.log('response.data.access_token1:'+token);
        this.setItem(__KEY_guide, '1');
        this.setItem(__KEY_userId, userId);
        this.setItem(__KEY_loginToken, token);
    }
    saveLoginUserName = (userName = '') => {
        this.setItem(__KEY_loginUserName, userName);
    }
    // 获取登录的用户名
    getLoginUserName = () => {
        return this.loadItem(__KEY_loginUserName, '', null);
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
        this.saveLoginToken('', '0');
    }
    resetData = () => {
        this.resetStorageData();
    }
    // 保存引导状态为引导过了
    saveGuide = () => {
        // this.setItem(__KEY_guide, '1');
    }
    // 是否已经引导过了 true：引导过了
    isGuide = (retFun) => {
        return this.loadItem(__KEY_guide, '0', null) == '1';
    }

    // 保存当前租户  保存的是id, 不是tenantId
    saveTenant = (tenant) => {
        if(!tenant) {
            tanant = '0';
        }
        this.setItem(__KEY_currentTenant + userId(),""+tenant);
    }
    // 获取当前租户id， 不是tenantId
    loadTenant = (retFun) => {

        return this.loadItem(__KEY_currentTenant + userId(), '0', retFun)
    }

    // 获取当前租户信息， 所有用户共用此
    loadTenantId = (retFun) => {

        return this.loadItem(__KEY_currentTenantId, '0', retFun)
    }

    // 保存当前租户  保存的是整个租户信息
    saveTenantInfo = (tenant) => {
        this.setItem(__KEY_currentTenantInfo + userId(), "" + tenant);
        this.setItem(__KEY_currentTenantId, "" + tenant);
    }
    // 获取当前租户信息
    loadTenantInfo = (retFun) => {
        return this.loadItem(__KEY_currentTenantInfo + userId(), '0', retFun)
    }
    // 保存上一租户  保存的是整个租户信息
    saveLastTenantInfo = (tenant) => {
        this.setItem(__KEY_lastTenantInfo + userId(), "" + tenant);
    }
    // 获取上一租户信息
    loadLastTenantInfo = (retFun) => {
        return this.loadItem(__KEY_lastTenantInfo + userId(), '0', retFun)
    }

    // 切换租户后是否刷新
    saveTenantInfoRefresh = (tenant) => {
        this.setItem(__KEY_currentTenantInfoRefresh + userId(), "" + tenant);
    }
    // 切换租户后是否刷新
    loadTenantInfoRefresh = (retFun) => {
        return this.loadItem(__KEY_currentTenantInfoRefresh + userId(), '0', retFun)
    }


    // 保存当前租户 是tenantId，不是id
    saveLastTenant = (tenant) => {
        if(!tenant) {
            tanant = '0';
        }
        this.setItem(__KEY_lastTenant + userId(), "" + tenant);
    }
    // 获取上一租户 是tenantId，不是id
    loadLastTenant = () => {
        return this.loadItem(__KEY_lastTenant + userId(), '0', null)
    }

    // 保存当前项目，名称
    saveProject = (project, name) => {
        if(!project) {
            project = '0';
        }
        this.setItem(__KEY_currentProject + userId(), "" + project);
        this.setItem(__KEY_currentProjectName + userId(), "" + name);
    }
    // 获取当前选择项目
    loadProject = (retFun) => {
        return this.loadItem(__KEY_currentProject + userId(), '0', retFun);
    }
    // 获取当前选择项目名
    loadCurrentProjectName = (retFun) => {
        return this.loadItem(__KEY_currentProjectName + userId(), '首页', retFun);
    }
    // 获取权限项
    loadAuthority = (key) => {
        let actionRights = this.loadItem(__KEY_actionRights + userId(), {}, null);
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
        let actionRights = this.loadItem(__KEY_actionRights + userId(), {}, null);
        actionRights[key] = value;
        this.setItem(__KEY_actionRights + userId(), actionRights);
    }
    // 获取根控制器
    getRootNavigation() {
        return this.homeNavigation;
    }

    // 到登录页面
    gotoLogin = (navigation) => {
        let navigator = navigation;
        if (!navigator) {
            navigator = this.homeNavigation;
            this.homeNavigation = null
        }
        if (!navigator) {
            return;
        }
        // this.logout();
        this.saveLoginToken('', '0');
        let resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'LoginPage' })//要跳转到的页面名字
            ]
        });
        navigator.dispatch(resetAction);
    }
    // 到home页面
    gotoMainPage = (navigation,params) => {
        console.log('1111')
        let navigator = navigation;
        if (!navigator) {
            navigator = this.homeNavigation;
        }
        if (!navigator) {
            return;
        }
        params = params || {};
        let resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'MainPage',params})//要跳转到的页面名字
            ]
        });
        navigator.dispatch(resetAction);
    }
    gotoSwitchProject = (navigation) => {
        let navigator = navigation;
        if (!navigator) {
            navigator = this.homeNavigation;
        }
        if (!navigator) {
            return;
        }
        let resetAction = StackActions.reset({
            index: 1,
            actions: [
                NavigationActions.navigate({ routeName: 'TenantPage' ,params:{change:false}}),//要跳转到的页面名字
                NavigationActions.navigate({ routeName: 'ProjectPage', params:{ tenantId: storage.loadLastTenant(), id: storage.loadTenant() } })//要跳转到的页面名字
            ]
        });
        navigator.dispatch(resetAction);
    }
    // 是否选择了租户和项目
    hasChoose = () => {
        let t = this.loadTenant();
        let p = this.loadProject();
        // console.log(`hasChoose:(${t},${p})`);
        let retValue = (t && p && t != '0' && p != '0');
        return retValue;
    }
    // 转到页面，会替换
    gotoMain = (navigation = null, name = "MainPage", params = {}) => {
        console.log('1111')
        let navigator = navigation;
        if (!navigator) {
            navigator = this.homeNavigation;
        }
        console.log('222')
        if (!navigator) {
            return;
        }
        console.log(this.hasChoose())
        this.hasChoose() ? navigator.replace(name, params = {}) : navigator.replace("ChoosePage", params = {});
    }
    // 转到页面，replace模式
    replaceNext = (navigation, name = "MainPage", params = {}) => {
        let navigator = navigation;
        if (!navigator) {
            navigator = this.homeNavigation;
        }
        if (!navigator) {
            return;
        }
        navigator.replace(name, params);
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
       let action =  StackActions.push({
            routeName:name,
            params:params||{}
        });
        navigator.dispatch(action);
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
        navigator.goBack(params);
    }
    // 返回到上一页面
    pop = (navigation, params = 1) => {
        let navigator = navigation;
        if (!navigator) {
            navigator = this.homeNavigation;
        }
        if (!navigator) {
            return;
        }
        navigator.pop(params);
    }
    // 处理浏览器，手机返回键，这里还需要处理需要阻止返回的情形
    globalBack = (navigation, params = 1) => {
        let navigator = navigation;
        if (!navigator) {
            navigator = this.homeNavigation;
        }
        if (!navigator) {
            return;
        }
        navigator.pop(params);
    }

    //质量管理相关state
    //模型图纸选择后新建页面回调
    bimFileChooseCallback = (bimFile) => { }

    qualityState = {
        bimChooserKey: '',//选择图纸模型的时候记录目录页面的初始navigation key，goBack from this page.
        bimChooserCallback: () => { },//选择图纸模型后的回调
    };

    // 获取单据搜索历史
    loadSearchHistory = (searchType) => {
        let history = this.getItem(`${__KEY_searchHistory}-${searchType}-${userId()}`);
        return history;
    }
    // 保存单据搜索历史
    setSearchHistory = (searchType,history) => {
        this.setItem(`${__KEY_searchHistory}-${searchType}-${userId()}`, history);
    }
    // wlan下自动下载
    loadAutoDownload = () => {
        let autoDownload = this.getItem(__KEY_autoDownload + userId());
        return autoDownload;
    }
    // wlan下自动下载
    setAutoDownload = (autoDownload) => {
        this.setItem(__KEY_autoDownload + userId(), autoDownload);
    }

    //保存离线在线状态  state  true  false
    setOfflineState = (state)=>{
        this.setItem(__KEY_offlineState,state);
    }
    //获取离线在线状态
    getOfflineState = ()=>{
        let state = this.getItem(__KEY_offlineState);
        return state;
    }

    //保存当前项目的最新版本id
    setLatestVersionId = (projectId,versionId) =>{
        this.setItem(__KEY_latestVersionId + userId()+projectId,versionId);
    }
    //获取当前项目的最新版本id
    getLatestVersionId = (projectId)=>{
        let versionId = this.getItem(__KEY_latestVersionId + userId()+projectId);
        return versionId;
    }

     //保存当前租户的项目列表
     setProjectListByTenant = (tenantId,value) =>{
        this.setItem(__KEY_tenantProjectList + userId()+tenantId,value);
    }
    //获取当前租户的项目列表
    getProjectListByTenant = (tenantId)=>{
        let value = this.getItem(__KEY_tenantProjectList + userId()+tenantId);
        return value;
    }

    //保存账户信息
    saveAccountInfo = (key,value) =>{
        this.setItem(__KEY_accountInfo + key,value);
    }
    //获取账户信息
    getAccountInfo = (key)=>{
        let value = this.getItem(__KEY_accountInfo + key);
        return value;
    }

    //保存当前账户信息  所有用户共用此
    saveCurrentAccountInfo = (key,value) =>{
        this.setItem(__KEY_currentAccountUserInfo,{key:key,value:value});
    }
    //获取当前账户信息  所有用户共用此
    getCurrentAccountInfo = ()=>{
        let value = this.getItem(__KEY_currentAccountUserInfo);
        return value;
    }

    //保存当前用户信息
    saveAccountUserInfo = (key,value) =>{
        this.setItem(__KEY_accountUserInfo + key,value);
    }
    //获取当前用户信息
    getAccountUserInfo = (key)=>{
        let value = this.getItem(__KEY_accountUserInfo + key);
        return value;
    }


    //保存模型id与离线包名对应关系
    setModelFileIdOfflineName = (fileId,offlineName) =>{
        this.setItem(__KEY_modelFileIdOfflineName + userId()+fileId,offlineName);
    }
    //获取模型id与离线包名对应关系
    getModelFileIdOfflineName = (fileId)=>{
        let versionId = this.getItem(__KEY_modelFileIdOfflineName + userId()+fileId);
        return versionId;
    }
    
}

// 相关数据key

const __KEY_userInfo = "userInfo"; // 用户数据
const __KEY_loginToken = "loginToken"; // token
const __KEY_loginUserName = "loginUserName"; // userName
const __KEY_currentProject = "currentProject"; // 当前项目
const __KEY_guide = "guide"; // 启动引导页面 0: 未启动 1:已经启动过了
const __KEY_userId = "userId"; // 启动引导页面 0: 未启动 1:已经启动过了
const __KEY_currentProjectName = "currentProjectName"; // 当前选择项目名
const __KEY_currentTenant = "currentTenant"; // 当前租户id  不同的用户 保存不同的id
const __KEY_currentTenantId = "currentTenantId"; // 当前租户id  所有用户共用此id
const __KEY_currentTenantInfo = "currentTenantInfo"; // 当前租户信息
const __KEY_currentTenantInfoRefresh = "currentTenantInfoRefresh"; // 切换租户后是否刷新
const __KEY_lastTenant = "lastTenant"; // 上一选择租户
const __KEY_lastTenantInfo = "lastTenantInfo"; // 保存上一个租户的信息
const __KEY_actionRights = "actionRights"; // 当前所有权限
const __KEY_searchHistory = "searchHistory"; // 单据搜索历史
const __KEY_autoDownload = "autoDownload"; // Android版本更新自动下载
const __KEY_offlineState = "offlineState"; // Android版本更新自动下载
const __KEY_latestVersionId = "latestVersionId"; // 当前项目最新版本
const __KEY_modelFileIdOfflineName = "modelFileIdOfflineName"; // 模型id与离线包名的对应关系存储
const __KEY_tenantProjectList = "tenantProjectList"; // 模型id与离线包名的对应关系存储
const __KEY_accountInfo = "accountInfo"; // 账户信息
const __KEY_accountUserInfo = "accountUserInfo"; // 用户信息
const __KEY_currentAccountUserInfo = "currentAccountUserInfo"; // 用户信息

export default GLDStorage;
