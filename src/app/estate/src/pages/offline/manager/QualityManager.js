import { DeviceEventEmitter } from 'app-3rd'
import * as API from 'app-api';
import QualityHandler from '../handler/QualityHandler';
import DownloadImg from '../model/DownloadImg';
import OfflineManager from './OfflineManager';


let handler = null;
let projectId ;
let projectVersionId ;
let downloadingManager = null;
/**
 * 质量相关下载
 */
export default class QualityManager {
    
    constructor(name,realm){
        handler = new QualityHandler(name,realm);
        projectId = storage.loadProject();
        projectVersionId = storage.getLatestVersionId(projectId);
        // projectVersionId = storage.projectIdVersionId;
        
    }
 
     //从数据库获取
     _getFromDb=(key)=>{
         let info = handler.query(key);
         return new Promise((resolve,reject)=>{
            let infos = JSON.parse(info);
            resolve(infos);
        });
     }

     //从数据库获取
     _getFromDbJson=(key)=>{
        let info = handler.query(key);
        return JSON.parse(info);
    }
    

    //获取质量列表 根据状态  页数   质检项目查询
    getQualityList=(qcState,page,size,checkpointId=0)=>{
        let result = handler.queryList(qcState,page,size,checkpointId);
        return new Promise((resolve,reject)=>{
            resolve(result);
            
        });
    }

        
    //获取质量详情
    getQualityDetail=(id)=>{
        let info = handler.query(id);
        let obj = JSON.parse(info);
        return new Promise((resolve,reject)=>{
            resolve(obj.detail);
            
        });
    }

    //获取检查单编辑状态信息
    getQualityEdit=(id)=>{
        let info = handler.query(id);
        let obj = JSON.parse(info);
        return new Promise((resolve,reject)=>{
            resolve(obj.editInfo);
        });
    }

    //获取整改单编辑信息
    getRepairEditInfo=(id)=>{
        let info = handler.query(id);
        let obj = JSON.parse(info);
        return new Promise((resolve,reject)=>{
            resolve(obj.repairInfo);
            
        });
    }

    //获取复查单编辑信息
    getReviewEditInfo=(id)=>{
        let info = handler.query(id);
        let obj = JSON.parse(info);
        return new Promise((resolve,reject)=>{
            resolve(obj.reviewInfo);
            
        });
    }

    

