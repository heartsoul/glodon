
import BaseHandler from './BaseHandler';

//同步列表  离线进程跟踪

let name = null;
let realm = null;
export default class AsyncHandler extends BaseHandler{

    constructor(eName,eRealm){
        super();
        name = eName;
        realm = eRealm;
        
    }

    // key:'string',//单据的id
    // value:'string',//展示的列表信息
    // state:'string',//单据状态  待同步   已成功  已失败
    // updateTime:'string',//更新时间
    // type:'string',//单据类型  quality质量   equipment材设
    insert=(key,value,state,updateTime)=>{
        if(!this.isEmpty(value)){
            realm.write(()=> {
                realm.create(name, {key:key,value:value,state:state,updateTime:updateTime},true);
            })
        }
        
    }

    update=(key,value,state,updateTime)=>{
        if(!this.isEmpty(value)){
            realm.write(()=> {
                realm.create(name, {key:key,value:value,state:state,updateTime:updateTime},true);
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
    
    //根据状态查询   待处理  已成功  已失败
    queryByState = (state)=>{
        let infos = realm.objects(name).sorted('updateTime',true);
        let stateList = infos.filtered(`state="${state}"`)
        let ret = [];
        for( let i=0;i<stateList.length;i++){
            ret[i] = JSON.parse(stateList[i].value);
        }
        
        return ret;
    }

    
}

