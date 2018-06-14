
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
        storage.saveAccountInfo(key,value);
    }

    //验证账户信息
    checkAccountInfo(key,value){
        let result = storage.getAccountInfo(key);
        return result == value;
    }
}

