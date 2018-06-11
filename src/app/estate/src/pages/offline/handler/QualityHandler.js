import BaseHandler from './BaseHandler';

//质量  列表 详情 编辑信息表


let name = null;
let realm = null;
export default class BasicInfoHandler extends BaseHandler{

    constructor(eName,eRealm){
        super();
        name = eName;
        realm = eRealm;
    }

    
    insert=(key,value,qcState,qualityCheckpointId,updateTime,submitState,errorMsg)=>{
        if(!this.isEmpty(value)){
            realm.write(()=> {
                realm.create(name, {key:key,value:value,qcState:qcState,qualityCheckpointId:qualityCheckpointId,updateTime:updateTime,submitState:submitState,errorMsg:errorMsg},true);
            })
        }
        
    }

    update=(key,value,qcState,qualityCheckpointId,updateTime,submitState,errorMsg)=>{
        if(!this.isEmpty(value)){
            realm.write(()=> {
                realm.create(name, {key:key,value:value,qcState:qcState,qualityCheckpointId:qualityCheckpointId,updateTime:updateTime,submitState:submitState,errorMsg:errorMsg},true);
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
        console.log('----------------------all-----------------------')
        console.log(infos.length)
        let ret = [];
        for( let i=0;i<infos.length;i++){
            ret[i] = JSON.parse(infos[i].value);
            console.log(i+' '+infos[i].key+' '+infos[i].updateTime+' '+infos[i].qualityCheckpointId+' '+infos[i].qcState)
        }
        return infos;
    }


    //根据page size 倒叙 查数据
    queryList = (qcState,page,size,qualityCheckpointId)=>{
        let infos = realm.objects(name).sorted('updateTime',true);
        let qcStateList = null;
        if(qcState){
            qcStateList = infos.filtered(`qcState="${qcState}"`)
        }else{
            qcStateList = infos;
        }
        let checkList = null;
        if(qualityCheckpointId){
            checkList = qcStateList.filtered(`qualityCheckpointId="${qualityCheckpointId}"`)
        }else{
            checkList = qcStateList;
        }
        let objList = checkList.slice(page*size,(page+1)*size);
        let list = null;
        if(objList && objList.length>0){
            list = Array.from(objList, (item) => {
                obj = JSON.parse(item.value)
                return obj.item
            })
        }
        // console.log('----------------------all-----------------------')
        // console.log(list.length)
        // let ret = [];
        // for( let i=0;i<list.length;i++){
        //     // ret[i] = JSON.parse(list[i].value);
        //     // console.log(i+' '+list[i].key+' '+list[i].updateTime+' '+list[i].qualityCheckpointId+' '+list[i].qcState)
        //     console.log(list[i])
        // }
        return list;
    }
    
}

