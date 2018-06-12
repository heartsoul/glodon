
import BaseHandler from './BaseHandler';

//质检清单下载条件

let name = null;
let realm = null;
export default class QualityConditionHandler extends BaseHandler{


    constructor(eName,eRealm){
        super();
        name = eName;
        realm = eRealm;
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
        let infos = realm.objects(name).sorted('key',true);
        let ret = [];
        for( let i=0;i<infos.length;i++){
            ret[i] = JSON.parse(infos[i].value);
        }
        
        return ret;
    }

    
}

