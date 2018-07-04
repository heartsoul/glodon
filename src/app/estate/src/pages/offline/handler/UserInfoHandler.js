
import BaseHandler from './BaseHandler';


//项目列表 

export default class UserInfoHandler extends BaseHandler{


    update=(key,value)=>{
        if(!this.isEmpty(value)){
            storage.setProjectListByTenant(key,value);
        }
    }

    query =(key)=>{
        let value = storage.getProjectListByTenant(key);
        return value;
    }
    
     //保存账户信息
    saveAccountInfo(key,value){
        storage.saveAccountInfo(key,value); //保存账户信息
        storage.saveCurrentAccountInfo(key,value);//保存当前账户信息   所有用户共用此
    }

    //获取当前账户信息   所有用户共用此
    getCurrentAccountInfo(){
        return storage.getCurrentAccountInfo();
    }

    //验证账户信息
    checkAccountInfo(key,value){
        let result = storage.getAccountInfo(key);
        return result == value;
    }

    //保存用户信息
    saveUserInfo(key,value){
        storage.saveAccountUserInfo(key,value)
    }

    //获取用户信息
    getUserInfo(key){
        let info = storage.getAccountUserInfo(key);
        return info;
    }
}

