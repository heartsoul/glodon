import { DeviceEventEmitter } from 'app-3rd'
import * as API from 'app-api';
import QualityHandler from '../handler/QualityHandler';
import DownloadImg from '../model/DownloadImg';
import OfflineManager from './OfflineManager';
import * as CONSTANT from "../../common/service/api+constant"

let handler = null;
let projectId ;
let projectVersionId ;
let downloadingManager = null;
let asyncManager = null;
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
 
    _formatDate(timestamp, formater) { 
            let date = new Date();
            date.setTime(parseInt(timestamp));
            formater = (formater != null)? formater : 'yyyy-MM-dd hh:mm';
            Date.prototype.Format = function (fmt) {
              var o = {
                "M+": this.getMonth() + 1, //月
                "d+": this.getDate(), //日
                "h+": this.getHours(), //小时
                "m+": this.getMinutes(), //分
                "s+": this.getSeconds(), //秒
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                "S": this.getMilliseconds() //毫秒
              };
         
              if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
              for (var k in o) {
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ?
                  (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
              }
              return fmt;
            }
            return date.Format(formater);
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
    
    //根据id查询离线建立的单据的参数信息
    getSubmitInfoById =(id)=>{
        let info = handler.query(id);
        let obj = JSON.parse(info);
        return obj.submitInfo;
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
    //获取质量详情
    getQualityDetailObj=(id)=>{
        let info = handler.query(id);
        let obj = JSON.parse(info);
        return obj.detail;
    }

    //获取检查单编辑状态信息
    getQualityEdit=(id)=>{
        return this.getQualityDetail(id);
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

    // let key = item.id+'';
    // let value = {
    //     item:item,
    //     detail:detail,
    //     editInfo:editInfo,
    //     repairInfo:repairInfo,
    //     reviewInfo:reviewInfo,
    //     submitInfo:'',//提交、保存时保存的参数
    // }
    // let qcState = item.qcState;
    // let qualityCheckpointId =detail.qualityCheckpointId+'';
    // let updateTime = item.updateTime+'';
    // let submitState = '';  
    // let errorMsg = '';

    //submitState: qnsubmit质检单 新建 提交  qnsave 质检单 新建保存  qesubmit质检单编辑提交  qesave质检单 编辑 保存  qdelete质检单 编辑时 删除  
    //submitState: znsubmit 整改单 新建 提交  znsave 整改单 新建 保存  zesubmit 整改单 编辑 提交  zesave 整改单 编辑 保存  zdelete 整改单  删除
    //submitState: fnsubmit 复查单 新建 提交  fnsave 复查单 新建 保存  fesubmit 复查单 编辑 提交  fesave 复查单 编辑 保存  fdelete 复查单  删除
    //新建检查单、整改单、复查单后保存到数据库
    insert=(key,value,qcState,qualityCheckpointId,updateTime,submitState,errorMsg)=>{
        handler.update(key,value,qcState,qualityCheckpointId,updateTime,submitState,errorMsg);
    }

    delete=(key)=>{
        handler.delete(key);
    }
    
    /**
     * 检查单 新增 提交
     *  props {
        * "constructionCompanyId":5212715,
        * "constructionCompanyName":"施工单位A",
        * "description":"1111111\n",
        * "code":"",
        * "inspectionCompanyId":5211919,
        * "inspectionCompanyName":"11301919",
        * "inspectionType":"inspection",
        * "needRectification":true,
        * "lastRectificationDate":1529028540278,
        * "projectId":"5213135",
        * "projectName":"APP材设",
        * "qualityCheckpointId":5200243,
        * "qualityCheckpointName":"管道（暖）",
        * "responsibleUserId":5200299,
        * "responsibleUserName":"XP",
        * "responsibleUserTitle":"总工",
        * "files":[]
     * }
     */
    createSubmitInspection(projectId, inspectionType, props){
        let date = new Date();
        let creatorId = storage.loadTenant();//当前用户在当前租户下的id
        let id = '_'+date.getTime();
        let qcstate = CONSTANT.QC_STATE_Q_NEW_SUBMIT;
        //列表显示的信息
        let item = {
            id: id,
            code: props.code,
            qcState: qcstate,
            projectId: projectId,
            inspectionDate: date.getTime(),
            lastRectificationDate: props.lastRectificationDate,
            description: props.description,
            inspectionType: props.inspectionType,
            creatorId: creatorId,
            responsibleUserId: props.responsibleUserId,
            updateTime: date.getTime(),
            files: props.files,
            needRectification: props.needRectification,
        }

        let detail = { 
            data:
               { 
                   inspectionInfo:
                        {   
                            id: id,
                            code: props.code,
                            qcState: qcstate,
                            projectId: props.projectId,
                            projectName: props.projectName,
                            inspectionDate: date.getTime(),
                            creatorId: creatorId,
                            creatorName: storage.loadUserInfo().accountInfo.name,
                             //检查单位
                            inspectionCompanyId: props.inspectionCompanyId,
                            inspectionCompanyName: props.inspectionCompanyName,
                            //质检项目
                            qualityCheckpointId:props.qualityCheckpointId,
                            qualityCheckpointName:props.qualityCheckpointName,
                            //施工单位
                            constructionCompanyId:props.constructionCompanyId,
                            constructionCompanyName:props.constructionCompanyName,
                            //整改期限
                            needRectification: props.needRectification,
                            lastRectificationDate: props.lastRectificationDate,
                            //描述及图片
                            description: props.description,
                            inspectionType: props.inspectionType,
                            files: [],
                            //责任人
                            responsibleUserId:props.responsibleUserId,
                            responsibleUserName:props.responsibleUserName,
                            responsibleUserTitle: props.responsibleUserTitle,
                            //模型
                            gdocFileId: props.gdocFileId,
                            buildingId: props.buildingId,
                            buildingName: props.buildingName,
                            elementId: props.elementId,
                            elementName: props.elementName,
                            //图纸
                            drawingGdocFileId: props.drawingGdocFileId,
                            drawingName: props.drawingName,
                            drawingPositionX: props.drawingPositionX,
                            drawingPositionY: props.drawingPositionY,
                            //岗位
                            inspectionUserTitle:'',
                            createTime: date.getTime(),
                            updateTime: date.getTime(),
                            commitTime: date.getTime(),
                            committed: false 
                        },
                    progressInfos:[]
                }
            }

        let submitInfo = {
            projectId:projectId, 
            inspectionType:inspectionType, 
            props:props
        }

        let key = item.id+'';
        let value = {
            item:item,
            detail:detail,
            editInfo:'',
            repairInfo:'',
            reviewInfo:'',
            submitInfo:submitInfo,//提交、保存时保存的参数
        }
        let qcState = item.qcState;
        let qualityCheckpointId =detail.qualityCheckpointId+'';
        let updateTime = item.updateTime+'';
        let submitState = 'true';  //表示此条数据有需要提交到服务器的操作
        let errorMsg = '';

        //保存到单据列表
        this.insert(key,JSON.stringify(value),qcState,qualityCheckpointId,updateTime,submitState,errorMsg);
        // console.log(item)
        // console.log(detail)

        //保存到同步列表
        // key:'string',//单据的id
        // value:'string',//展示的列表信息
        // state:'string',//单据状态  待同步   已同步  同步失败
        // updateTime:'string',//更新时间
        // type:'string',//单据类型  quality质量   equipment材设
        let state = '待同步';
        let asyncValue = {
            id:key,
            title:props.code,
            subTitle:this._formatDate(updateTime),
            state:state,
            type:'quality',
            qcState:qcState,
        }
        asyncManager = OfflineManager.getAsyncManager();
        asyncManager.saveRecord(key,JSON.stringify(asyncValue),state,updateTime);

       return new Promise(function(resolve, reject) {
        let data ={
            data:{
                code:'code',
                id:'123'
            }
        }
        resolve(data);
      });
    }

    /**
     * 检查单 新增 保存
     *  props {
        * "constructionCompanyId":5212715,
        * "constructionCompanyName":"施工单位A",
        * "description":"1111111\n",
        * "code":"",
        * "inspectionCompanyId":5211919,
        * "inspectionCompanyName":"11301919",
        * "inspectionType":"inspection",
        * "needRectification":true,
        * "lastRectificationDate":1529028540278,
        * "projectId":"5213135",
        * "projectName":"APP材设",
        * "qualityCheckpointId":5200243,
        * "qualityCheckpointName":"管道（暖）",
        * "responsibleUserId":5200299,
        * "responsibleUserName":"XP",
        * "responsibleUserTitle":"总工",
        * "files":[]
     * }
     */
    createSaveInspection(projectId, inspectionType, props){
        // console.log('333333333333333333333')
        // console.log(props)
        let date = new Date();
        let creatorId = storage.loadTenant();//当前用户在当前租户下的id

        let id = '_'+date.getTime();
        if(props.inspectId){
            id = props.inspectId;
        }
        let qcstate = CONSTANT.QC_STATE_Q_NEW_SAVE;
        //列表显示的信息
        let item = {
            id: id,
            code: props.code,
            qcState: qcstate,
            projectId: projectId,
            inspectionDate: date.getTime(),
            lastRectificationDate: props.lastRectificationDate,
            description: props.description,
            inspectionType: props.inspectionType,
            creatorId: creatorId,
            responsibleUserId: props.responsibleUserId,
            updateTime: date.getTime(),
            files: props.files,
            needRectification: props.needRectification,
        }

        let detail = { 
            data:
               { 
                   inspectionInfo:
                        {   
                            id: id,
                            code: props.code,
                            qcState: qcstate,
                            projectId: props.projectId,
                            projectName: props.projectName,
                            inspectionDate: date.getTime(),
                            creatorId: creatorId,
                            creatorName: storage.loadUserInfo().accountInfo.name,
                             //检查单位
                            inspectionCompanyId: props.inspectionCompanyId,
                            inspectionCompanyName: props.inspectionCompanyName,
                            //质检项目
                            qualityCheckpointId:props.qualityCheckpointId,
                            qualityCheckpointName:props.qualityCheckpointName,
                            //施工单位
                            constructionCompanyId:props.constructionCompanyId,
                            constructionCompanyName:props.constructionCompanyName,
                            //整改期限
                            needRectification: props.needRectification,
                            lastRectificationDate: props.lastRectificationDate,
                            //描述及图片
                            description: props.description,
                            inspectionType: props.inspectionType,
                            files: [],
                            //责任人
                            responsibleUserId:props.responsibleUserId,
                            responsibleUserName:props.responsibleUserName,
                            responsibleUserTitle: props.responsibleUserTitle,
                            //模型
                            gdocFileId: props.gdocFileId,
                            buildingId: props.buildingId,
                            buildingName: props.buildingName,
                            elementId: props.elementId,
                            elementName: props.elementName,
                            //图纸
                            drawingGdocFileId: props.drawingGdocFileId,
                            drawingName: props.drawingName,
                            drawingPositionX: props.drawingPositionX,
                            drawingPositionY: props.drawingPositionY,
                            //岗位
                            inspectionUserTitle:'',
                            createTime: date.getTime(),
                            updateTime: date.getTime(),
                            commitTime: date.getTime(),
                            committed: false 
                        },
                    progressInfos:[]
                }
            }

        delete props.inspectId;
        let submitInfo = {
            projectId:projectId, 
            inspectionType:inspectionType, 
            props:props
        }

        let key = item.id+'';
        let value = {
            item:item,
            detail:detail,
            editInfo:detail,
            repairInfo:'',
            reviewInfo:'',
            submitInfo:submitInfo,//提交、保存时保存的参数
        }
        let qcState = item.qcState;
        let qualityCheckpointId =detail.qualityCheckpointId+'';
        let updateTime = item.updateTime+'';
        let submitState = 'true';  //表示此条数据有需要提交到服务器的操作
        let errorMsg = '';

        //保存到单据列表
        this.insert(key,JSON.stringify(value),qcState,qualityCheckpointId,updateTime,submitState,errorMsg);
        // console.log(item)
        // console.log(detail)

        //保存到同步列表
        // key:'string',//单据的id
        // value:'string',//展示的列表信息
        // state:'string',//单据状态  待同步   已同步  同步失败
        // updateTime:'string',//更新时间
        // type:'string',//单据类型  quality质量   equipment材设
        let state = '待同步';
        let asyncValue = {
            id:key,
            title:props.code,
            subTitle:this._formatDate(updateTime),
            state:state,
            type:'quality',
            qcState:qcState,
        }
        asyncManager = OfflineManager.getAsyncManager();
        asyncManager.saveRecord(key,JSON.stringify(asyncValue),state,updateTime);

       return new Promise(function(resolve, reject) {
        let data ={
            data:{
                code:id,
                id:id
            }
        }
        resolve(data);
      });
    }

    //检查单 编辑 提交
    editSubmitInspection(projectId, fileId, inspectionType, props){
        // console.log('fileid='+fileId)
        // console.log(props)
        let date = new Date();
        let creatorId = props.creatorId;//当前用户在当前租户下的id
        let id = fileId;
        let qcstate = CONSTANT.QC_STATE_Q_EDIT_SUBMIT;
        //列表显示的信息
        let item = {
            id: id,
            code: props.code,
            qcState: qcstate,
            projectId: projectId,
            inspectionDate: props.inspectionDate,
            lastRectificationDate: props.lastRectificationDate,
            description: props.description,
            inspectionType: props.inspectionType,
            creatorId: creatorId,
            responsibleUserId: props.responsibleUserId,
            updateTime: date.getTime(),
            files: props.files,
            needRectification: props.needRectification,
        }
        console.log('1')
        let detail = { 
            data:
               { 
                   inspectionInfo:
                        {   
                            id: id,
                            code: props.code,
                            qcState: qcstate,
                            projectId: props.projectId,
                            projectName: props.projectName,
                            inspectionDate: props.inspectionDate,
                            creatorId: creatorId,
                            creatorName: props.creatorName,
                             //检查单位
                            inspectionCompanyId: props.inspectionCompanyId,
                            inspectionCompanyName: props.inspectionCompanyName,
                            //质检项目
                            qualityCheckpointId:props.qualityCheckpointId,
                            qualityCheckpointName:props.qualityCheckpointName,
                            //施工单位
                            constructionCompanyId:props.constructionCompanyId,
                            constructionCompanyName:props.constructionCompanyName,
                            //整改期限
                            needRectification: props.needRectification,
                            lastRectificationDate: props.lastRectificationDate,
                            //描述及图片
                            description: props.description,
                            inspectionType: props.inspectionType,
                            files: props.files,
                            //责任人
                            responsibleUserId:props.responsibleUserId,
                            responsibleUserName:props.responsibleUserName,
                            responsibleUserTitle: props.responsibleUserTitle,
                            // //模型
                            gdocFileId: props.gdocFileId,
                            buildingId: props.buildingId,
                            buildingName: props.buildingName,
                            elementId: props.elementId,
                            elementName: props.elementName,
                            //图纸
                            drawingGdocFileId: props.drawingGdocFileId,
                            drawingName: props.drawingName,
                            drawingPositionX: props.drawingPositionX,
                            drawingPositionY: props.drawingPositionY,
                            //岗位
                            inspectionUserTitle:props.inspectionUserTitle,
                            createTime: date.getTime()+'',
                            updateTime: props.updateTime+'',
                            commitTime: date.getTime()+'',
                            committed: props.committed 
                        },
                    progressInfos:[]
                }
            }
            console.log('12')
        let submitInfo = {
            projectId:projectId, 
            inspectionType:inspectionType, 
            props:props
        }
        console.log('2')
        let key = item.id+'';
        let value = {
            item:item,
            detail:detail,
            editInfo:'',
            repairInfo:'',
            reviewInfo:'',
            submitInfo:submitInfo,//提交、保存时保存的参数
        }
        let qcState = item.qcState;
        let qualityCheckpointId =detail.qualityCheckpointId+'';
        let updateTime = item.updateTime+'';
        let submitState = 'true';  //表示此条数据有需要提交到服务器的操作
        let errorMsg = '';
        console.log('insert')
        //保存到单据列表
        this.insert(key,JSON.stringify(value),qcState,qualityCheckpointId,updateTime,submitState,errorMsg);
        // console.log(item)
        // console.log(detail)

        //保存到同步列表
        // key:'string',//单据的id
        // value:'string',//展示的列表信息
        // state:'string',//单据状态  待同步   已同步  同步失败
        // updateTime:'string',//更新时间
        // type:'string',//单据类型  quality质量   equipment材设
        let state = '待同步';
        let asyncValue = {
            id:key,
            title:props.code,
            subTitle:this._formatDate(updateTime),
            state:state,
            type:'quality',
            qcState:qcState,
        }
        asyncManager = OfflineManager.getAsyncManager();
        asyncManager.saveRecord(key,JSON.stringify(asyncValue),state,updateTime);
        console.log('save')
       return new Promise(function(resolve, reject) {
        let data ={
            data:{
                code:props.code,
                id:id
            }
        }
        console.log(data)
        resolve(data);
      });
    }


    //检查单  编辑  保存
    editSaveInspection(projectId, fileId, inspectionType, props){
        // console.log('fileid='+fileId)
        // console.log(props)
        let date = new Date();
        let creatorId = props.creatorId;//当前用户在当前租户下的id
        let id = fileId;
        let qcstate = CONSTANT.QC_STATE_Q_EDIT_SAVE;
        //列表显示的信息
        let item = {
            id: id,
            code: props.code,
            qcState: qcstate,
            projectId: projectId,
            inspectionDate: props.inspectionDate,
            lastRectificationDate: props.lastRectificationDate,
            description: props.description,
            inspectionType: props.inspectionType,
            creatorId: creatorId,
            responsibleUserId: props.responsibleUserId,
            updateTime: date.getTime(),
            files: props.files,
            needRectification: props.needRectification,
        }
        console.log('1')
        let detail = { 
            data:
               { 
                   inspectionInfo:
                        {   
                            id: id,
                            code: props.code,
                            qcState: qcstate,
                            projectId: props.projectId,
                            projectName: props.projectName,
                            inspectionDate: props.inspectionDate,
                            creatorId: creatorId,
                            creatorName: props.creatorName,
                             //检查单位
                            inspectionCompanyId: props.inspectionCompanyId,
                            inspectionCompanyName: props.inspectionCompanyName,
                            //质检项目
                            qualityCheckpointId:props.qualityCheckpointId,
                            qualityCheckpointName:props.qualityCheckpointName,
                            //施工单位
                            constructionCompanyId:props.constructionCompanyId,
                            constructionCompanyName:props.constructionCompanyName,
                            //整改期限
                            needRectification: props.needRectification,
                            lastRectificationDate: props.lastRectificationDate,
                            //描述及图片
                            description: props.description,
                            inspectionType: props.inspectionType,
                            files: props.files,
                            //责任人
                            responsibleUserId:props.responsibleUserId,
                            responsibleUserName:props.responsibleUserName,
                            responsibleUserTitle: props.responsibleUserTitle,
                            // //模型
                            gdocFileId: props.gdocFileId,
                            buildingId: props.buildingId,
                            buildingName: props.buildingName,
                            elementId: props.elementId,
                            elementName: props.elementName,
                            //图纸
                            drawingGdocFileId: props.drawingGdocFileId,
                            drawingName: props.drawingName,
                            drawingPositionX: props.drawingPositionX,
                            drawingPositionY: props.drawingPositionY,
                            //岗位
                            inspectionUserTitle:props.inspectionUserTitle,
                            createTime: date.getTime()+'',
                            updateTime: props.updateTime+'',
                            commitTime: date.getTime()+'',
                            committed: props.committed 
                        },
                    progressInfos:[]
                }
            }
            console.log('12')
        let submitInfo = {
            projectId:projectId, 
            inspectionType:inspectionType, 
            props:props
        }
        console.log('2')
        let key = item.id+'';
        let value = {
            item:item,
            detail:detail,
            editInfo:detail,
            repairInfo:'',
            reviewInfo:'',
            submitInfo:submitInfo,//提交、保存时保存的参数
        }
        let qcState = item.qcState;
        let qualityCheckpointId =detail.qualityCheckpointId+'';
        let updateTime = item.updateTime+'';
        let submitState = 'true';  //表示此条数据有需要提交到服务器的操作
        let errorMsg = '';
        console.log('insert')
        //保存到单据列表
        this.insert(key,JSON.stringify(value),qcState,qualityCheckpointId,updateTime,submitState,errorMsg);
        // console.log(item)
        // console.log(detail)

        //保存到同步列表
        // key:'string',//单据的id
        // value:'string',//展示的列表信息
        // state:'string',//单据状态  待同步   已同步  同步失败
        // updateTime:'string',//更新时间
        // type:'string',//单据类型  quality质量   equipment材设
        let state = '待同步';
        let asyncValue = {
            id:key,
            title:props.code,
            subTitle:this._formatDate(updateTime),
            state:state,
            type:'quality',
            qcState:qcState,
        }
        asyncManager = OfflineManager.getAsyncManager();
        asyncManager.saveRecord(key,JSON.stringify(asyncValue),state,updateTime);
        console.log('save')
       return new Promise(function(resolve, reject) {
        let data ={
            data:{
                code:props.code,
                id:id
            }
        }
        console.log(data)
        resolve(data);
      });
    }

    //检查单 删除
    createDeleteInspection(projectId, inspectionType, fileId){
        console.log('fileid='+fileId)
        let date = new Date();
        let qcstate = CONSTANT.QC_STATE_Q_DELETE;
        let updateTime = date.getTime()+'';
        let detail = this.getQualityDetailObj(fileId+'')
        console.log(detail)
        let id = fileId+'';
        if(id.startsWith('_')){
            //如果以_开头，则表示是离线时建立的  则直接删除同步列表即可
            let asyncManager = OfflineManager.getAsyncManager();
            asyncManager.deleteByKey(fileId+'');
            //单据列表中删除
            this.delete(id);
            return new Promise(function(resolve, reject) {
                let data ={
                    data:{
                        msg:'msg'
                    }
                }
                resolve(data);
            });
        }
        let props = detail.data.inspectionInfo;
        //列表显示的信息
        let item = {
            id: id,
            code: props.code,
            qcState: qcstate,
            projectId: projectId,
            inspectionDate: props.inspectionDate,
            lastRectificationDate: props.lastRectificationDate,
            description: props.description,
            inspectionType: props.inspectionType,
            creatorId: props.creatorId,
            responsibleUserId: props.responsibleUserId,
            updateTime: date.getTime()+'',
            files: props.files,
            needRectification: props.needRectification,
        }
        console.log('1')
        let detailInfo = { 
            data:
               { 
                   inspectionInfo:
                        {   
                            id: id,
                            code: props.code,
                            qcState: qcstate,
                            projectId: props.projectId,
                            projectName: props.projectName,
                            inspectionDate: props.inspectionDate,
                            creatorId: props.creatorId,
                            creatorName: props.creatorName,
                             //检查单位
                            inspectionCompanyId: props.inspectionCompanyId,
                            inspectionCompanyName: props.inspectionCompanyName,
                            //质检项目
                            qualityCheckpointId:props.qualityCheckpointId,
                            qualityCheckpointName:props.qualityCheckpointName,
                            //施工单位
                            constructionCompanyId:props.constructionCompanyId,
                            constructionCompanyName:props.constructionCompanyName,
                            //整改期限
                            needRectification: props.needRectification,
                            lastRectificationDate: props.lastRectificationDate,
                            //描述及图片
                            description: props.description,
                            inspectionType: props.inspectionType,
                            files: props.files,
                            //责任人
                            responsibleUserId:props.responsibleUserId,
                            responsibleUserName:props.responsibleUserName,
                            responsibleUserTitle: props.responsibleUserTitle,
                            // //模型
                            gdocFileId: props.gdocFileId,
                            buildingId: props.buildingId,
                            buildingName: props.buildingName,
                            elementId: props.elementId,
                            elementName: props.elementName,
                            //图纸
                            drawingGdocFileId: props.drawingGdocFileId,
                            drawingName: props.drawingName,
                            drawingPositionX: props.drawingPositionX,
                            drawingPositionY: props.drawingPositionY,
                            //岗位
                            inspectionUserTitle:props.inspectionUserTitle,
                            createTime: date.getTime()+'',
                            updateTime: props.updateTime+'',
                            commitTime: date.getTime()+'',
                            committed: props.committed 
                        },
                    progressInfos:[]
                }
            }
            console.log('12')
        let submitInfo = {
            projectId:projectId, 
            inspectionType:inspectionType, 
            fileId:fileId
        }
        console.log('2')
        let key = item.id+'';
        let value = {
            item:item,
            detail:detailInfo,
            editInfo:detailInfo,
            repairInfo:'',
            reviewInfo:'',
            submitInfo:submitInfo,//提交、保存时保存的参数
        }
        let qcState = item.qcState;
        let qualityCheckpointId =detail.qualityCheckpointId+'';
        let submitState = 'true';  //表示此条数据有需要提交到服务器的操作
        let errorMsg = '';
        console.log('insert')
        //保存到单据列表
        this.insert(key,JSON.stringify(value),qcState,qualityCheckpointId,updateTime,submitState,errorMsg);
        // console.log(item)
        // console.log(detail)

        //保存到同步列表
        // key:'string',//单据的id
        // value:'string',//展示的列表信息
        // state:'string',//单据状态  待同步   已同步  同步失败
        // updateTime:'string',//更新时间
        // type:'string',//单据类型  quality质量   equipment材设
        let state = '待同步';
        let asyncValue = {
            id:fileId+'',
            title:props.code,
            subTitle:this._formatDate(updateTime),
            state:state,
            type:'quality',
            qcState:qcState,
        }
        asyncManager = OfflineManager.getAsyncManager();
        asyncManager.saveRecord(key,JSON.stringify(asyncValue),state,updateTime);
       return new Promise(function(resolve, reject) {
        let data ={
            data:{
                msg:'msg'
            }
        }
        resolve(data);
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
            if(downloadKey && record){
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
                    return responseData;
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
                if(responseData){
                    return responseData;
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
            console.log(qualityList.length)
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
                        submitInfo:'',//提交、保存时保存的参数
                    }
                    let qcState = item.qcState;
                    let qualityCheckpointId =detail.qualityCheckpointId+'';
                    let updateTime = item.updateTime+'';
                    let submitState = '';
                    let errorMsg = '';
                    console.log(value);
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
                for (let item of detailArr){
                    // console.log('===================================')
                    // console.log(item)
                    let files = item.data.inspectionInfo.files;
                    if(files && files.length>0){
                        for (let f of files){
                            arr = [...arr,{fileId:f.objectId,url:f.url}]
                        }
                        
                    }
                    if(item.data.progressInfos && item.data.progressInfos.length>0){
                        for(let p of item.data.progressInfos){
                            let files = p.files;
                            if(files && files.length>0){
                                for (let f of files){
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

// { item:
//     I/ReactNativeJS(18961):    { id: 5201694,
//     I/ReactNativeJS(18961):      code: 'ZLJC_20180515_001',
//     I/ReactNativeJS(18961):      qcState: 'delayed',
//     I/ReactNativeJS(18961):      projectId: 5213135,
//     I/ReactNativeJS(18961):      inspectionDate: 1526313600000,
//     I/ReactNativeJS(18961):      lastRectificationDate: 1526400000000,
//     I/ReactNativeJS(18961):      description: '1122334',
//     I/ReactNativeJS(18961):      inspectionType: 'inspection',
//     I/ReactNativeJS(18961):      creatorId: 5200300,
//     I/ReactNativeJS(18961):      responsibleUserId: 5200299,
//     I/ReactNativeJS(18961):      updateTime: 1526352107000,
//     I/ReactNativeJS(18961):      files: [],
//     I/ReactNativeJS(18961):      needRectification: true },
//     I/ReactNativeJS(18961):   detail:
//     I/ReactNativeJS(18961):    { data:
//     I/ReactNativeJS(18961):       { inspectionInfo:
//     I/ReactNativeJS(18961):          { id: 5201694,
//     I/ReactNativeJS(18961):            code: 'ZLJC_20180515_001',
//     I/ReactNativeJS(18961):            qcState: 'unrectified',
//     I/ReactNativeJS(18961):            projectId: 5213135,
//     I/ReactNativeJS(18961):            projectName: 'APP材设',
//     I/ReactNativeJS(18961):            inspectionDate: 1526313600000,
//     I/ReactNativeJS(18961):            inspectionCompanyId: 5213140,
//     I/ReactNativeJS(18961):            inspectionCompanyName: '监理单位A',
//     I/ReactNativeJS(18961):            creatorId: 5200300,
//     I/ReactNativeJS(18961):            creatorName: 'XU新号',
//     I/ReactNativeJS(18961):            inspectionUserTitle: '8961):            
        // I/ReactNativeJS(18961):         constructionCompanyId: 5212715,
        // I/ReactNativeJS(18961):         constructionCompanyName: '施工单位A',
        // I/ReactNativeJS(18961):         responsibleUserId: 5200299,
        // I/ReactNativeJS(18961):         responsibleUserName: 'XP',
        // I/ReactNativeJS(18961):         responsibleUserTitle: '总工',
        // I/ReactNativeJS(18961):         qualityCheckpointId: 0,
        // I/ReactNativeJS(18961):         qualityCheckpointName: '1321',
        // I/ReactNativeJS(18961):         buildingId: null,
//     I/ReactNativeJS(18961):            buildingName: null,
//     I/ReactNativeJS(18961):            elementId: null,
//     I/ReactNativeJS(18961):            elementName: null,
//     I/ReactNativeJS(18961):            gdocFileId: null,
//     I/ReactNativeJS(18961):            needRectification: true,
//     I/ReactNativeJS(18961):            lastRectificationDate: 1526400000000,
//     I/ReactNativeJS(18961):            description: '1122334',
//     I/ReactNativeJS(18961):            inspectionType: 'inspection',
//     I/ReactNativeJS(18961):            createTime: 1526351798000,
//     I/ReactNativeJS(18961):            updateTime: 1526352107000,
//     I/ReactNativeJS(18961):            commitTime: 1526351821000,
        // I/ReactNativeJS(18961):         files:
        // I/ReactNativeJS(18961):          [ { objectId: '497bfb000c9c4161be751035be5ee7a8',
        // I/ReactNativeJS(18961):              name: 'Penguins.jpg',
        // I/ReactNativeJS(18961):              extension: 'jpg',
        // I/ReactNativeJS(18961):              length: 0,
        // I/ReactNativeJS(18961):              digest: '9d377b10ce778c4938b3c7e2c63a229a',
        // I/ReactNativeJS(18961):              targetId: '5202080',
        // I/ReactNativeJS(18961):              targetType: 'Estate_Quality_Inspection',
        // I/ReactNativeJS(18961):              uploadId: null,
        // I/ReactNativeJS(18961):              uploadTime: 1503068529000,
        // I/ReactNativeJS(18961):              remark: null,
        // I/ReactNativeJS(18961):              extData: null,
        // I/ReactNativeJS(18961):              id: 5207054,
        // I/ReactNativeJS(18961):              creatorId: 5200286,
        // I/ReactNativeJS(18961):              creatorName: '徐园',
        // I/ReactNativeJS(18961):              updatorId: 5200286,
        // I/ReactNativeJS(18961):              updatorName: '徐园',
        // I/ReactNativeJS(18961):              createTime: 1528883207000,
        // I/ReactNativeJS(18961):              updateTime: 1528883207000,
        // I/ReactNativeJS(18961):              url: 'https://gly-dev-gdoc.oss-cn-shanghai.aliyuncs.com/NAJVGyexqBCLJkcmHqmvWSNvcxwlIofb/nss/497bfb000c9c4161be751035be5ee7a8/96.png?Expires=1529046919&OSSAccessKeyId=LTAIP9gxLRjd80Fl&Signature=1YLl7KqWSTAsfSbL6iRmdYthiDE%3D',
        // I/ReactNativeJS(18961):              convertStatus: null } ],
//     I/ReactNativeJS(18961):            drawingGdocFileId: 'abc0472beb804ec4b38d40aaaa72a2f6',
//     I/ReactNativeJS(18961):            drawingName: '电缆沟图纸.dwg',
//     I/ReactNativeJS(18961):            drawingPositionX: '9604.0322265625',
//     I/ReactNativeJS(18961):            drawingPositionY: '4913.50390625',
//     I/ReactNativeJS(18961):            committed: false },
//     I/ReactNativeJS(18961):         progressInfos:
//     I/ReactNativeJS(18961):          [ { id: 5200356,
//     I/ReactNativeJS(18961):              code: 'ZLZG_20180515_001',
//     I/ReactNativeJS(18961):              billType: '整改',
//     I/ReactNativeJS(18961):              description: 'test112',
//     I/ReactNativeJS(18961):              lastRectificationDate: null,
//     I/ReactNativeJS(18961):              handleDate: 1526313600000,
//     I/ReactNativeJS(18961):              handlerId: 5200299,
//     I/ReactNativeJS(18961):              handlerName: 'XP',
//     I/ReactNativeJS(18961):              handlerTitle: '总工',
//     I/ReactNativeJS(18961):              commitTime: 1526351960000,
//     I/ReactNativeJS(18961):              files: [] },
//     I/ReactNativeJS(18961):            { id: 5200351,
//     I/ReactNativeJS(18961):              code: 'ZLFC_20180515_001',
//     I/ReactNativeJS(18961):              billType: '复查',
//     I/ReactNativeJS(18961):              description: '856',
//     I/ReactNativeJS(18961):              lastRectificationDate: 1526313600000,
//     I/ReactNativeJS(18961):              handleDate: 1526313600000,
//     I/ReactNativeJS(18961):              handlerId: 5200300,
//     I/ReactNativeJS(18961):              handlerName: 'XU新号',
//     I/ReactNativeJS(18961):              handlerTitle: '总监理工程师',
//     I/ReactNativeJS(18961):              commitTime: 1526352107000,
//     I/ReactNativeJS(18961):              files: [] } ] } },
//     I/ReactNativeJS(18961):   editInfo: null,
//     I/ReactNativeJS(18961):   repairInfo: null,
//     I/ReactNativeJS(18961):   reviewInfo: null }
