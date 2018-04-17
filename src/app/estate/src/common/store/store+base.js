import {
    AsyncStorage,
} from 'react-native';

import {NavigationActions} from 'app-3rd/react-navigation'
export default class BaseStorage {
    constructor() {
        super.constructor();
       this.storage = AsyncStorage;
    }
    setItem =(key,value)=> {
        AsyncStorage.setItem(key, value, (error, result) => {
        });
    }

    // 查询
    getItem=(key ,result)=>  {
        AsyncStorage.getItem(key)
            .then((value) => {
                //  result(value);
            })
    }

    // 删除
    removeItem=(key)=> {
        AsyncStorage.removeItem(key.key);
    }
    version=()=> {
        console.log('BaseStorage version 1.0.0.0');
    }

    storage() {
        return this.storage;
    }
}

class GLDStorage extends BaseStorage {
    constructor() {
        super();
        this.userInfo = {};
        this.loginToken = '';
        this.guide = '0';
        this.currentTenant = "0";
        this.currentProject = "0";
        this.currentProjectName = "首页";
        this.homeNavigation = null;
        this.bimToken = {};
        this.fileId = '';
        this.projectIdVersionId = '';
        this.projectId = 0;
    }
    saveLoginToken=(token)=> {
        this.loginToken = token;
        this.setItem('loginToken', this.loginToken);
    }
    getLoginToken=()=> {
        return this.loginToken;
    }
    isLogin=()=> {
        return this.loginToken != '';
    }
    logout=()=> {
        this.loginToken = '';
        this.currentProject = "0";
        this.currentProjectName = "首页";
        this.currentTenant = "0";
        this.guide = "0";
        this.bimToken = {};
        this.fileId = '';
        this.projectIdVersionId = '';
        this.projectId = 0;
        this.removeItem({key:'loginToken'});
        this.removeItem({key:'currentProject'});
        this.removeItem({key:'currentTenant'});
        this.removeItem({key:'guide'});
        this.removeItem({key:'currentProjectName'});
        
    }
    saveGuide=()=> {
        this.guide = "1";
        this.setItem('guide', this.guide);
    }
    isGuide=(retFun)=> {
        if(this.guide != "0") {
            retFun(this.guide);
            return this.guide;
        }
        AsyncStorage.getItem('guide')
            .then((value) => {
                this.guide = value;
                if(retFun) {
                    retFun(value);
                }
                return this.guide;
            });
    }
    saveTenant=(tenant)=> {
        this.currentTenant = ""+tenant;
        this.setItem('currentTenant', this.currentTenant);
    }
    loadTenant=(retFun)=> {
        console.log("loadTenant1："+this.currentTenant);
        if(this.currentTenant != "0") {
            if(retFun) {
                retFun(this.currentTenant);
            }
            return this.currentTenant;
        }
        AsyncStorage.getItem('currentTenant')
            .then((value) => {
                this.currentTenant = value;
                if(!value || value == null){
                    this.currentTenant = '0';
                }
                if(retFun) {
                    retFun(value);
                }
                return this.currentTenant;
            }).catch((err)=>{
                console.log(err)
            });
    }
    saveProject=(project,name)=> {
        this.currentProject = ""+project;
        this.currentProjectName = ""+name;
        this.setItem('currentProject', ""+project);
        this.setItem('currentProjectName', ""+name);
    }
    loadProject=(retFun)=> {
        // this.currentProject = this.getItem('currentProject');
        console.log(this.currentProject);
        if(this.currentProject != "0") {
            if(retFun) {
                retFun(this.currentProject);
            }
            return this.currentProject;
        }
        
        AsyncStorage.getItem('currentProject')
            .then((value) => {
                this.currentProject = value;
                console.log("loadProject2："+this.currentProject);
                if(retFun) {
                    retFun(value);
                }
                
                return this.currentProject;
            });
            AsyncStorage.getItem('currentProjectName')
            .then((value) => {
                this.currentProjectName = value;
            });
        // return this.currentProject;
    }
    loadCurrentProjectName=(retFun)=> {
        // this.currentProject = this.getItem('currentProject');
        // console.log(this.currentProjectName);
        if(this.currentProjectName != "首页") {
            if(retFun) {
                retFun(this.currentProjectName);
            }
            return this.currentProjectName;
        }
        
        AsyncStorage.getItem('currentProjectName')
            .then((value) => {
                this.currentProjectName = value;
                if(retFun) {
                    retFun(value);
                }
                
                return this.currentProjectName;
            });
        return this.currentProjectName;
    }
    gotoLogin=(navigation)=> {
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
                NavigationActions.navigate({routeName:'LoginPage'})//要跳转到的页面名字
            ]
        });
        navigator.dispatch(resetAction);
    }
    gotoMainPage=(navigation)=> {
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
                NavigationActions.navigate({routeName:'MainPage'})//要跳转到的页面名字
            ]
        });
        navigator.dispatch(resetAction);
    }
    hasChoose=(retFun)=> {
        let t = this.loadTenant((value)=>{
            t = value;
            this.loadProject((value)=>{
                p = value;
                if(retFun) {
                    retFun(t && p && t != "0" &&  p != "0");
                }
            });
        });
        let p = this.loadProject();
        let ret = t != "0" &&  p != "0" && t != undefined && p != undefined && t != null && p != null;
        return ret;
    }
    gotoMain = (navigation = null, name = "MainPage") => {
        let navigator = navigation;
        if (!navigator) {
            navigator = this.homeNavigation;
        }
        if (!navigator) {
            return;
        }
        this.hasChoose((ret)=>{
            if (ret) {
                
                 navigator.replace(name);
            } else {
                navigator.replace("ChoosePage");
            }
        })
    }
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

    goBack =  (navigation, params = {}) => {
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
    qualityState = {
        bimChooserKey: '',//选择图纸模型的时候记录目录页面的初始navigation key，goBack from this page.
        bimChooserCallback: () => { },//选择图纸模型后的回调
    };  
}
// 全局变量
global.storage = new GLDStorage();