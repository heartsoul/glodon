import BaseHandler from './BaseHandler';

//基础信息包

let name = null;
let realm = null;
export default class BasicInfoHandler extends BaseHandler{


    constructor(baseInfoname,baseInfoRealm){
        super();
        name = baseInfoname;
        realm = baseInfoRealm;
        console.log('name='+name)
    }

    
    insert=(key,value)=>{
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
        return infos;
    }

    
}

