import {
    AsyncStorage,
} from 'react-native';

// 第三方框架
import Storage from 'react-native-storage';


export default class BaseStorage {
    // constructor() {
    //     super.constructor();
    //     // this.storage = new Storage({
    //     //     // 最大容量，默认值1000条数据循环存储
    //     //     size: 1000,

    //     //     // 存储引擎：对于RN使用AsyncStorage，对于web使用window.localStorage
    //     //     // 如果不指定则数据只会保存在内存中，重启后即丢失
    //     //     storageBackend: AsyncStorage,

    //     //     // 数据过期时间，默认一整天（1000 * 3600 * 24 毫秒），设为null则永不过期
    //     //     defaultExpires: 1000 * 3600 * 24 * 365, // 有效期一年

    //     //     // 读写时在内存中缓存数据。默认启用。
    //     //     enableCache: true,

    //     //     // 如果storage中没有相应数据，或数据已过期，
    //     //     // 则会调用相应的sync方法，无缝返回最新数据。
    //     //     // sync方法的具体说明会在后文提到
    //     //     // 你可以在构造函数这里就写好sync的方法
    //     //     // 或是写到另一个文件里，这里require引入
    //     //     // 或是在任何时候，直接对storage.sync进行赋值修改
    //     //     sync: require('./sync')
    //     // });
    // }

    version() {
        console.log('BaseStorage version 1.0.0.0');
    }

    storage() {
        return this.storage;
    }
}

class GLDStorage extends BaseStorage {
    // constructor() {
    //     super();
    //     // this.userInfo = {};
    //     // this.loginToken = '';
    //     // this.storage.load({
    //     //     key: 'loginToken',

    //     //     // autoSync(default true) means if data not found or expired,
    //     //     // then invoke the corresponding sync method
    //     //     autoSync: true,

    //     //     // syncInBackground(default true) means if data expired,
    //     //     // return the outdated data first while invoke the sync method.
    //     //     // It can be set to false to always return data provided by sync method when expired.(Of course it's slower)
    //     //     syncInBackground: true,

    //     //     // you can pass extra params to sync method
    //     //     // see sync example below for example
    //     //     syncParams: {
    //     //         extraFetchOptions: {
    //     //             // blahblah
    //     //         },
    //     //         someFlag: true,
    //     //     },
    //     // }).then(ret => {
    //     //     // found data go to then()
    //     //     console.log(ret);
    //     //     this.loginToken = ret;
    //     // }).catch(err => {
    //     //     // any exception including data not found 
    //     //     // goes to catch()
    //     //     console.warn(err.message);
    //     //     switch (err.name) {
    //     //         case 'NotFoundError':
    //     //             // TODO;
    //     //             break;
    //     //         case 'ExpiredError':
    //     //             // TODO
    //     //             break;
    //     //     }
    //     //     this.loginToken = '';
    //     // })
    // }
    saveLoginToken(token) {
        this.loginToken = token;
        this.storage.setItem('loginToken', this.loginToken);
    }
    loginToken() {
        return this.loginToken;
    }
    isLogin() {
        return this.loginToken != '';
    }
    logout() {
        this.loginToken = '';
        this.storage.setItem('loginToken', this.loginToken);
    }
}
// 全局变量
global.storage = new GLDStorage();