import * as API from 'app-api'
import * as types from '../constants/equipmentInfoTypes'
import { Toast } from 'antd-mobile';
import * as UpdateDataAction from "./updateDataAction";
import OfflineStateUtil from '../../../common/utils/OfflineStateUtil'
import OfflineManager from '../../offline/manager/OfflineManager'

/**
 * 是否有过修改
 * @param {*} info 
 * @param {*} oldInfo 原始数据或者保存后的数据
 * @param {*} callback 
 */
export function isEditInfoChange(info, oldInfo,callback) {
    if (isParamsChange(info, oldInfo)) {
        callback(true);
    } else {
        callback(false);
    }
}
function isParamsChange(info, oldInfo) {
   
    let ret = false;
    // if(!info.id) {
    //     return true;
    // }
    if(info.acceptanceCompanyName != oldInfo.acceptanceCompanyName) {
        return true;
    }
    if(info.batchCode != oldInfo.batchCode) {
        return true;
    }
    if(info.approachDate != oldInfo.approachDate) {
        return true;
    }
    if(info.facilityCode != oldInfo.facilityCode) {
        return true;
    }
    if(info.facilityName != oldInfo.facilityName) {
        return true;
    }
    
    if(info.quantity != oldInfo.quantity) {
        return true;
    }
    if(info.unit != oldInfo.unit) {
        return true;
    }
    if(info.specification != oldInfo.specification) {
        return true;
    }
    if(info.modelNum != oldInfo.modelNum) {
        return true;
    }
    if(info.elementId != oldInfo.elementId) {
        return true;
    }
    if(info.elementName != oldInfo.elementName) {
        return true;
    }
    if(info.manufacturer != oldInfo.manufacturer) {
        return true;
    }
    if(info.brand != oldInfo.brand) {
        return true;
    }
    if(info.supplier != oldInfo.supplier) {
        return true;
    }
    if(info.qualified != oldInfo.qualified) {
        return true;
    }  
    
    if(info.qualified != oldInfo.qualified) {
        return true;
    }  
    let f1 = !info.files? '' : JSON.stringify(info.files);
    let f2 = !oldInfo.files? '' : JSON.stringify(oldInfo.files);
    
    if(f1 != f2 ) {
        console.log(">>>>>f1:"+f1+"\n>>>>>f2:"+f2)
        return true;
    }
    return ret;
}
function generateFileParams(files) {
    let fileParams = [];
    if (files) {
        files.map((item) => {
            let file = {
                name: item.name,
                objectId: item.objectId,
                extension: item.extension,
                digest: item.digest,
                uploadTime: item.uploadTime,
            }
            fileParams.push(file)
        })
    }
    return fileParams;
}

function buildRequestParams(params, type){
    let requestParams = {...params};
    requestParams.files = generateFileParams(params.files)
    return JSON.stringify(requestParams);
}

/**
 * 提交材设单 新增时的response {"id": 5200418,"code": "CSYS_20180504_002"}，编辑时response未测试。
 * @param {*} params 
 */
export function submit(params, navigator) {
    let requestParams = {...params}
    delete requestParams.editType,
    delete requestParams.preEditType,
    delete requestParams.skip,

    requestParams.projectId = storage.loadProject();
    requestParams.projectName = storage.loadCurrentProjectName();
    let fieldId = params.id;//根据单据id区分编辑和新增
    loadingToast();
    return dispatch => {
        uploadFile(params.files, (files) => {
            if (files) {
                requestParams.files = files;
                params.files = files;
            }
            let props = buildRequestParams(requestParams);
            if (fieldId && fieldId != 0) {
                API.equipmentEditSubmit(storage.loadProject(), fieldId, props)
                    .then((responseData) => {
                        Toast.hide();
                        dispatch(UpdateDataAction.updateData());
                        storage.goBack(navigator, null);
                    }).catch(error => {
                        Toast.hide();
                        console.log(error);
                    })
            } else {
                API.equipmentCreateSubmit(storage.loadProject(),props)
                    .then((responseData) => {
                        Toast.hide();
                        dispatch(UpdateDataAction.updateData());
                        storage.goBack(navigator, null);
                    }).catch(error => {
                        Toast.hide();
                        console.log(error);
                    })
            }
        });
        
    }
}

/**
 * 保存材设单 新增时的response {"id": 5200418,"code": "CSYS_20180504_002"}，编辑时response未测试。
 * @param {*} params 
 */
export function save(params) {
    let requestParams = {...params}
    delete requestParams.editType,
    delete requestParams.preEditType,
    delete requestParams.skip,
    requestParams.projectId = storage.loadProject();
    requestParams.projectName = storage.loadCurrentProjectName();
    let fieldId = requestParams.id;//根据单据id区分编辑和新增
    loadingToast();
    return dispatch => {
        uploadFile(requestParams.files, (files) => {
            if (files) {
                requestParams.files = files;
                params.files = files;
            }
            let props = buildRequestParams(requestParams);

            if (fieldId && fieldId != 0) {
                API.equipmentEditSave(storage.loadProject(), fieldId, props)
                    .then((responseData) => 
                    {
                        dispatch(UpdateDataAction.updateData());
                        loadDetail(dispatch, fieldId);
                        Toast.success('保存成功', 1);
                    }).catch(error => {
                        Toast.hide();
                        console.log(error);
                    })
            } else {
                API.equipmentCreateSave(storage.loadProject(), props)
                    .then((responseData) => {
                        params.id = responseData.data.id;
                        params.code = responseData.data.code;
                        dispatch(UpdateDataAction.updateData());
                        loadDetail(dispatch, params.id);
                        Toast.success('保存成功', 1);
                    }).catch(error => {
                        console.log(error);
                        Toast.hide();
                    })
            }
           
        });
    }
}

