import BaseHandler from './BaseHandler';
import { APP_COLOR_ITEM } from 'app-api';

//基础信息包

let name = null;
let realm = null;
export default class ModelHandler extends BaseHandler{


    constructor(baseInfoname,baseInfoRealm){
        super();
        name = baseInfoname;
        realm = baseInfoRealm;
    }

    
    insert=(key,value,projectVersionId,fileId,parentId,progress,total,done,size,updateTime,item)=>{
        if(!this.isEmpty(value)){
            realm.write(()=> {
                realm.create(name, {key:key,value:value,projectVersionId:projectVersionId,fileId:fileId,parentId:parentId,progress:progress,total:total,done:done,size:size,updateTime:updateTime,item:item});
                
            })
        }
        
    }

    update=(key,value,projectVersionId,fileId,parentId,progress,total,done,size,updateTime,item)=>{
        if(!this.isEmpty(value)){
            realm.write(()=> {
                realm.create(name, {key:key,value:value,projectVersionId:projectVersionId,fileId:fileId,parentId:parentId,progress:progress,total:total,done:done,size:size,updateTime:updateTime,item:item},true);
                
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
            return item[0];
    }
    
    queryAll = ()=>{
        let infos = realm.objects(name);
        return infos;
    }

    //获取下载队列
    queryUpdateQueue=()=>{
        let infos = realm.objects(name).sorted('updateTime');
        let done = 'false';
        let queue = infos.filtered(`done="${done}"`);
        return queue;
    }

    //获取所有已下载的模型文件记录
    queryModelSize=()=>{
        let infos = realm.objects(name);
        let done = 'true';
        let queue = infos.filtered(`done="${done}"`);
        return queue;
    }
}

