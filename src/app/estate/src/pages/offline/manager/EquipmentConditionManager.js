
import * as API from 'app-api';
import EquipmentConditionHandler from '../handler/EquipmentConditionHandler';

let handler = null;
/**
 * 材设清单 条件选择下载
 */
export default class EquipmentConditionManager {
    
    constructor(name,realm){
        handler = new EquipmentConditionHandler(name,realm);
    }
 
    //获取所有下载记录
    getAllRecords=()=>{
        let infos = handler.queryAll();
        return  infos;
    }
    
    //保存到数据库
    saveRecord=(key,value)=>{
        handler.insert(key,value);
    }

    //删除全部记录
    deleteAll=()=>{
        handler.deleteAll();
    }

    
}
