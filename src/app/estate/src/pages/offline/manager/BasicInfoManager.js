
import * as API from 'app-api';
import BasicInfoHandler from '../handler/BasicInfoHandler';

let basicHandler = null;
let projectId ;
let projectVersionId ;
/**
 * 基础包下载
 */
export default class BasicInfoManager {
    
    constructor(){
        basicHandler = new BasicInfoHandler();
        projectId = storage.loadProject();
        projectVersionId = storage.getLatestVersionId(projectId);
        // projectVersionId = storage.projectIdVersionId;
    }
 
     //从数据库获取
     _getFromDb=(key)=>{
         let info = basicHandler.query(key);
         return new Promise((resolve,reject)=>{
            let infos = JSON.parse(info);
            resolve(infos);
            // reject('bbb');
        });
     }
    

    //获取检查单位信息
    getInspectionCompany=()=>{
        let key_getInspectionCompany = `/quality/${projectId}/qualityInspection/inspectionCompanys`;
        return  this._getFromDb(key_getInspectionCompany);
    }
    //获取施工单位信息
    getSupporters=()=>{
        let key_getSupporters = `/pmbasic/projects/${projectId}/supporters`;
        return  this._getFromDb(key_getSupporters);
    }

    //获取责任人
    fetchPersons=(coperationId)=>{
        let key_fetchPersons = `/pmbasic/projects/${projectId}/coperationCorps/${coperationId}/coperationRoles`;
        return  this._getFromDb(key_fetchPersons);
    }

    //获取质检项目
    getCheckPoints=()=>{
        let key_getCheckPoints = `/quality/${projectId}/checkpoints/templates/whole`;
        return  this._getFromDb(key_getCheckPoints);
    }

     //获取质检项目标准
     getStandards=(templateId)=>{
        let key_getStandards = `/quality/acceptanceStandard/templates/${templateId}/standards/items`;
        return  this._getFromDb(key_getStandards);
    }

    //获取模型专业列表
    getSpecialList=()=>{
        let key_getSpecialList = "/pmbasic/specialty";
        return  this._getFromDb(key_getSpecialList);
    }

    //获取模型单体列表
    getSingleList=()=>{
        let key_getSingleList ="/pmbasic/projects/" + projectId + "/buildings";
        return  this._getFromDb(key_getSingleList);
    }

    //获取所有模型列表
    getModelList=()=>{
        let key_getModelList = "/model/" + projectId + "/" + projectVersionId + "/bimFiles";
        return  this._getFromDb(key_getModelList);
    }


    //获取验收单位列表
    equipmentAcceptanceCompanies=()=>{
        let key_equipmentAcceptanceCompanies = `/quality/${projectId}/facilityAcceptance/acceptanceCompanys`;
        return  this._getFromDb(key_equipmentAcceptanceCompanies);
    }

    //获取上次基础包的下载时间
    getDownloadedTime=()=>{
        return basicHandler.query('downloadedTime');
    }

