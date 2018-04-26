'use strict'

import { Toast } from 'antd-mobile';
import * as API from "app-api";
import { ActionModal } from 'app-components'
import * as UpdateDataAction from "./updateDataAction";

/**
 * request data
 * @param {{companyData, inspectCompanyData, personData, checkPoint, rectificationData, state}} requestParams 
 * companyData 施工单位
 * inspectCompanyData 检查单位
 * personData 责任人
 * checkPoint 质检项目
 * rectificationData 整改信息
 * state NewPage的state
 */
function assembleParams(requestParams) {
    let params = {};
    let state = requestParams.state;
    //施工单位
    let companyData = requestParams.companyData;
    params.constructionCompanyId = companyData.id;
    params.constructionCompanyName = companyData.name;
    //描述
    params.description = state.contentDescription;
    //检查单id
    params.inspectId = state.inspectId;
    params.code = state.code;

    //检查单位 
    let inspectCompanyData = requestParams.inspectCompanyData;
    params.inspectionCompanyId = inspectCompanyData.id;
    params.inspectionCompanyName = inspectCompanyData.name;
    //单据类型 inspection acceptance
    params.inspectionType = requestParams.inspectionType;

    //需要整改
    let rectificationData = requestParams.rectificationData;
    params.needRectification = rectificationData.value;
    params.lastRectificationDate = rectificationData.date;

    params.projectId = storage.loadProject();
    params.projectName = '';

    //质检项目
    let checkPoint = requestParams.checkPoint;
    params.qualityCheckpointId = checkPoint.id;
    params.qualityCheckpointName = checkPoint.name;

    //责任人
    let personData = requestParams.personData;
    params.responsibleUserId = personData.id;
    params.responsibleUserName = personData.name;
    params.responsibleUserTitle = personData.title;

    //关联图纸
    params.drawingGdocFileId = state.relevantBluePrint.drawingGdocFileId;
    params.drawingName = state.relevantBluePrint.drawingName;
    params.drawingPositionX = state.relevantBluePrint.drawingPositionX;
    params.drawingPositionY = state.relevantBluePrint.drawingPositionY;

    //关联模型
    params.elementName = state.relevantModel.elementName;
    params.elementId = state.relevantModel.elementId;
    params.buildingName = state.relevantModel.buildingName;
    params.buildingId = state.relevantModel.buildingId;
    params.gdocFileId = state.relevantModel.gdocFileId;
    return params;
}
/**
 * 检查必填项
 * @param {*} params 
 */
function checkMustInfo(params, callback) {
    let info = [];
    let showStar = {
        showInspectCompanyStar: false,
        showCompanyStar: false,
        showPersonStar: false,
        showDescriptionStar: false,
        showCheckpointStar: false,
        showRectificationStar: false,
    };
    //检查单位
    if (!params.inspectionCompanyId) {
        info.push('检查单位');
        showStar.showInspectCompanyStar = true;
    }
    //施工单位
    if (!params.constructionCompanyId) {
        info.push('施工单位');
        showStar.showCompanyStar = true;
    }

    //责任人
    if (!params.responsibleUserId) {
        info.push('责任人');
        showStar.showPersonStar = true;
    }
    //现场描述
    if (!(typeof params.description === 'string') || params.description.length === 0) {
        info.push('现场描述');
        showStar.showDescriptionStar = true;
    }
    //质检项目 
    if (!params.qualityCheckpointName) {
        info.push('质检项目');
        showStar.showCheckpointStar = true;
    }
    //整改期限
    if (params.needRectification && !params.lastRectificationDate) {
        info.push('整改期限');
        showStar.showRectificationStar = true;
    }
    callback(showStar);
    let len = info.length;
    if (len > 0) {
        showCheckInfoModal(info)
        return false;
    }

    if (params.needRectification) {
        // let nowTimeStamp = Date.now();
        var timeStamp = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
        if (timeStamp > params.lastRectificationDate) {
            ActionModal.alert('提示信息', "整改期限不能早于当前日期！", [{ text: '知道了', style: { color: '#00baf3' } }]);
            return false;
        }
    }

    return true;
}
/**
 * 必填项未选择弹窗
 * @param {*} info 
 */
function showCheckInfoModal(info) {
    let len = info.length;
    let msg = '您还未选择'
    if (len == 1) {
        msg = `${msg}${info[0]}`
    } else {
        for (let index in info) {
            if (index == 0) {
                msg = `${msg}${info[index]}`
            } else if (index == len - 1) {
                msg = `${msg}和${info[index]}`
            } else {
                msg = `${msg}、${info[index]}`
            }
        }
    }

    msg = `${msg}!`
    ActionModal.alertTip('提示信息', msg, { text: '知道了', style: { color: '#00baf3' } });
}

function loadingToast() {
    Toast.loading('加载中...', 0, null, true);
}

/**
 * 上传图片
 * @param {*} imageChooserEle 图片组件
 * @param {*} uploadCallback 
 */
function uploadFile(imageChooserEle, uploadCallback) {
    imageChooserEle._loadFile((files) => {
        if (files && files.length > 0) {
            API.upLoadFiles(files, (code, result) => {
                uploadCallback(result);
            });
        } else {
            uploadCallback();
        }
    });
}


/**
 * 提交
 * @param {{companyData, inspectCompanyData, personData, checkPoint, rectificationData, state}} requestParams 
 * companyData 施工单位
 * inspectCompanyData 检查单位
 * personData 责任人
 * checkPoint 质检项目
 * rectificationData 整改信息
 * state NewPage的state
 * @param {*} navigator navigator
 */