/**
 * 删除，response no content
 * @param {*} fieldId 单据id 
 */
export function equipmentDelete(fieldId, navigator) {
    return dispatch => {
        API.equipmentDelete(storage.loadProject(), fieldId)
            .then((responseData) => {
                Toast.hide();
                dispatch(UpdateDataAction.updateData());
                storage.goBack(navigator, null);
            }).catch(error => {
                console.log(error);
                Toast.hide();
            })
    }
}

// 获取数据
export function fetchData(fieldId) {
    return dispatch => {

        equipmentAcceptanceCompanies(dispatch);

        if (!fieldId) {
            dispatch(_loadSuccess({}));
            return;
        }
        // dispatch(_loading());
        loadDetail(dispatch, fieldId);
    }    
}

function loadDetail(dispatch,fieldId) {
    if(OfflineStateUtil.isOnLine()){
        API.equipmentDetail(storage.loadProject(), fieldId).then((responseData) => {
            if (responseData.data.files && responseData.data.files.length > 0) {
                loadFileUrls(responseData.data.files, (files) => {
                    responseData.data.files = files;
                    dispatch(_loadSuccess(responseData.data));
                });
            }
            else {
                dispatch(_loadSuccess(responseData.data));
            }
        }).catch(error => {
            dispatch(_loadError(error));
        });
    }else{
        let equimentManager = OfflineManager.getEquipmentManager();
        equimentManager.getQualityDetail(fieldId).then((responseData) => {
            if (responseData.data.files && responseData.data.files.length > 0) {
                loadFileUrls(responseData.data.files, (files) => {
                    responseData.data.files = files;
                    dispatch(_loadSuccess(responseData.data));
                });
            }
            else {
                dispatch(_loadSuccess(responseData.data));
            }
        }).catch(error => {
            dispatch(_loadError(error));
        });
    }
    
}

function loadFileUrls(files, finsh) {
    let countAll = files.length;
    files.map((item,index)=>{
        API.getBimFileUrl(item.objectId, (success, data) => {
            countAll--;
            if (success) {
                files[index].url = data;
            }
            if (countAll < 1) {
               finsh(files);
            }
        }).catch((err) => {
            countAll--;
            if (countAll < 1) {
                finsh(files);
            }
        })
    });
   
}
/**
 * 上传图片
 * @param {*} imageChooserEle 图片组件
 * @param {*} uploadCallback 
 */
function uploadFile(files, uploadCallback) {
    if (files && files.length > 0) {
        API.upLoadFiles(files, (code, result) => {
            if (code === "success") {
                uploadCallback(result);
            } else {
                Toast.hide();
                Toast.info("上传图片失败", 1);
            }
        });
    } else {
        uploadCallback();
    }
}
/**
 * 获取选择模型构件的信息
 */
export function getModelElementProperty(relevantEquipmentModle, equipmentInfo) {
    return dispatch => {
        API.getModelElementProperty(storage.loadProject(), storage.projectIdVersionId, relevantEquipmentModle.gdocFileId, relevantEquipmentModle.elementId)
        .then(responseData => {
            if(!equipmentInfo){
                equipmentInfo = {};
            }
            equipmentInfo.gdocFileId = relevantEquipmentModle.gdocFileId;
            equipmentInfo.buildingId = relevantEquipmentModle.buildingId;
            equipmentInfo.buildingName = relevantEquipmentModle.buildingName;
            equipmentInfo.elementId = relevantEquipmentModle.elementId;
            equipmentInfo.elementName = responseData.data.data.name;
            equipmentInfo.approachDate = new Date().getTime();
            dispatch(_loadPage({ ...equipmentInfo }));
        }).catch(error => {
            console.log(error);
        });
    }
}

function loadingToast() {
    Toast.loading('加载中...', 0, null, true);
}

function equipmentAcceptanceCompanies(dispatch) {
    API.equipmentAcceptanceCompanies(storage.loadProject())
        .then(responseData => {
            dispatch(_loadingAcceptanceCompaniesSuccess(responseData.data));
        }).catch(error => { })
    
}


export function switchPage(data) {
    return dispatch => {
        dispatch(_loadPage(data));
    }
}

export function reset() {
    return dispatch => {
        dispatch(_reset())
    }
}

function _loading() {
    return {
        type: types.EQUIPMENT_INFO_DOING,
    }
}

function _loadingAcceptanceCompaniesSuccess(data) {
    return {
        type: types.EQUIPMENT_ACCEPTANCE_COMPANIES,
        acceptanceCompanies: data,
    }
}

function _loadSuccess(data) {
    return {
        type: types.EQUIPMENT_INFO_DONE,
        data: data,
    }
}

function _loadPage(data) {
    return {
        type: types.EQUIPMENT_INFO_PAGE,
        data: data,
    }
}
function _reset() {
    return {
        type: types.EQUIPMENT_INFO_INIT,
    }
}
function _loadError(error) {
    return {
        type: types.EQUIPMENT_INFO_ERROR,
        error: error,
    }
}
