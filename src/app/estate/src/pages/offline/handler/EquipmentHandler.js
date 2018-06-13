import BaseHandler from './BaseHandler';

//质量  列表 详情 编辑信息表


let name = null;
let realm = null;
export default class EquipmentHandler extends BaseHandler{

    constructor(eName,eRealm){
        super();
        name = eName;
        realm = eRealm;
    }

    
    insert=(key,value,committed,qualified,updateTime,submitState,errorMsg)=>{
        if(!this.isEmpty(value)){
            realm.write(()=> {
                realm.create(name, {key:key,value:value,committed:committed,qualified:qualified,updateTime:updateTime,submitState:submitState,errorMsg:errorMsg},true);
            })
        }
        
    }

    update=(key,value,committed,qualified,updateTime,submitState,errorMsg)=>{
        if(!this.isEmpty(value)){
            realm.write(()=> {
                realm.create(name, {key:key,value:value,committed:committed,qualified:qualified,updateTime:updateTime,submitState:submitState,errorMsg:errorMsg},true);
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
    
    queryAll = (page,size)=>{
        let infos = realm.objects(name).sorted('updateTime',true);
        let objList = infos.slice(page*size,(page+1)*size);
        let list = [];
        if(objList && objList.length>0){
            list = Array.from(objList, (item) => {
                obj = JSON.parse(item.value)
                return obj.item
            })
        }
        // 返回当前page的list  和总数
        return {list:list,total:infos.length};
    }

    //根据page size 倒叙 查数据
    queryCommit = (page,size,committed)=>{
        let infos = realm.objects(name).sorted('updateTime',true);
        let commitList = infos.filtered(`committed="${committed}"`)
        
        let objList = commitList.slice(page*size,(page+1)*size);
        let list = [];
        if(objList && objList.length>0){
            list = Array.from(objList, (item) => {
                obj = JSON.parse(item.value)
                return obj.item
            })
        }
        // 返回当前page的list  和总数
        return {list:list,total:commitList.length};
    }

    //根据page size 倒叙 查数据
    queryQualified = (page,size,qualified)=>{
        let committed = true;
        let infos = realm.objects(name).sorted('updateTime',true);
        let commitList = infos.filtered(`committed="${committed}"`)
        let qualifiedList = commitList.filtered(`qualified="${qualified}"`)
        
        let objList = qualifiedList.slice(page*size,(page+1)*size);
        let list = [];
        if(objList && objList.length>0){
            list = Array.from(objList, (item) => {
                obj = JSON.parse(item.value)
                return obj.item
            })
        }
        // 返回当前page的list  和总数
        return {list:list,total:qualifiedList.length};
    }
    
    
}

