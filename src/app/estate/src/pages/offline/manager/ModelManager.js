import { RNFS} from 'app-3rd';
import DirManager from '../manager/DirManager';
import * as API from 'app-api';
import ModelHandler from '../handler/ModelHandler';
import {DeviceEventEmitter} from 'app-3rd/index';
import OfflineManager from './OfflineManager';
import DownloadModel from '../model/DownloadModel';

let handler = null;
let projectId ;
let projectVersionId ;
let modelList = null;
/**
 * 模型相关处理
 */
let downloadQueue = [];
let isDownloading = false;

let folderList = [];
let folderItemList = [];
export default class ModelManager {

    constructor(name,realm){
        handler = new ModelHandler(name,realm);
        projectId = storage.loadProject();
        projectVersionId = storage.getLatestVersionId(projectId);
        
        // projectVersionId = storage.projectIdVersionId;
    }


    //清除本表
    clear=()=>{
        handler.deleteAll();
    }
    //将浮点数保留两位
    changeTwoDecimal_f(x) {
        try {
            let f_x1 = parseFloat(x);
            if (isNaN(f_x1)) {
                return x;
            }
            let f_x = Math.round(x * 100) / 100;
            let s_x = f_x.toString();
            let pos_decimal = s_x.indexOf('.');
            if (pos_decimal < 0) {
                pos_decimal = s_x.length;
                s_x += '.';
            }
            while (s_x.length <= pos_decimal + 2) {
                s_x += '0';
            }
            return s_x;
        } catch (e) {
            return '0.00';
        }
    }

    //设为正在下载状态   true正在下载  false未下载
    setDownloadingState(isDownload){
        isDownloading = isDownload;
        if(!isDownloading){
            this.updateDownloadQueue();
        }
    }

    //更新下载队列
    updateDownloadQueue(){
        downloadQueue = handler.queryUpdateQueue();
        if(!isDownloading){
            if(downloadQueue && downloadQueue.length>0){
                let obj = downloadQueue[0];
                if(obj){
                    let p = new Promise((resolve,reject)=>{
                        let dm = new DownloadModel();
                        dm.getToken(obj.fileId,obj.parentId,JSON.parse(obj.item));
                        resolve(1)
                    });
                    p.then((res)=>{
                        console.log(res)
                    }).catch((err)=>{
                        console.log(err)
                    })
                    
                }
            }
        }
    }

    //添加到下载队列
    addToDownloadQueue=(key,value,projectVersionId,fileId,parentId,progress,total,done,size,updateTime,item)=>{
        let obj = this.queryByKey(key);
        if(!obj){
            handler.update(key,value,projectVersionId,fileId,parentId,progress,total,done,size,updateTime,item)
            // this.updateDownloadQueue();
            //发送单个文件的emitter
            DeviceEventEmitter.emit(key, { 
                key: key,
                value: value,
                projectVersionId: projectVersionId+'',
                fileId: fileId+'',
                parentId:parentId+'',
                progress: progress+'',
                total: total+'',
                done: done+'',
                size: size+'',
                updateTime:updateTime,
                item:JSON.parse(item),
            });
        }
        
    }


    //往数据库更新模型下载进度的数据
    update=(key,value,projectVersionId,fileId,parentId,progress,total,done,size,updateTime,item)=>{
        handler.update(key,value,projectVersionId,fileId,parentId,progress,total,done,size,updateTime,item)
        //发送单个文件的emitter
        // DeviceEventEmitter.emit(key, { 
        //     key: key,
        //     value: value,
        //     projectVersionId: projectVersionId+'',
        //     fileId: fileId+'',
        //     parentId:parentId+'',
        //     progress: progress+'',
        //     total: total+'',
        //     done: done+'',
        //     size: size+'',
        //     updateTime:updateTime,
        //     item:JSON.parse(item),
        // });
        //发送文件夹的emmitter
        this.sendFolderEmmiter();
    }

    queryByKey = (key)=>{
        let obj = handler.query(key);
        return obj;
    }

    getDataByParentId = (parentId)=>{
        let list = [];
        let bm = OfflineManager.getBasicInfoManager();
        modelList = bm.getModelList();
        if(modelList && modelList.length>0){
            for(let item of modelList){
                // console.log(item)
                if(item.parentId == parentId){
                    if(item.folder){
                        let result = this._getChildren(item.fileId);
                        list = [...list,...result]
                    }else{
                        list = [...list,item];
                    }
                }
                
            }
        }
        return list;
    }

    _getChildren=(parentId)=>{
        let list = [];
        if(modelList && modelList.length>0){
            for(let item of modelList){
                if(item.parentId == parentId){
                    if(item.folder){
                        let result = this._getChildren(item.fileId);
                        list = [...list,...result]
                    }else{
                        list = [...list,item];
                    }
                }
                
            }
        }
        
        return list;
    }


