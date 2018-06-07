
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
            if(basicHandler!=null){
                this.close();
            }
        });
     }

     //从数据库获取
     _getFromDbJson=(key)=>{
        let info = basicHandler.query(key);
        return JSON.parse(info);
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
        let key_getModelList = "/model/" + projectId + "/" + projectVersionId + "/bim/file/children/model";
        return  this._getFromDbJson(key_getModelList);
    }

    //获取所有图纸列表
    getBlueprintList=()=>{
        let key_getModelList = "/model/" + projectId + "/" + projectVersionId + "/bim/file/children/blueprint";
        return  this._getFromDbJson(key_getModelList);
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
        this.downloadModel();
        this.downloadBluePrint();
        //保存到数据库
        _saveToDb=(key,value)=>{
            basicHandler.update(key,value);
        }
        
        //记录进度
        _saveProgress=(callback,progress,totalNum)=>{
            //回调页面
            if(callback!=null && callback!=undefined){
                callback(progress,totalNum);
            }
            
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
            // console.log('----------------------168')
            // console.log(projectId+"  "+coperationId)
            return API.getPersonList(projectId, coperationId)
                .then(data => {
                    // console.log('责任人 data--------------');
                    // console.log(data)
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
                // console.log('质检项目标准 start--------------templateId='+templateId);
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
            // console.log(companyList.length)
            if(companyList && companyList.length>0){
                for(item of companyList){
                    let person = await _fetchPersons(item.coperationId);
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
            _saveProgress(callback,progress++,totalNum);
           
            
            _saveProgress(callback,progress++,totalNum);
            let equipmentCompanyList = await _equipmentAcceptanceCompanies();
            
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
            _saveProgress(callback,100,100);

        },(e)=>{
            console.log(e);
        });
    }


    //下载模型文件
    downloadModel(){
        this._downloadModelAndBlueprint('模型文件');
    }

    //下载图纸文件
    downloadBluePrint(){
        this._downloadModelAndBlueprint('图纸文件');
    }

    _downloadModelAndBlueprint(name){
        //保存到数据库
        _saveToDb=(key,value)=>{
            basicHandler.update(key,value);
        }

        function _getModelList(fileId=0){
            return API.getModelBimFileChildren(projectId, projectVersionId, 0, fileId).then(
                (responseData) => {
                    // console.log('模型列表 start----------------')
                    // console.log(responseData)
                    // console.log('模型列表 end----------------')
                    let list = responseData.data.data.items;
                    return list;
                }
            ).catch((error) => {
                // console.log('模型列表 err  start----------------')
                console.log(error)
                // console.log('模型列表 err  end----------------')
            });
        }

        async function getData(){
            let modellist = await _getModelList();
            // console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxx');
            // console.log(modellist);
            if(modellist && modellist.length>0){
                // console.log('aaaaaaaaa')
                let data = [];
                for(let item of modellist){
                    // console.log('bbbbbbbbbbbbbbbbb')
                    // console.log(item)
                    if(item.name==name){
                        // console.log('ccccccccccccccccc')
                        item.parentId = '0';
                        data = [...data,item];
                         let list = await _getModelList(item.fileId);
                         data = [...data,...list]
                         for(let item of list){
                             if(item.folder){
                                let list = await _getModelList(item.fileId);
                                data = [...data,...list]
                                for(let item of list){
                                    if(item.folder){
                                        let list = await _getModelList(item.fileId);
                                        data = [...data,...list]
                                        for(let item of list){
                                            if(item.folder){
                                                let list = await _getModelList(item.fileId);
                                                data = [...data,...list]
                                                for(let item of list){
                                                    if(item.folder){
                                                        let list = await _getModelList(item.fileId);
                                                        data = [...data,...list]
                                                        for(let item of list){
                                                            if(item.folder){
                                                                let list = await _getModelList(item.fileId);
                                                                data = [...data,...list]
                                                                for(let item of list){
                                                                    if(item.folder){
                                                                        let list = await _getModelList(item.fileId);
                                                                        data = [...data,...list]
                                                                        for(let item of list){
                                                                            if(item.folder){
                                                                                let list = await _getModelList(item.fileId);
                                                                                data = [...data,...list]
                                                                                for(let item of list){
                                                                                    if(item.folder){
                                                                                        let list = await _getModelList(item.fileId);
                                                                                        data = [...data,...list]
                                                                                        for(let item of list){
                                                                                            if(item.folder){
                                                                                                let list = await _getModelList(item.fileId);
                                                                                                data = [...data,...list]
                                                                                                for(let item of list){
                                                                                                    if(item.folder){
                                                                                                        let list = await _getModelList(item.fileId);
                                                                                                        data = [...data,...list]
                                                                                                        for(let item of list){
                                                                                                            if(item.folder){
                                                                                                                let list = await _getModelList(item.fileId);
                                                                                                                data = [...data,...list]
                                                                                                                for(let item of list){
                                                                                                                    if(item.folder){
                                                                                       
                                                                                                                    }
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                             }
                         }
                         let endText = name=='模型文件'?'/model':'/blueprint'
                        let key_getModelList = "/model/" + projectId + "/" + projectVersionId + "/bim/file/children"+endText;
                        // console.log('999999999999999999999999999999999999--'+endText)
                        // console.log('list='+JSON.stringify(data));
                        _saveToDb(key_getModelList,JSON.stringify(data));
                        break;
                    }
                }
            }
        }
        getData().then((a)=>{
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