export function submit(requestParams, imageChooserEle, navigator, callback) {
    let params = assembleParams(requestParams);
    if (checkMustInfo(params, callback)) {
        loadingToast();
        uploadFile(imageChooserEle, (files) => {
            if (files) {
                params.files = files;
            }
            //区分新增提交和编辑提交
            if (params.inspectId == '-1') {
                createSubmitInspection(params, navigator);
            } else {
                editSubmitInspection(params, navigator);
            }
        });

    }
}
/**
 * 从列表提交
 * @param {*} inspectId 
 */
export function submitFromList(inspectId, callback) {
    API.getQualityInspectionDetail(storage.loadProject(), inspectId)
        .then((responseData) => {
            let params = responseData.data.inspectionInfo;
            params.inspectId = params.id;
            API.editSubmitInspection(storage.loadProject(), inspectId, params.inspectionType, JSON.stringify(params))
                .then(data => {
                    callback({ res: "success", data: data, });
                })
        }).catch(err => {
            callback({ res: "error", data: err });
        });
}


/**
 * 检查单 新增 提交
 * @param {*} params 
 */
function createSubmitInspection(params, navigator) {
    let requestParams = JSON.stringify(params);
    API.createSubmitInspection(storage.loadProject(), params.inspectionType, requestParams)
        .then(data => {
            Toast.hide();
            if (data && data.data && data.data.id) {
                storage.goBack(navigator, null);
            }
        })
}
/**
 * 检查单 编辑   提交
 */
function editSubmitInspection(params, navigator) {
    let requestParams = JSON.stringify(params);
    API.editSubmitInspection(storage.loadProject(), params.inspectId, params.inspectionType, requestParams)
        .then(data => {
            Toast.hide();
            storage.goBack(navigator, null);
        })
}
/**
 * 保存质检单
 * @param {{companyData, inspectCompanyData, personData, checkPoint, rectificationData, state}} requestParams 
 * companyData 施工单位
 * inspectCompanyData 检查单位
 * personData 责任人
 * checkPoint 质检项目
 * rectificationData 整改信息
 * state NewPage的state
 * @param {*} callback 请求完成后回调
 */
export function save(requestParams, imageChooserEle, callback) {
    let params = assembleParams(requestParams);
    if (checkMustInfo(params, callback)) {
        loadingToast();
        uploadFile(imageChooserEle, (files) => {
            if (files) {
                params.files = files;
            }
            //区分新增提交和编辑提交
            if (params.inspectId == '-1') {
                createSaveInspection(params, callback);
            } else {
                editSaveInspection(params, callback);
            }
        });
    }
}

/**
 * 检查单 新增 保存
 * @param {*} params 
 */
function createSaveInspection(params, callback) {
    let requestParams = JSON.stringify(params);
    API.createSaveInspection(storage.loadProject(), params.inspectionType, requestParams)
        .then(data => {
            Toast.hide();
            if (data) {
                callback({
                    inspectId: data.data.id,
                    code: data.data.code,
                });
            }
        })
}
/**
 * 检查单 编辑   保存
 * @param {*} params 
 */
function editSaveInspection(params) {
    let requestParams = JSON.stringify(params);
    API.editSaveInspection(storage.loadProject(), params.inspectId, params.inspectionType, requestParams)
        .then(data => {
            console.log(data)
            Toast.hide();
        })
}

/**
 * 删除草稿
 */
export function deleteInspection(inspectId, inspectionType, callback) {
    API.createDeleteInspection(storage.loadProject(), inspectionType, inspectId)
        .then(data => {
            callback();
        })
}

/**
 * 重不同页面进入新建时返回初始state
 * @param {*} params 
 * @param {*} callback 
 */
export function initialState(params, checkPoint, callback) {
    if (!params) {
        params = {};
    }
    //从列表编辑页进入
    if (params && params.item) {
        getQualityInspectionDetail(params.item.value.id, callback)
    } else {
        //从首页图纸进入
        let relevantBlueprint = {};
        if (params.relevantBlueprint) {
            relevantBlueprint = params.relevantBlueprint;
        }
        //从质检项目进入
        let selectedCheckPoint = {};
        if (checkPoint) {
            selectedCheckPoint = checkPoint;
        }
        //从首页模型进入
        let relevantModel = {};
        if (params.relevantModel) {
            relevantModel = params.relevantModel;
        }
        let temp = {
            relevantBluePrint: relevantBlueprint,
            relevantModel: relevantModel,
            selectedCheckPoint: selectedCheckPoint,
            isLoading: false,
        };
        callback(temp);
    }
}

/**
 * 待提交进入时获取质检单详情
 * @param {*} fileId 质检单id
 */
export function getQualityInspectionDetail(fileId, callback) {
    API.getQualityInspectionDetail(storage.loadProject(), fileId)
        .then((responseData) => {

            let editInfo = {};
            if (responseData.data && responseData.data.inspectionInfo) {
                editInfo = getDetailInfo(responseData.data.inspectionInfo)
            }
            editInfo.isLoading = false;
            callback(editInfo);
        }).catch(err => {
            callback({
                isLoading: false,
            });
        });
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
        editInfo: info,
        contentDescription: contentDescription,//内容描述
        inspectId: inspectId,//检查单id
        code: code,
        projectId: projectId,
        projectName: projectName,
        files: info.files,//图片
        selectedCheckPoint: selectedCheckPoint,//选中的质检项目
        relevantBluePrint: relevantBlueprint,//关联图纸
        relevantModel: relevantModel,//关联模型
        rectificationData: rectificationData,
    };

    return ret;
}