    //下载单据信息
    download = (startTime=0,endTime=0,qcState='',downloadKey,record) => {
        //保存到数据库
        let _saveToDb=(key,value,qcState,qualityCheckpointId,updateTime,submitState,errorMsg)=>{
            handler.update(key,value,qcState,qualityCheckpointId,updateTime,submitState,errorMsg);
        }

        downloadingManager = OfflineManager.getDownloadingManager();
        let _saveProgress=(progress,total,size)=>{
            // console.log('key='+downloadKey+'  progress='+progress+'  total='+total+' size='+size);
            record.size = size;
            record.progress = progress;
            record.total = total;

            let downloading = progress<total?'true':'false';
            if(progress>total){
                progress = total;
            }
            downloadingManager.saveRecord(downloadKey,JSON.stringify(record),downloading);

            if(progress == total){
                //下载完毕  存储到已下载列表
                let qualityConditionManager = OfflineManager.getQualityConditionManager();
                qualityConditionManager.saveRecord(downloadKey,JSON.stringify(record));
                //从下载中删除
                downloadingManager.delete(downloadKey);
            }
            DeviceEventEmitter.emit(downloadKey,record);
        }
         
        //质检单下载列表
        //          {"全部", "待提交",  "待整改",       "待复查",      "已检查",      "已复查",    "已延迟",  "已验收"};
        //          {"",     "staged", "unrectified",  "unreviewed",  "inspected",  "reviewed",  "delayed","accepted"};
        let  _getQualityList =(page,size)=>{
            return API.getQualityInspectionAllByDate(projectId, qcState,page,size,startTime,endTime).then(
                (responseData) => {
                // { data:
                //    { content: [],
                //       last: true,
                //       totalPages: 0,
                //       totalElements: 0,
                //       sort:
                //        [ { direction: 'DESC',
                //            property: 'updateTime',
                //            ignoreCase: false,
                //            nullHandling: 'NATIVE',
                //            ascending: false,
                //            descending: true } ],
                //       first: true,
                //       numberOfElements: 0,
                //       size: 30,
                //       number: 0 } }
                    // console.log('质检单下载列表 start--------------');
                    // console.log(responseData); //
                    // console.log('质检单下载列表 end--------------');
                    if(responseData && responseData.data && responseData.data.content && responseData.data.content.length>0){
                        return {list:responseData.data.content,totalPages:responseData.data.totalPages};
                    }
                    return null;
                }
            ).catch(error => {
                console.log(error)
            });
        }
        //质检单详情下载
        let  _getQualityDetail=(id)=> {
            return  API.getQualityInspectionDetail(projectId, id).then((responseData) => {
                // console.log('质检单详情 start--------------');
                // console.log(responseData); //
                // console.log('质检单详情 end--------------');
                if(responseData && responseData.data ){
                    return responseData.data;
                }
                return null;
            }).catch(err => {
                console.log(err)
            });
        }

        //质检单编辑信息
        let  _getQualityEditInfo=(id)=> {
            return  API.getQualityInspectionDetail(projectId, id).then((responseData) => {
                // console.log('质检单编辑信息 start--------------');
                // console.log(responseData); //
                // console.log('质检单编辑信息 end--------------');
                if(responseData && responseData.data && responseData.data.inspectionInfo){
                    return responseData.data.inspectionInfo;
                }
                return null;
            }).catch(err => {
                console.log(err)
            });
        }
        //整改单编辑信息
        let  _getRepairEditInfo=(id)=> {
            return API.getRepairInfo(projectId, id).then((responseData) => {
                // console.log('整改单编辑信息 start--------------');
                // console.log(responseData); //
                // console.log('整改单编辑信息 end--------------');
                if(responseData && responseData.data){
                    return responseData;
                }
                return null;
            }).catch(err => {
                console.log(err)
            });
        }
        //复查单编辑信息
        let  _getReviewEditInfo=(id)=> {
            return API.getReviewInfo(projectId, id).then((responseData) => {
                // console.log('复查单编辑信息 start--------------');
                // console.log(responseData); //
                // console.log('复查单编辑信息 end--------------');
                if(responseData && responseData.data){
                    return responseData;
                }
                return null;
            }).catch(err => {
                console.log(err)
            });
        }

        let detailArr = []//保存详情
        async function download(){
            let page = 0;
            let size = 30;
            let data = await _getQualityList(page,size);
            let qualityList = [];
            if(data && data.list && data.list.length>0){
                qualityList = [...qualityList,...data.list];
                let totalPages = data.totalPages;
                page++;
                //循环取数据
                while(page<totalPages){
                    let d = await _getQualityList(page,size);
                    qualityList = [...qualityList,...d.list];
                    page++;
                }
            }

            if(qualityList && qualityList.length>0){
                let progress = 0;
                let num = qualityList.length;
                let total = num * 5;
                // {"全部","待提交",  "待整改",      "待复查",    "已检查",    "已复查",  "已延迟",  "已验收"};
                // {"",   "staged",  "unrectified","unreviewed","inspected","reviewed","delayed","accepted"};
                // [{ id: 5200303,
                //     code: 'ZLJC_20180517_001',
                //     qcState: 'delayed',
                //     projectId: 5200153,
                //     inspectionDate: 1526486400000,
                //     lastRectificationDate: 1526659200000,
                //     description: 'i fghhh ',
                //     inspectionType: 'inspection',
                //     creatorId: 5200003,
                //     responsibleUserId: 5200007,
                //     updateTime: 1526526006000,
                //     files: [],
                //     needRectification: true }]
                _saveProgress(progress++,total,num);
                for (let item of qualityList){

                    //全部   都有详情
                    let detail = await _getQualityDetail(item.id);
                    _saveProgress(progress++,total,num);
                    detailArr = [...detailArr,detail]
                    //待提交   编辑信息
                    let editInfo = null;
                    if(item.qcState =='staged'){
                        editInfo = await _getQualityEditInfo(item.id);
                    }
                    _saveProgress(progress++,total,num);
                    //待整改   待整改编辑信息
                    let repairInfo = null;
                    if(item.qcState =='unrectified'){
                        repairInfo = await _getRepairEditInfo(item.id);
                    }
                    _saveProgress(progress++,total,num);
                    //待复查   待复查 编辑信息
                    let reviewInfo = null;
                    if(item.qcState =='unreviewed'){
                        reviewInfo = await _getReviewEditInfo(item.id);
                    }
                    _saveProgress(progress++,total,num);
                    let key = item.id+'';
                    let value = {
                        item:item,
                        detail:detail,
                        editInfo:editInfo,
                        repairInfo:repairInfo,
                        reviewInfo:reviewInfo,
                    }
                    let qcState = item.qcState;
                    let qualityCheckpointId =detail.qualityCheckpointId+'';
                    let updateTime = item.updateTime+'';
                    let submitState = '';
                    let errorMsg = '';
                    _saveToDb(key,JSON.stringify(value),qcState,qualityCheckpointId,updateTime,submitState,errorMsg);
                }
                _saveProgress(total,total,num);
            }
            
            return true;
        }
        
         download().then((a)=>{
             console.log('==============downloadOver=====================')
             //缓存图片
            if(detailArr && detailArr.length>0){
                let arr = [];
                for (item of detailArr){
                    // console.log('===================================')
                    // console.log(item.inspectionInfo.files)
                    let files = item.inspectionInfo.files;
                    if(files && files.length>0){
                        for (f of files){
                            arr = [...arr,{fileId:f.objectId,url:f.url}]
                        }
                        
                    }
                    if(item.progressInfos && item.progressInfos.length>0){
                        for(p of item.progressInfos){
                            let files = p.files;
                            if(files && files.length>0){
                                for (f of files){
                                    arr = [...arr,{fileId:f.objectId,url:f.url}]
                                }
                                
                            }
                        }
                    }
                }
                let dli = new DownloadImg();
                dli.download(arr);
            }
        },(e)=>{
            console.log(e);
        });
    }


}
