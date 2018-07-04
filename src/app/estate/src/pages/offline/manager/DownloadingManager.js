
import API from 'app-api';
import DownloadingHandler from '../handler/DownloadingHandler';

let handler = null;
/**
 * 下载中  进度记录
 */
export default class DownloadingManager {
    
    constructor(name,realm){
        handler = new DownloadingHandler(name,realm);
    }
 

    //清除本表
    clear=()=>{
        handler.deleteAll();
    }
    //获取所有下载记录
    getAllRecords=()=>{
        let infos = handler.queryAll();
        return  infos;
    }
    
    //获取指定的下载记录
    getRecordByKey=(key)=>{
        let info = handler.query(key);
        return JSON.parse(info);
    }

    //保存到数据库
    saveRecord=(key,value,downloading)=>{
        handler.insert(key,value,downloading);
    }

    //删除指定条目
    delete=(key)=>{
        handler.delete(key);
    }
    //删除全部记录
    deleteAll=()=>{
        handler.deleteAll();
    }

    
}
