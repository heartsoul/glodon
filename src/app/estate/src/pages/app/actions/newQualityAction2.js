'use strict'

import * as types from '../constants/newQualityTypes';
import * as API from "app-api";
import OfflineStateUtil from '../../../common/utils/OfflineStateUtil'
import OfflineManager from '../../offline/manager/OfflineManager'
let responseCount = 0;//请求完成的次数

export function fetchData(params) {
    return dispatch => {
        dispatch(_loadingStart());
        getPageParams(params, dispatch);
    }
}

/**
 * 获取新建时需要用到的参数，包括编辑的详情、检查单位、验收单位、关联模型构件的名称一级从新建入口传入的参数
 * @param {*} params 
 * @param {*} dispatch 
 */
function getPageParams(params, dispatch) {
    responseCount = 0;
    let totalRequestCount = 2;//请求的次数
    let isEdit = false;//由列表待提交进入编辑页面
    if (params && params.item && params.item.value) {
        isEdit = true;
    }

    let isFromModel = params.relevantModel;//从模型页进入
    if (isEdit) {
        totalRequestCount++;
    } else if (isFromModel) {
        totalRequestCount++;
    }
    let editParams = {
        editInfo: {},
        noimage: params.noimage,//是否显示选择图片
    };
    _getInspectionCompanies()//获取检查单位
        .then(data => {
            editParams.inspectionCompanies = data;
            isFetchDone(params, editParams, totalRequestCount, dispatch);
        }).catch(error => {
            dispatch(_loadingError());
            // isFetchDone(params, editParams, totalRequestCount, dispatch);
        });
    _getSupporters()//获取施工单位
        .then(data => {
            editParams.supporters = data;
            isFetchDone(params, editParams, totalRequestCount, dispatch);
        }).catch(error => {
            dispatch(_loadingError());
            // isFetchDone(params, editParams, totalRequestCount, dispatch);
        });
    if (isEdit) {
        _getQualityInspectionDetail(params.item.value.id)//获取编辑的详情
            .then(data => {
                editParams.editInfo = data;
                editParams.isEdit = true;
                if (data && data.files && data.files.length > 0) {
                    loadFileUrls(editParams.editInfo.files, (files) => {
                        isFetchDone(params, editParams, totalRequestCount, dispatch);
                    })
                } else {
                    isFetchDone(params, editParams, totalRequestCount, dispatch);
                }
            }).catch(error => {
                dispatch(_loadingError());
                // isFetchDone(params, editParams, totalRequestCount, dispatch);
            });
    } else if (isFromModel) {//从模型进入，获取构件名称
        _getModelElementProperty(params.relevantModel.gdocFileId, params.relevantModel.elementId)
            .then((elementName) => {
                params.relevantModel.elementName = elementName;
                if (!editParams.editInfo) {
                    editParams.editInfo = {};
                }
                editParams.editInfo.relevantModel = params.relevantModel;
                isFetchDone(params, editParams, totalRequestCount, dispatch);
            }).catch((error) => {
                dispatch(_loadingError());
                // isFetchDone(params, editParams, totalRequestCount, dispatch);
            });
    }

}

function loadFileUrls(files, finsh) {
    let countAll = files.length;
    files.map((item, index) => {
        API.getBimFileUrl(item.objectId, (success, data) => {
            countAll--;
            if (success) {
                files[index].url = data;
            }
            if (countAll < 1) {
                finsh(files);
            }
        }).catch((err) => {
            dispatch(_loadingError());
            countAll--;
            if (countAll < 1) {
                finsh(files);
            }
        })
    });
}
/**
 * 请求完成
 * @param {*} params 
 * @param {*} editParams 
 * @param {*} totalRequestCount 
 * @param {*} dispatch 
 */
function isFetchDone(params, editParams, totalRequestCount, dispatch) {
    responseCount++;
    if (responseCount === totalRequestCount) {
        let transformInfo = getTransformInfo(params);
        if (transformInfo.files || transformInfo.relevantBlueprint || transformInfo.selectedCheckPoint) {
            editParams.editInfo = transformInfo;
        }
        dispatch(_loadingDone(editParams));
    }
}


/**
 * 整理从不同入口进入新建页面时的参数
 * @param {*} params 
 * @param {*} callback 
 */