    getFolderList=()=>{
        if(folderList && folderList.length==0){
            let bm = OfflineManager.getBasicInfoManager();
            modelList = bm.getModelList();
            if(modelList&&modelList.length>0){
                for (let item of modelList){
                    if(item.folder){
                        folderList = [...folderList,item];
                    }
                }
                let folderContentList = [];
                if(folderList&&folderList.length>0){
                    for( let item of folderList){
                        let list = this.getDataByParentId(item.fileId);//获取每个文件夹下都有哪些模型文件  包括子文件夹下的模型文件
                        folderItemList = [...folderItemList,list]
                    }
                }
            }
            
        }
        return {
            folderList:folderList,
            folderItemList:folderItemList,
        }
    }

    sendFolderEmmiter =()=>{
        this.getFolderList();
        folderList.forEach((item,index)=>{
            let list = folderItemList[index];//获取每个文件夹下都有哪些模型文件  包括子文件夹下的模型文件
            if(list && list.length>0){
                let progress = 0;
                let total = 0;
                let size = 0;
                let count = 0;
                //查询每个模型文件的  进度  大小
                for (let model of list){
                    let key = model.fileId+'_'+projectVersionId;
                    let obj = this.queryByKey(key);
                    if(obj){
                        progress += Number.parseInt(obj.progress);
                        total += Number.parseInt(obj.total);
                        size += Number.parseFloat(obj.size);
                        count++;
                    }
                    
                }
                size = this.changeTwoDecimal_f(size)
                let key = item.fileId+'_'+projectVersionId;
                // console.log(key+' '+progress+'  '+total)
                let done = false;
                if(progress>0 && total>0 && progress==total && (count==folderList.length)){
                    done = true;
                }
                if(total>0 && progress>0 && (count==folderList.length)){
                    //发送文件夹的 进度变化
                    DeviceEventEmitter.emit(key, { 
                        key: key,
                        // value: value,
                        projectVersionId: projectVersionId+'',
                        fileId: item.fileId+'',
                        parentId:item.parentId+'',
                        progress: progress+'',
                        total: total+'',
                        done: done+'',
                        size: size+'',
                        // updateTime:updateTime,
                        item:item,
                    });
                    // console.log(key+' '+progress+' '+total)
                }
                
            }
        })
        
        

    }

    //获取所有已下载的模型文件列表
    getDownloadedModelList =()=>{
        let bm = OfflineManager.getBasicInfoManager();
        modelList = bm.getModelList();
        let list = [];
        if(modelList && modelList.length>0){
            for(let item of modelList){
                let key = item.fileId+'_'+projectVersionId;
                if(item.folder){
                    if(this.getFolderSize(item.fileId)>0){
                        list = [...list,item]
                    }
                }else{
                    
                    if(this.isDownloaded(key)){
                        list = [...list,item]
                    }
                }
            }
        }
        return list;
    }

    //获取所有的已下载的模型文件的大小
    getDownloadedModelSize=()=>{
        let info = handler.queryModelSize();

        if(info && info.length>0){
            let size = 0;
            info.forEach((item,index)=>{
                let obj = info[index];
                size += Number.parseFloat(obj.size)
            })
            return this.changeTwoDecimal_f(size);
        }

        return 0;
    }

    //获取该文件夹下 已下载的模型文件的大小
    getFolderSize = (parentId)=>{
        let list = this.getDataByParentId(parentId);//获取每个文件夹下都有哪些模型文件  包括子文件夹下的模型文件
        if(list && list.length>0){
            // let progress = 0;
            // let total = 0;
            let size = 0;
            //查询每个模型文件的  进度  大小
            for (let model of list){
                let key = model.fileId+'_'+projectVersionId;
                let obj = this.queryByKey(key);
                if(obj && obj.done=='true'){
                    // progress += Number.parseInt(obj.progress);
                    // total += Number.parseInt(obj.total);
                    size += Number.parseFloat(obj.size);
                }
                
            }
            size = this.changeTwoDecimal_f(size);
            return size;
        }
        return 0;
    }


    //获取模型文件的大小
    getFileSize=(fileId)=>{
        let key = fileId+'_'+projectVersionId;
        let info = handler.query(key);
        if(info){
            return info.size;
        }
        return 0;
    }