    //下载基础信息
    downloadBasicInfo = (callback) => {
        //保存到数据库
        _saveToDb=(key,value)=>{
            basicHandler.update(key,value);
        }
        
        //记录进度
        _saveProgress=(callback,progress,totalNum)=>{
            //回调页面
            callback(progress,totalNum);
            if(progress==totalNum){
                //记录终极状态
                let date = new Date();
                let time = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+':'+(date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes());
                _saveToDb('downloadedTime',time);
            }
        }
        //检查单位
        let key_getInspectionCompany = `/quality/${projectId}/qualityInspection/inspectionCompanys`;
        function _getInspectionCompany(){
            return API.getInspectionCompanies(projectId)
                    .then(data => {
                        let inspectionCompanies = [];
                        if (data && data.data) {
                            inspectionCompanies = data.data;
                            let retValue = JSON.stringify(inspectionCompanies);
                            // console.log('检查单位 start--------------');
                            // console.log(retValue); //[{"parentId":null,"code":"s567uytr","name":"龙湖新租户A","alias":null,"type":"GROUP","extData":null,"id":5200001,"treePath":"5200001/","orderNum":1,"external":false,"formal":true}]
                            // console.log('检查单位 end--------------');
                            
                            _saveToDb(key_getInspectionCompany,retValue);
                            return retValue;
                        }
                        
                    });
        }
        //施工单位
        let key_getSupporters = `/pmbasic/projects/${projectId}/supporters`;
        function _getSupporters() {
            return API.getCompaniesList(projectId, 'SGDW')
                .then(data => {
                    let supporters = [];
                    if (data && data.data) {
                        supporters = data.data;
                        let retValue = JSON.stringify(supporters);
                        // console.log('施工单位 start--------------');
                        // console.log(retValue); //
                        // console.log('施工单位 end--------------');
                        _saveToDb(key_getSupporters,retValue);
                        return retValue;
                    }
                    
                });
        }
        //责任人
        function _fetchPersons(coperationId){
            let key_fetchPersons = `/pmbasic/projects/${projectId}/coperationCorps/${coperationId}/coperationRoles`;
            return API.getPersonList(projectId, coperationId)
                .then(data => {
                    if (data && data.data && data.data.length > 0) {
                        let retValue = JSON.stringify(data.data);
                        // console.log('责任人 start--------------');
                        // console.log(retValue); //
                        // console.log('责任人 end--------------');
                        _saveToDb(key_fetchPersons,retValue);
                        return retValue;
                    } 
                }).catch((e) => {
                    console.log(e);
                });
        }
        //质检项目
        let key_getCheckPoints = `/quality/${projectId}/checkpoints/templates/whole`;
        function _getCheckPoints(){
            return API.getCheckPoints(storage.loadProject())
                .then(data => {
                    let retValue = JSON.stringify(data.data);
                        // console.log('质检项目 start--------------');
                        // console.log(retValue); //
                        // console.log('质检项目 end--------------');
                        _saveToDb(key_getCheckPoints,retValue);
                        return retValue;
                });
        }

        //质检项目标准
        function _getStandards(templateId){
            let key_getStandards = `/quality/acceptanceStandard/templates/${templateId}/standards/items`;
            return API.getStandardsItems(templateId).then((responseData) => {
                let html = JSON.stringify(responseData.data);
                // console.log('质检项目标准 start--------------');
                // console.log(html); //
                // console.log('质检项目标准 end--------------');
                _saveToDb(key_getStandards,html);
                return html;
            }).catch(err => {
                console.log(err);
            });
        }
        //模型专业
        let key_getSpecialList = "/pmbasic/specialty";
        function _getSpecialList(){
            return API.getPmbasicSpecialty(false).then(responseData => {
                        if (responseData) {
                            let list = JSON.stringify( responseData.data);
                            // console.log('模型专业 start--------------');
                            // console.log(list); //
                            // console.log('模型专业 end--------------');
                            _saveToDb(key_getSpecialList,list);
                            return list;
                        }
                    }).catch((err) => {
                        console.log(err);
                    });
        }
        //模型单体
        let key_getSingleList ="/pmbasic/projects/" + projectId + "/buildings";
        function _getSingleList(){
            return API.getPmbasicBuildings(projectId).then(responseData => {
                        if (responseData) {
                            let list = JSON.stringify( responseData.data);
                            // console.log('模型单体 start--------------');
                            // console.log(list); //
                            // console.log('模型单体 end--------------');
                            _saveToDb(key_getSingleList,list);
                            return list;
                        }
                    }).catch((err) => {
                        console.log(err);
                    });
        }
        //模型列表
        
        function _getModelList(buildingId, specialtyCode ){
            return API.getModelBimFiles(storage.loadProject(), projectVersionId, buildingId, specialtyCode)
            .then(responseData => {
                console.log('模型返回值：'+JSON.stringify(responseData));//{"data":{"code":"0","message":"success","data":[]}}
                if (responseData) {
                    let list = responseData.data.data;
                    // console.log(JSON.stringify(list)); //
                    // console.log(list.length); //
                    if (list.length > 0) {
                        for(item of list){
                            item.buildingId=buildingId;
                            item.specialtyCode=specialtyCode;
                        }
                        // console.log('模型列表 start--------------'+buildingId+' '+specialtyCode);
                        // console.log(JSON.stringify(list)); //
                        // console.log('模型列表 end--------------');
                            
                        return list;
                    }
                }


            }).catch(err => {
                console.log(err);
            });
        }
        //图纸目录

        //材设  验收单位
        let key_equipmentAcceptanceCompanies = `/quality/${projectId}/facilityAcceptance/acceptanceCompanys`;
        function _equipmentAcceptanceCompanies() {
            return API.equipmentAcceptanceCompanies(projectId)
                .then(responseData => {
                    if (responseData) {
                        let list = JSON.stringify( responseData.data);
                        // console.log('验收单位 start--------------');
                        // console.log(list); //
                        // console.log('验收单位 end--------------');
                        _saveToDb(key_equipmentAcceptanceCompanies,list);
                        return list;
                    }
                }).catch(error => {
                    console.log(error);
                 })
        }

        async function download(){
            let totalNum = 15;
            let progress = 1;
            _saveProgress(callback,progress++,totalNum);
            let InspectionCompanyList = await _getInspectionCompany();
            
            _saveProgress(callback,progress++,totalNum);
            let supperters = await _getSupporters();
            
            _saveProgress(callback,progress++,totalNum);
            let companyList = JSON.parse(supperters);
            if(companyList && companyList.length>0){
                for(item of companyList){
                    let person = await _fetchPersons(item.id);
                }
            }
            
            _saveProgress(callback,progress++,totalNum);
            let checkPoints = await _getCheckPoints();
            
            _saveProgress(callback,progress++,totalNum);
            let checkPointList = JSON.parse(checkPoints);
            if(checkPointList && checkPointList.length>0){
                for(item of checkPointList){
                    let result = await _getStandards(item.id);
                }
            }
            _saveProgress(callback,progress++,totalNum);
            let specialListStr = await _getSpecialList();
            _saveProgress(callback,progress++,totalNum);
            let singleListStr = await _getSingleList();
            _saveProgress(callback,progress++,totalNum);

            let specialList = JSON.parse(specialListStr);
            let singleList = JSON.parse(singleListStr);
            if(specialList && specialList.length>0 && singleList && singleList.length>0){
                let list = [];
                for(special of specialList){
                    for(single of singleList){
                        let result = await _getModelList(single.id,special.code);
                        // console.log('result='+JSON.stringify(result));
                        if(result!=null && result!=undefined){
                            if(list.length==0){
                                list=[...result];
                            }else{
                                list = [...list,...result]
                            }
                            
                        }
                    }
                }
                let key_getModelList = "/model/" + projectId + "/" + projectVersionId + "/bimFiles";
                // console.log('list='+JSON.stringify(list));/
                _saveToDb(key_getModelList,JSON.stringify(list));
            }
            _saveProgress(callback,progress++,totalNum);
            let equipmentCompanyList = await _equipmentAcceptanceCompanies();
            _saveProgress(callback,totalNum,totalNum);
            return true;
        }
        
         download().then((a)=>{
            console.log("basicinfo  download over-----------------------------------------");
            // this.getInspectionCompany().then(res=>{console.log(res)})
            // this.getSupporters().then(res=>{console.log(res)})
            // this.getSpecialList().then(res=>{console.log(res)})
            // this.getSingleList().then(res=>{console.log(res)})
            // this.getModelList().then(res=>{console.log(res)})
            // this.equipmentAcceptanceCompanies().then(res=>{console.log(res)})
            // console.log(this.getDownloadedTime())
        },(e)=>{
            console.log(e);
        });
    }

    close =()=>{
        basicHandler.close();
    }
}
