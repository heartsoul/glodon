import { DeviceEventEmitter } from 'app-3rd'
import * as API from 'app-api';
import EquipmentHandler from '../handler/EquipmentHandler';
import DownloadImg from '../model/DownloadImg';
import * as CONSTANT from "../../common/service/api+constant"
import OfflineManager from './OfflineManager';

let handler = null;
let projectId ;
let projectVersionId ;
/**
 * 质量相关下载
 */
export default class EquipmentManager {
    
    constructor(name,realm){
        handler = new EquipmentHandler(name,realm);
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
    
    //获取材设列表
    getEquipmentList=(qcState,page,size)=>{
        // console.log(qcState)
        // console.log('page='+page+' size='+size)
        if (qcState == CONSTANT.QC_STATE_EDIT) {
            // console.log('111111111111111111111')
            return this._getEquipmentListCommited(page, size, false);
        }
        if (qcState == CONSTANT.QC_STATE_STANDARD) {
            // console.log('22222222222222222')
            return this._getEquipmentListQualified(page, size, true);
        }
        if (qcState == CONSTANT.QC_STATE_NOT_STANDARD) {
            // console.log('33333333333333333333')
            return this._getEquipmentListQualified(page, size, false);
        }
        // console.log('44444444444444444444444')
        return this._getEquipmentListAll(page,size);
    }

    //全部  获取材设列表 根据状态  页数   
    _getEquipmentListAll=(page,size)=>{
        let result = handler.queryAll(page,size);
        console.log('2323232323')
            console.log(result)
        
        return new Promise((resolve,reject)=>{
            resolve(result);
            
        });
    }

    //待提交  获取材设列表 根据状态  页数   
    _getEquipmentListCommited=(page,size,committed)=>{
        let result = handler.queryCommit(page,size,committed);
        return new Promise((resolve,reject)=>{
            resolve(result);
            
        });
    }

    //合格不合格  获取材设列表 根据状态  页数   
    _getEquipmentListQualified=(page,size,qualitied)=>{
        let result = handler.queryQualified(page,size,qualitied);
        return new Promise((resolve,reject)=>{
            resolve(result);
            
        });
    }

    //获取材设列表的一个item
    getEquipmentListItem=(id)=>{
        let info = handler.query(id);
        let obj = JSON.parse(info);
        return obj.item;
    }
        
    //获取材设详情
    getQualityDetail=(id)=>{
        let info = handler.query(id);
        console.log(info)
        let obj = JSON.parse(info);
        return new Promise((resolve,reject)=>{
            resolve(obj.detail);
            
        });
    }

     //获取材设详情
     getEquipmentDetailObj=(id)=>{
        let info = handler.query(id);
        let obj = JSON.parse(info);
        return obj.detail;
    }

    //获取材设单编辑状态信息
    getQualityEdit=(id)=>{
        return this.getQualityDetail(id);
    }

    //根据id查询离线建立的单据的参数信息
    getSubmitInfoById =(id)=>{
        let info = handler.query(id);
        let obj = JSON.parse(info);
        return obj.submitInfo;
    }

    insert=(key,value,committed,qualified,updateTime,submitState,errorMsg)=>{
        handler.update(key,value,committed,qualified,updateTime,submitState,errorMsg);
    }

    delete=(key)=>{
        handler.delete(key);
    }
    
   //材设 新增  提交
    equipmentCreateSubmit(projectId, props){
        let date = new Date();
        let id = '_'+date.getTime();
        let isOffline = true;
        let committed = false;
        let qualified = props.qualified;
        let qcState = CONSTANT.QC_STATE_EQUIPMENT_NEW_SUBMIT;
        let updateTime = date.getTime()+'';
        //列表显示的信息
        let item = {
            ...props,
            id: id,
            committed:committed,
            qcStateShow: '提交 待同步',
            qcStateColor: '#f39b3d' ,
            isOffline:isOffline,
            updateTime:parseInt(updateTime),
            qcState:qcState,
        }

        let detail = { 
            data:
               { 
                ...props,
                id: id,
                committed:false,
                }
            }

        let submitInfo = {
            projectId:projectId, 
            props:props
        }

        let key = id+'';
        let value = {
            item:item,
            detail:detail,
            editInfo:detail,
            submitInfo:submitInfo,//提交、保存时保存的参数
        }
        let submitState = 'true';  //表示此条数据有需要提交到服务器的操作
        let errorMsg = '';

        //保存到单据列表
        this.insert(key,JSON.stringify(value),committed+'',qualified+'',updateTime,submitState,errorMsg);
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
            type:'equipment',
            qcState:qcState,
        }
        asyncManager = OfflineManager.getAsyncManager();
        asyncManager.saveRecord(key,JSON.stringify(asyncValue),state,updateTime);

       return new Promise(function(resolve, reject) {
        let data ={
            data:{
                code:'code',
                id:id
            }
        }
        resolve(data);
      });
    }
    //材设 编辑  提交
    equipmentEditSubmit(projectId, equipmentId, props){
        let date = new Date();
        let id = equipmentId;
        let isOffline = true;
        let committed = false;
        let qualified = props.qualified;
        let qcState = CONSTANT.QC_STATE_EQUIPMENT_EDIT_SUBMIT;
        let careId = equipmentId+'';
        if(careId.startsWith('_')){
            qcState = CONSTANT.QC_STATE_EQUIPMENT_NEW_SUBMIT;
        }
        let updateTime = date.getTime()+'';
        //列表显示的信息
        let item = {
            ...props,
            id: id,
            committed:committed,
            qcStateShow: '提交 待同步',
            qcStateColor: '#f39b3d' ,
            isOffline:isOffline,
            updateTime:parseInt(updateTime),
            qcState:qcState,
        }

        let detail = { 
            data:
               { 
                ...props,
                id: id,
                committed:committed,
                }
            }

        let submitInfo = {
            projectId:projectId, 
            props:props,
            equipmentId:equipmentId,
        }

        let key = id+'';
        let value = {
            item:item,
            detail:detail,
            editInfo:detail,
            submitInfo:submitInfo,//提交、保存时保存的参数
        }
        let submitState = 'true';  //表示此条数据有需要提交到服务器的操作
        let errorMsg = '';

        //保存到单据列表
        this.insert(key,JSON.stringify(value),committed+'',qualified+'',updateTime,submitState,errorMsg);
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
            type:'equipment',
            qcState:qcState,
        }
        asyncManager = OfflineManager.getAsyncManager();
        asyncManager.saveRecord(key,JSON.stringify(asyncValue),state,updateTime);

