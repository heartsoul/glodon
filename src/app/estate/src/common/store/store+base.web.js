/**
 * 数据存储类
 */
import Storage from './storage';
import StackActions from './../../node_modules/app-3rd/lib/react-navigation/src/routers/StackActions'
import NavigationActions from './../../node_modules/app-3rd/lib/react-navigation/src/NavigationActions'

class WebStorage extends Storage {
    constructor() {
        super();
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
    globalBack = (navigation, params = 1) => {
        let navigator = navigation;
        if (!navigator) {
            navigator = this.homeNavigation;
        }
        if (!navigator) {
            return;
        }
        if(global.storage.backInterceptor) {
            global.storage.backInterceptor(navigator,params);

        } else {
            navigator.pop(params);
        }
    }
    
}
// 全局变量
if (!global.storage) {
    global.storage = new WebStorage();
}

export function loadStorageData() {
    return storage._loadStorageData()
}
