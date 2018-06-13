
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
    
    
}