function getTransformInfo(params) {
    let isEdit = params && params.item && params.item.value;//由列表待提交进入编辑页面
    let editInfo = {};
    if (!isEdit) {
        //相机、相册
        if (params.files) {
            editInfo.files = params.files;
        }
        //从首页图纸进入
        if (params.relevantBlueprint) {
            editInfo.relevantBlueprint = params.relevantBlueprint;
        }
        //从质检项目进入
        if (params.qualityCheckpointId) {
            let selectedCheckPoint = {
                id: params.qualityCheckpointId,
                name: params.qualityCheckpointName
            };
            editInfo.selectedCheckPoint = selectedCheckPoint;
        }
    }
    return editInfo;
}


/**
 * 待提交进入时获取质检单详情
 * @param {*} fileId 质检单id
 */
function _getQualityInspectionDetail(fileId) {
    if(OfflineStateUtil.isOnLine()){
        return API.getQualityInspectionDetail(storage.loadProject(), fileId)
            .then((responseData) => {
                let params = {};
                if (responseData.data && responseData.data.inspectionInfo) {
                    params = getDetailInfo(responseData.data.inspectionInfo)
                }
                return params;
            });
    }else{
        let qualityManager = OfflineManager.getQualityManager();
        return qualityManager.getQualityDetail(fileId)
        .then((responseData) => {
            let params = {};
                if (responseData && responseData.inspectionInfo) {
                    params = getDetailInfo(responseData.inspectionInfo)
                }
                return params;
        })
    }
}

/**
 * 返回编辑信息
 * @param {*} info 
 */
function getDetailInfo(info) {

    let contentDescription = info.description;
    let inspectId = info.id;
    let code = info.code;
    let inspectionType = info.inspectionType;
    let projectId = info.projectId;
    let projectName = info.projectName;


    //整改信息
    let rectificationData = {
        value: info.needRectification,
        date: info.lastRectificationDate,
    };

    let selectedCheckPoint = {
        id: info.qualityCheckpointId,//-1
        name: info.qualityCheckpointName,
    }

    let relevantBlueprint = {
        drawingGdocFileId: info.drawingGdocFileId,
        drawingName: info.drawingName,
        drawingPositionX: info.drawingPositionX,
        drawingPositionY: info.drawingPositionY,
    }

    //关联模型
    let relevantModel = {
        gdocFileId: info.gdocFileId,
        buildingName: info.buildingName,
        buildingId: info.buildingId,
        elementId: info.elementId,
        elementName: info.elementName,
    }

    let ret = {
        inspectionInfo: info,
        editInfo: info,
        contentDescription: contentDescription,//内容描述
        inspectId: inspectId,//检查单id
        code: code,
        projectId: projectId,
        projectName: projectName,
        files: info.files,//图片
        selectedCheckPoint: selectedCheckPoint,//选中的质检项目
        relevantBlueprint: relevantBlueprint,//关联图纸
        relevantModel: relevantModel,//关联模型
        rectificationData: rectificationData,
    };

    return ret;
}

/**
 * 获取选择模型构件的信息
 */
function _getModelElementProperty(gdocFileId, elementId) {
    return API.getModelElementProperty(storage.loadProject(), storage.projectIdVersionId, gdocFileId, elementId)
        .then(responseData => {
            let elementName = responseData.data.data.name;
            return elementName;
        });
}


/**
  * 获取项目下检查单位列表
  */
function _getInspectionCompanies() {
    return API.getInspectionCompanies(storage.loadProject())
    .then(data => {
        console.log('333333333333')
        console.log(data)
        let inspectionCompanies = [];
        if (data && data.data) {
            inspectionCompanies = data.data;
        }
        return inspectionCompanies;
    });
    
}

/**
 * 获取施工单位列表
 */
function _getSupporters() {
    return API.getCompaniesList(storage.loadProject(), 'SGDW')
        .then(data => {
            let supporters = [];
            if (data && data.data) {
                supporters = data.data;
            }
            return supporters;
        });
}


function _loadingStart() {
    return {
        type: types.NEW_QUALITY_LOADING_START,
        isLoading: true,
    }
}

function _loadingDone(editParams) {
    return {
        type: types.NEW_QUALITY_LOADING_DONE,
        editQualityParams: editParams,
        isLoading: false,
    }
}

function _loadingError(){
    return {
        type: types.NEW_QUALITY_LOADING_ERROR,
        loadingError: true,
    }
}

export function reset(){
    return {
        type: types.NEW_QUALITY_RESET,
    }
}