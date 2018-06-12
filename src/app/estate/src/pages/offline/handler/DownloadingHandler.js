
import BaseHandler from './BaseHandler';

//材设清单下载条件

let name = null;
let realm = null;
export default class DownloadingHandler extends BaseHandler{

    constructor(eName,eRealm){
        super();
        name = eName;
        realm = eRealm;
        
    }

    
    insert=(key,value,downloading)=>{
        if(!this.isEmpty(value)){
            realm.write(()=> {
                realm.create(name, {key:key,value:value,downloading:downloading},true);
            })
        }
        
    }

    update=(key,value,downloading)=>{
        if(!this.isEmpty(value)){
            realm.write(()=> {
                realm.create(name, {key:key,value:value,downloading:downloading},true);
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
        let downloading = 'true';
        let list = infos.filtered(`downloading="${downloading}"`)
        // console.log('--------------------------------')
        // console.log(infos.length)
        // console.log(infos)
        let ret = [];
        for( let i=0;i<list.length;i++){
            ret[i] = JSON.parse(list[i].value);
        }
        
        return ret;
    }

    
}