       return new Promise(function(resolve, reject) {
        let data ={
            data:{
                code:'code',
                id:id
            }
        }
        resolve(data);
      });
    }

    //材设  新增  保存
    equipmentCreateSave(projectId, props){
        console.log(props)
        let date = new Date();
        let id = '_'+date.getTime();
        let isOffline = true;
        let committed = false;
        let qualified = props.qualified;
        let qcState = CONSTANT.QC_STATE_EQUIPMENT_NEW_SAVE;
        let updateTime = date.getTime()+'';
        //列表显示的信息
        let item = {
            ...props,
            id: id,
            committed:committed,
            qcStateShow: '保存 待同步',
            qcStateColor: '#f39b3d' ,
            isOffline:isOffline,
            updateTime:parseInt(updateTime),
            qcState:qcState,
        }

        let detail = { 
            data:
               { 
                ...props,
                id: id,
                committed:committed,
                }
            }

        let submitInfo = {
            projectId:projectId, 
            props:props
        }

        let key = id+'';
        let value = {
            item:item,
            detail:detail,
            editInfo:detail,
            submitInfo:submitInfo,//提交、保存时保存的参数
        }
        
        let submitState = 'true';  //表示此条数据有需要提交到服务器的操作
        let errorMsg = '';

        //保存到单据列表
        this.insert(key,JSON.stringify(value),committed+'',qualified+'',updateTime,submitState,errorMsg);
        
        console.log(value)
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
            type:'equipment',
            qcState:qcState,
        }
        asyncManager = OfflineManager.getAsyncManager();
        asyncManager.saveRecord(key,JSON.stringify(asyncValue),state,updateTime);

       return new Promise(function(resolve, reject) {
        let data ={
            data:{
                code:'code',
                id:id
            }
        }
        resolve(data);
      });
    }
    //材设  编辑  保存
    equipmentEditSave(projectId, equipmentId, props){
        let date = new Date();
        let id = equipmentId;
        let isOffline = true;
        let committed = false;
        let qualified = props.qualified;
        let detailInfo = this.getEquipmentDetailObj(id+'');
        let code = detailInfo.data.code;
        let qcState = CONSTANT.QC_STATE_EQUIPMENT_EDIT_SAVE;
        let careId = equipmentId+'';
        if(careId.startsWith('_')){
            qcState = CONSTANT.QC_STATE_EQUIPMENT_NEW_SAVE;
        }
        let updateTime = date.getTime()+'';
        //列表显示的信息
        let item = {
            ...props,
            id: id,
            committed:committed,
            qcStateShow: '保存 待同步',
            qcStateColor: '#f39b3d' ,
            isOffline:isOffline,
            code:code,
            updateTime:parseInt(updateTime),
            qcState:qcState,
        }

        let detail = { 
            data:
               { 
                ...props,
                id: id,
                committed:committed,
                code:code,
                }
            }

        let submitInfo = {
            projectId:projectId, 
            props:props,
            equipmentId:equipmentId,

        }

        let key = id+'';
        let value = {
            item:item,
            detail:detail,
            editInfo:detail,
            submitInfo:submitInfo,//提交、保存时保存的参数
        }
        let submitState = 'true';  //表示此条数据有需要提交到服务器的操作
        let errorMsg = '';

        //保存到单据列表
        this.insert(key,JSON.stringify(value),committed+'',qualified+'',updateTime,submitState,errorMsg);
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
            type:'equipment',
            qcState:qcState,
        }
        asyncManager = OfflineManager.getAsyncManager();
        asyncManager.saveRecord(key,JSON.stringify(asyncValue),state,updateTime);

       return new Promise(function(resolve, reject) {
        let data ={
            data:{
                code:code,
                id:id
            }
        }
        resolve(data);
      });
    }

    //材设 删除
    equipmentDelete(projectId, equipmentId){
        let id = equipmentId+'';
        asyncManager = OfflineManager.getAsyncManager();
        if(id.startsWith('_')){
            asyncManager.deleteByKey(id);
            this.delete(id);
        }else{
            let date = new Date();
            let id = equipmentId;
            let isOffline = true;
            let committed = false;
            let detailInfo = this.getEquipmentDetailObj(id+'');
            let props = detailInfo.data;
            let qualified = props.qualified;
            let code = detailInfo.data.code;
            let qcState = CONSTANT.QC_STATE_EQUIPMENT_DELETE;
            let updateTime = date.getTime()+'';
            //列表显示的信息
            let item = {
                ...props,
                id: id,
                committed:committed,
                qcStateShow: '删除 待同步',
                qcStateColor: '#f39b3d' ,
                isOffline:isOffline,
                code:code,
                updateTime:parseInt(updateTime),
                qcState:qcState,
            }
    
            let detail = { 
                data:
                   { 
                    ...props,
                    id: id,
                    committed:committed,
                    code:code,
                    }
                }
    
            let submitInfo = {
                projectId:projectId, 
                equipmentId:equipmentId,
            }
    
            let key = id+'';
            let value = {
                item:item,
                detail:detail,
                editInfo:detail,
                submitInfo:submitInfo,//提交、保存时保存的参数
            }
            let submitState = 'true';  //表示此条数据有需要提交到服务器的操作
            let errorMsg = '';
    
            //保存到单据列表
            this.insert(key,JSON.stringify(value),committed+'',qualified+'',updateTime,submitState,errorMsg);
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
                title:code,
                subTitle:this._formatDate(updateTime),
                state:state,
                type:'equipment',
                qcState:qcState,
            }
            asyncManager = OfflineManager.getAsyncManager();
            asyncManager.saveRecord(key,JSON.stringify(asyncValue),state,updateTime);
        }

        return new Promise(function(resolve, reject) {
            let data ={
                data:{
                    code:'code',
                    id:id
                }
            }
            resolve(data);
        });
    }


    //根据id更新该条数据
    updateById=(id)=>{
        //保存到数据库
        let _saveToDb=(key,value,committed,qualified,updateTime,submitState,errorMsg)=>{
            handler.update(key,value,committed,qualified,updateTime,submitState,errorMsg);
        }
        //材设单详情下载
        let _getEquipmentDetail=(id)=> {
            return  API.equipmentDetail(projectId, id).then((responseData) => {
                // { data:
                //     I/ReactNativeJS( 2780):    { id: 5200663,
                //     I/ReactNativeJS( 2780):      code: 'CSYS_20180606_003',
                //     I/ReactNativeJS( 2780):      projectId: 5213135,
                //     I/ReactNativeJS( 2780):      projectName: 'APP材设',
                //     I/ReactNativeJS( 2780):      batchCode: 's d f s d',
                //     I/ReactNativeJS( 2780):      facilityCode: '史蒂夫',
                //     I/ReactNativeJS( 2780):      facilityName: '史蒂夫',
                //     I/ReactNativeJS( 2780):      specification: '',
                //     I/ReactNativeJS( 2780):      modelNum: '',
                //     I/ReactNativeJS( 2780):      approachDate: 1528214400000,
                //     I/ReactNativeJS( 2780):      manufacturer: '',
                //     I/ReactNativeJS( 2780):      brand: '',
                //     I/ReactNativeJS( 2780):      unit: '',
                //     I/ReactNativeJS( 2780):      quantity: null,
                //     I/ReactNativeJS( 2780):      supplier: '',
                //     I/ReactNativeJS( 2780):      qualified: true,
                //     I/ReactNativeJS( 2780):      buildingId: null,
                //     I/ReactNativeJS( 2780):      buildingName: null,
                //     I/ReactNativeJS( 2780):      elementId: '',
                //     I/ReactNativeJS( 2780):      elementName: '',
                //     I/ReactNativeJS( 2780):      gdocFileId: null,
                //     I/ReactNativeJS( 2780):      committed: false,
                //     I/ReactNativeJS( 2780):      updateTime: 1528269340000,
                //     I/ReactNativeJS( 2780):      acceptanceCompanyId: 5211919,
                //     I/ReactNativeJS( 2780):      acceptanceCompanyName: '11301919',
        //                 I/ReactNativeJS( 2780):      files:
                    // I/ReactNativeJS( 2780):       [ { objectId: '2a995a4af8c945db82a0f0331fb54afd',
                    // I/ReactNativeJS( 2780):           name: '4746c42b5d47dea5fb0a1a4f3cb340c9.png',
                    // I/ReactNativeJS( 2780):           extension: 'png',
                    // I/ReactNativeJS( 2780):           length: 201228,
                    // I/ReactNativeJS( 2780):           digest: 'b5862bb5d1a844e96745ccd36fbfb721',
                    // I/ReactNativeJS( 2780):           targetId: '5200678',
                    // I/ReactNativeJS( 2780):           targetType: 'Estate_Quality_Facility',
                    // I/ReactNativeJS( 2780):           uploadId: null,
                    // I/ReactNativeJS( 2780):           uploadTime: 1528444375000,
                    // I/ReactNativeJS( 2780):           remark: null,
                    // I/ReactNativeJS( 2780):           extData: null,
                    // I/ReactNativeJS( 2780):           id: 5207000,
                    // I/ReactNativeJS( 2780):           creatorId: 5200286,
                    // I/ReactNativeJS( 2780):           creatorName: '徐园',
                    // I/ReactNativeJS( 2780):           updatorId: 5200286,
                    // I/ReactNativeJS( 2780):           updatorName: '徐园',
                    // I/ReactNativeJS( 2780):           createTime: 1528444421000,
                    // I/ReactNativeJS( 2780):           updateTime: 1528444421000,
                    // I/ReactNativeJS( 2780):           url: 'https://gly-dev-gdoc.oss-cn-shanghai.aliyuncs.com/NAJVGyexqBCLJkcmHqmvWSNvcxwlIofb/nss/2a995a4af8c945db82aI/ReactNativeJS( 2780): 材设单编辑信息 start--------------
                // console.log('材设单详情 start--------------');
                // console.log(responseData); //
                // console.log('材设单详情 end--------------');
                if(responseData){
                    return responseData;
                }
                return null;
            }).catch(err => {
                console.log(err)
            });
        }

        //材设单编辑信息
        let _getEquipmentEditInfo=(id) =>{
            return  API.equipmentDetail(projectId, id).then((responseData) => {
                if(responseData){
                    return responseData;
                }
                return null;
            }).catch(err => {
                console.log(err)
            });
        }

        let detailArr = []//保存详情
        async function download(){

            //全部   都有详情
            let detail = await _getEquipmentDetail(id);
            detailArr = [...detailArr,detail]
            let item ={
                ...detail.data,
            }
            //待提交   编辑信息
            let editInfo = null;
            if(!item.committed){
                editInfo = await _getEquipmentEditInfo(item.id);
            }
            

            let key = item.id+'';
            let value = {
                item:item,
                detail:detail,
                editInfo:editInfo,
            }
            let committed = item.committed+'';
            let qualified = item.qualified+'';
            let updateTime = item.updateTime+'';
            let submitState = '';
            let errorMsg = '';
            _saveToDb(key,JSON.stringify(value),committed,qualified,updateTime,submitState,errorMsg);
            return true;
        }
        
         download().then((a)=>{
             
             //缓存图片
            if(detailArr && detailArr.length>0){
                let arr = [];
                for (let item of detailArr){
                    let files = item.data.files;
                    if(files && files.length>0){
                        for (let f of files){
                            //获取图片信息
                            arr = [...arr,{fileId:f.objectId,url:f.url}]
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
    //下载单据信息
    download = (startTime=0,endTime=0,states=[],downloadKey,record) => {
        let qcState = CONSTANT.QC_STATE_ALL;
        if(states.length>0){
            if(states[0] == '待提交'){
                qcState = CONSTANT.QC_STATE_EDIT;
            }
        }

        //保存到数据库
        let _saveToDb=(key,value,committed,qualified,updateTime,submitState,errorMsg)=>{
            handler.update(key,value,committed,qualified,updateTime,submitState,errorMsg);
        }
         
        let downloadingManager = OfflineManager.getDownloadingManager();
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
                let conditionManager = OfflineManager.getEquipmentConditionManager();
                conditionManager.saveRecord(downloadKey,JSON.stringify(record));
                //从下载中删除
                downloadingManager.delete(downloadKey);
            }
            DeviceEventEmitter.emit(downloadKey,record);
        }
        
        //材设单下载列表
        let  _getEquipmentList=(page,size)=>{
            return API.equipmentListByDate(projectId, qcState,page,size,startTime,endTime).then(
                (responseData) => {
                
                    // console.log('材设单下载列表 start--------------');
                    // console.log(responseData); //
                    // console.log('材设单下载列表 end--------------');
                    //                                      { id: 5200702,
                    //     I/ReactNativeJS(28901):           code: 'CSYS_20180612_008',
                    //     I/ReactNativeJS(28901):           projectId: 5213135,
                    //     I/ReactNativeJS(28901):           projectName: 'APP材设',
                    //     I/ReactNativeJS(28901):           batchCode: '321',
                    //     I/ReactNativeJS(28901):           facilityCode: '321',
                    //     I/ReactNativeJS(28901):           facilityName: '321',
                    //     I/ReactNativeJS(28901):           specification: '',
                    //     I/ReactNativeJS(28901):           modelNum: '',
                    //     I/ReactNativeJS(28901):           approachDate: 1528732800000,
                    //     I/ReactNativeJS(28901):           manufacturer: '',
                    //     I/ReactNativeJS(28901):           brand: '',
                    //     I/ReactNativeJS(28901):           unit: '',
                    //     I/ReactNativeJS(28901):           quantity: null,
                    //     I/ReactNativeJS(28901):           supplier: '',
                    //     I/ReactNativeJS(28901):           qualified: true,
                    //     I/ReactNativeJS(28901):           buildingId: null,
                    //     I/ReactNativeJS(28901):           buildingName: null,
                    //     I/ReactNativeJS(28901):           elementId: '',
                    //     I/ReactNativeJS(28901):           elementName: '',
                    //     I/ReactNativeJS(28901):           gdocFileId: null,
                    //     I/ReactNativeJS(28901):           committed: true,
                    //     I/ReactNativeJS(28901):           updateTime: 1528783080000,
                    //     I/ReactNativeJS(28901):           acceptanceCompanyId: 5211919,
                    //     I/ReactNativeJS(28901):           acceptanceCompanyName: '11301919',
                    //     I/ReactNativeJS(28901):           files:
                    //     I/ReactNativeJS(28901):            [ { objectId: 'c2438145cec244219eb3954f272bdb83',
                    //     I/ReactNativeJS(28901):                name: 'Jellyfish.jpg',
                    //     I/ReactNativeJS(28901):                extension: 'jpg',
                    //     I/ReactNativeJS(28901):                length: 0,
                    //     I/ReactNativeJS(28901):                digest: '5a44c7ba5bbe4ec867233d67e4806848',
                    //     I/ReactNativeJS(28901):                targetId: '5200702',
                    //     I/ReactNativeJS(28901):                targetType: 'Estate_Quality_Facility',
                    //     I/ReactNativeJS(28901):                uploadId: null,
                    //     I/ReactNativeJS(28901):                uploadTime: 1503068988000,
                    //     I/ReactNativeJS(28901):                remark: null,
                    //     I/ReactNativeJS(28901):                extData: null,
                    //     I/ReactNativeJS(28901):                id: 5207041,
                    //     I/ReactNativeJS(28901):                creatorId: 5200286,
                    //     I/ReactNativeJS(28901):                creatorName: '徐园',
                    //     I/ReactNativeJS(28901):                updatorId: 5200286,
                    //     I/ReactNativeJS(28901):                updatorName: '徐园',
                    //     I/ReactNativeJS(28901):                createTime: 1528782811000,
                    //     I/ReactNativeJS(28901):                updateTime: 1528782811000,
                    //     I/ReactNativeJS(28901):                url: null,
                    //     I/ReactNativeJS(28901):                convertStatus: null } ] },
                    if(responseData && responseData.data && responseData.data.content && responseData.data.content.length>0){
                        return {list:responseData.data.content,totalPages:responseData.data.totalPages};
                    }
                    return null;
                }
            ).catch(error => {
                console.log(error)
            });
        }
        //材设单详情下载
        let _getEquipmentDetail=(id)=> {
            return  API.equipmentDetail(projectId, id).then((responseData) => {
                // { data:
                //     I/ReactNativeJS( 2780):    { id: 5200663,
                //     I/ReactNativeJS( 2780):      code: 'CSYS_20180606_003',
                //     I/ReactNativeJS( 2780):      projectId: 5213135,
                //     I/ReactNativeJS( 2780):      projectName: 'APP材设',
                //     I/ReactNativeJS( 2780):      batchCode: 's d f s d',
                //     I/ReactNativeJS( 2780):      facilityCode: '史蒂夫',
                //     I/ReactNativeJS( 2780):      facilityName: '史蒂夫',
                //     I/ReactNativeJS( 2780):      specification: '',
                //     I/ReactNativeJS( 2780):      modelNum: '',
                //     I/ReactNativeJS( 2780):      approachDate: 1528214400000,
                //     I/ReactNativeJS( 2780):      manufacturer: '',
                //     I/ReactNativeJS( 2780):      brand: '',
                //     I/ReactNativeJS( 2780):      unit: '',
                //     I/ReactNativeJS( 2780):      quantity: null,
                //     I/ReactNativeJS( 2780):      supplier: '',
                //     I/ReactNativeJS( 2780):      qualified: true,
                //     I/ReactNativeJS( 2780):      buildingId: null,
                //     I/ReactNativeJS( 2780):      buildingName: null,
                //     I/ReactNativeJS( 2780):      elementId: '',
                //     I/ReactNativeJS( 2780):      elementName: '',
                //     I/ReactNativeJS( 2780):      gdocFileId: null,
                //     I/ReactNativeJS( 2780):      committed: false,
                //     I/ReactNativeJS( 2780):      updateTime: 1528269340000,
                //     I/ReactNativeJS( 2780):      acceptanceCompanyId: 5211919,
                //     I/ReactNativeJS( 2780):      acceptanceCompanyName: '11301919',
    //                 I/ReactNativeJS( 2780):      files:
                    // I/ReactNativeJS( 2780):       [ { objectId: '2a995a4af8c945db82a0f0331fb54afd',
                    // I/ReactNativeJS( 2780):           name: '4746c42b5d47dea5fb0a1a4f3cb340c9.png',
                    // I/ReactNativeJS( 2780):           extension: 'png',
                    // I/ReactNativeJS( 2780):           length: 201228,
                    // I/ReactNativeJS( 2780):           digest: 'b5862bb5d1a844e96745ccd36fbfb721',
                    // I/ReactNativeJS( 2780):           targetId: '5200678',
                    // I/ReactNativeJS( 2780):           targetType: 'Estate_Quality_Facility',
                    // I/ReactNativeJS( 2780):           uploadId: null,
                    // I/ReactNativeJS( 2780):           uploadTime: 1528444375000,
                    // I/ReactNativeJS( 2780):           remark: null,
                    // I/ReactNativeJS( 2780):           extData: null,
                    // I/ReactNativeJS( 2780):           id: 5207000,
                    // I/ReactNativeJS( 2780):           creatorId: 5200286,
                    // I/ReactNativeJS( 2780):           creatorName: '徐园',
                    // I/ReactNativeJS( 2780):           updatorId: 5200286,
                    // I/ReactNativeJS( 2780):           updatorName: '徐园',
                    // I/ReactNativeJS( 2780):           createTime: 1528444421000,
                    // I/ReactNativeJS( 2780):           updateTime: 1528444421000,
                    // I/ReactNativeJS( 2780):           url: 'https://gly-dev-gdoc.oss-cn-shanghai.aliyuncs.com/NAJVGyexqBCLJkcmHqmvWSNvcxwlIofb/nss/2a995a4af8c945db82aI/ReactNativeJS( 2780): 材设单编辑信息 start--------------
                // console.log('材设单详情 start--------------');
                // console.log(responseData); //
                // console.log('材设单详情 end--------------');
                if(responseData){
                    return responseData;
                }
                return null;
            }).catch(err => {
                console.log(err)
            });
        }

        //材设单编辑信息
        let _getEquipmentEditInfo=(id) =>{
            return  API.equipmentDetail(projectId, id).then((responseData) => {
                // console.log('材设单编辑信息 start--------------');
                // console.log(responseData); //
                // console.log('材设单编辑信息 end--------------');
                if(responseData){
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
            let data = await _getEquipmentList(page,size);
            let qualityList = [];
            if(data && data.list && data.list.length>0){
                qualityList = [...qualityList,...data.list];
                let totalPages = data.totalPages;
                console.log('totalpages='+totalPages)
                page++;
                //循环取数据
                while(page<totalPages){
                    let d = await _getEquipmentList(page,size);
                    qualityList = [...qualityList,...d.list];
                    page++;
                }
            }



            if(qualityList && qualityList.length>0){
                let progress = 0;
                let num = qualityList.length;
                let total = num *2;
                _saveProgress(progress++,total,num);
                for (let item of qualityList){

                    //全部   都有详情
                    let detail = await _getEquipmentDetail(item.id);
                    _saveProgress(progress++,total,num);
                    // console.log(detail)
                    detailArr = [...detailArr,detail]
                    //待提交   编辑信息
                    let editInfo = null;
                    if(!item.committed){
                        editInfo = await _getEquipmentEditInfo(item.id);
                        _saveProgress(progress++,total,num);
                    }
                    

                    let key = item.id+'';
                    let value = {
                        item:item,
                        detail:detail,
                        editInfo:editInfo,
                    }
                    let committed = item.committed+'';
                    let qualified = item.qualified+'';
                    let updateTime = item.updateTime+'';
                    let submitState = '';
                    let errorMsg = '';
                    _saveToDb(key,JSON.stringify(value),committed,qualified,updateTime,submitState,errorMsg);
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
                    let files = item.data.files;
                    if(files && files.length>0){
                        for (let f of files){
                            //获取图片信息
                            arr = [...arr,{fileId:f.objectId,url:f.url}]
                        }
                        
                    }
                    
                }
                // console.log(JSON.stringify(arr))
                let dli = new DownloadImg();
                dli.download(arr);
            }

        },(e)=>{
            console.log(e);
        });
    }


}
