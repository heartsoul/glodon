
import API from 'app-api';
import QualityConditionHandler from '../handler/QualityConditionHandler';

let handler = null;
/**
 * 质检清单 条件选择下载
 */
export default class QualityConditionManager {
    
    constructor(name,realm){
        handler = new QualityConditionHandler(name,realm);
    }
 
    //获取所有质检下载记录
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