    //判断文件夹内是否已经完成下载
    isFolderDownloaded=(parentId)=>{
        console.log('isFolderDownloaded'+parentId)
        let list = this.getDataByParentId(parentId);//获取每个文件夹下都有哪些模型文件  包括子文件夹下的模型文件
        // console.log(list)
        if(list && list.length>0){
            let progress = 0;
            let total = 0;
            let size = 0;
            let count = 0;
            //查询每个模型文件的  进度  大小
            for (let model of list){
                let key = model.fileId+'_'+projectVersionId;
                let obj = this.queryByKey(key);
                if(obj){
                    progress += Number.parseInt(obj.progress);
                    total += Number.parseInt(obj.total);
                    size += Number.parseFloat(obj.size);
                    count++;
                }
                
            }
            let key = parentId+'_'+projectVersionId;
            let done = false;
            console.log(key)
            console.log(progress+' '+total+' '+count+' '+list.length)
            if(progress>0 && total>0 && progress==total && (count==list.length)){
                done = true;
            }
            return {
                progress:progress,
                total:total,
                size:size,
                done:done,
            }
        }
    }

    //根据fileid和版本  判断是否已经下载了离线包
    //key= fileId+'_'+projectVersionId
    isDownloaded = (key)=>{
        // console.log('key=')
        // console.log(key)
        let info = handler.query(key);
        if(info){
            let done = info.done;
            return done=='true';
        }
        return false;
    }
    //如何使用：
    // let fileId = '1353300132668256';
    // let mm = new ModelManager();
    //     mm.exist(fileId).then((res)=>{
    //         console.log(res);true /false
    //     }).catch((error) => {
    //         console.log(error);
    //     })
    
    //模型文件是否已经下载离线包
    exist = (fileId) => {
        let dm = new DirManager();
        let name = storage.getModelFileIdOfflineName(fileId)
        let path = dm.getModelPath()+'/'+name;
        return RNFS.exists(path);
    }

    //删除模型文件的离线包
    deleteByFileId=(fileId)=>{
        let dm = new DirManager();
        let name = storage.getModelFileIdOfflineName(fileId)
        let path = dm.getModelPath()+'/'+name;
        //删除文件
        RNFS.unlink(path)
            .then(() => {
                console.log('FILE DELETED');
            })
            // `unlink` will throw an error, if the item to unlink does not exist
            .catch((err) => {
                console.log(err.message);
            });
        //数据库删除信息
        let key = fileId+'_'+projectVersionId;
        handler.delete(key);
    }

    //所有模型生成离线包
    createOfflineZips=(items)=>{

        if(items && items.length>0){
            for (let item of items){
                if(!item.folder){
                    // console.log('item=')
                    // console.log(item)
                    let fileId = item.fileId;
                    API.createModelOfflineZip(fileId,item.workspaceId)
                    .then((responseJson) => {
                        //失败
                        // I/ReactNativeJS( 1123): { data:
                        //     I/ReactNativeJS( 1123):    { code: '0',
                        //     I/ReactNativeJS( 1123):      message: 'success',
                        //     I/ReactNativeJS( 1123):      data:
                        //     I/ReactNativeJS( 1123):       { fileId: 1374812391941536,
                        //     I/ReactNativeJS( 1123):         databagVersion: '3.5',
                        //     I/ReactNativeJS( 1123):         status: 'failed',
                        //     I/ReactNativeJS( 1123):         reason: 'Job in hand, sourceId : [1378993864136448], type : [local-databag], appKey : [aDlPf13UtiGs7yuHCd8eHSLHbHJTU8Sd]',
                        //     I/ReactNativeJS( 1123):         createTime: '2018-06-27 16:25:53' } } }
                       
                       //生成中
                        // : { data:
                        //     I/ReactNativeJS( 1123):    { code: '0',
                        //     I/ReactNativeJS( 1123):      message: 'success',
                        //     I/ReactNativeJS( 1123):      data:
                        //     I/ReactNativeJS( 1123):       { fileId: 1375483632698784,
                        //     I/ReactNativeJS( 1123):         databagVersion: '3.5',
                        //     I/ReactNativeJS( 1123):         status: 'processing',
                        //     I/ReactNativeJS( 1123):         reason: null,
                        //     I/ReactNativeJS( 1123):         createTime: '2018-06-27 16:25:53' } } }

                        //成功
                        // { data:
                        //     I/ReactNativeJS( 1123):    { code: '0',
                        //     I/ReactNativeJS( 1123):      message: 'success',
                        //     I/ReactNativeJS( 1123):      data:
                        //     I/ReactNativeJS( 1123):       { fileId: 1375483752850848,
                        //     I/ReactNativeJS( 1123):         databagVersion: '3.5',
                        //     I/ReactNativeJS( 1123):         status: 'success',
                        //     I/ReactNativeJS( 1123):         reason: null,
                        //     I/ReactNativeJS( 1123):         createTime: '2018-06-27 14:03:17' } } }
                        
                        // console.log('生成离线包')
                        // console.log(responseJson)
                    }).catch((err)=>{
                        console.log('生成离线包  err')
                        console.log(err)
                    });
                }
                
            }
        }
    }
    
}
