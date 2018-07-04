
import BaseHandler from './BaseHandler';

import Realm from 'app-3rd/realm'

//材设清单下载条件

let name = null;
let realm = null;
export default class EquipmentConditionHandler extends BaseHandler{

//获取数据库表后缀名称
getTableName = ()=>{
    let userInfo = storage.loadUserInfo();
    // let userObj = JSON.parse(userInfo);
    let account = userInfo.username;//手机号

    let tenantInfo = storage.loadTenantInfo();
    let tenantObj = JSON.parse(tenantInfo);
    let tenantId = tenantObj.value.tenantId;//租户的id

    let projectId = storage.loadProject();//项目的id
    let targetPath = `${account}${tenantId}${projectId}`;
    return targetPath;
}

    constructor(){
        super();
        name = 'equipmentcondition'+this.getTableName();
        const basicSchema = {
            name:name,
            primaryKey:'key',
            properties:{
                key:'string',
                value:'string',
            }
        }
        realm = new Realm({schema:[basicSchema]});
    }

    close=()=>{
        realm.close();
    }
    
    insert=(key,value)=>{
        console.log('save='+value)
        if(!this.isEmpty(value)){
            realm.write(()=> {
                realm.create(name, {key:key,value:value},true);
            })
        }
        
    }

    update=(key,value)=>{
        if(!this.isEmpty(value)){
            realm.write(()=> {
                realm.create(name, {key:key,value:value},true);
            })
        }
    }

    delete=(key)=>{
        realm.write(()=> {
            let infos = realm.objects(name);
            let item = infos.filtered(`key="${key}"`);
            realm.delete(item);
        });
    }

    //清空表
    deleteAll = ()=>{
        realm.write(()=> {
            let infos = realm.objects(name);
            realm.delete(infos);
        });
    }
    query =(key)=>{
            let infos = realm.objects(name);
            let item = infos.filtered(`key="${key}"`);
            if(this.isEmpty(item)){
                return null;
            }
            return item[0].value;
    }
    
    queryAll = ()=>{
        let infos = realm.objects(name);
        // console.log('--------------------------------')
        // console.log(infos.length)
        // console.log(infos)
        let ret = [];
        for( let i=0;i<infos.length;i++){
            ret[i] = JSON.parse(infos[i].value);
        }
        
        return ret;
    }

    
}

