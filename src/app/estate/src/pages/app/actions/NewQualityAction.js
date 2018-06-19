'use strict'

import { Toast } from 'antd-mobile';
import * as API from "app-api";
import { ActionModal } from 'app-components'
import * as UpdateDataAction from "./updateDataAction";
import OfflineStateUtil from '../../../common/utils/OfflineStateUtil';
import OfflineManager from '../../offline/manager/OfflineManager';

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
    params.constructionCompanyId = companyData.coperationId;
    params.constructionCompanyName = companyData.name;
    //描述
    params.description = state.contentDescription;
    //检查单id
    params.inspectId = state.inspectId;
    if (params.inspectId && params.inspectId < 0) {
        params.inspectId = 0;
    }
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
    params.projectName = storage.loadCurrentProjectName();

    //质检项目
    let checkPoint = requestParams.checkPoint;
    params.qualityCheckpointId = checkPoint.id;
    params.qualityCheckpointName = checkPoint.name;

    //责任人
    let personData = requestParams.personData;
    params.responsibleUserId = personData.userId;
    params.responsibleUserName = personData.name;
    params.responsibleUserTitle = personData.title;

    //关联图纸
    let relevantBlueprint = state.relevantBlueprint;
    if (relevantBlueprint) {
        params.drawingGdocFileId = relevantBlueprint.drawingGdocFileId;
        params.drawingName = relevantBlueprint.drawingName;
        params.drawingPositionX = relevantBlueprint.drawingPositionX;
        params.drawingPositionY = relevantBlueprint.drawingPositionY;
    }

    //关联模型
    let relevantModel = state.relevantModel;
    if (relevantModel) {
        params.elementName = relevantModel.elementName;
        params.elementId = relevantModel.elementId;
        params.buildingName = relevantModel.buildingName;
        params.buildingId = relevantModel.buildingId;
        params.gdocFileId = relevantModel.gdocFileId;
    }

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
    if (!imageChooserEle) {
        return;
    }
    imageChooserEle._loadFile((files) => {
        if (files && files.length > 0) {
            API.upLoadFiles(files, (code, result) => {
                console.log('uploadresult:' + code + ',data:' + JSON.stringify(result));
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
export function submit(requestParams, imageChooserEle, navigator, callback, updateData) {
    let params = assembleParams(requestParams);
    if (checkMustInfo(params, callback)) {
        loadingToast();
        uploadFile(imageChooserEle, (files) => {
            if (files) {
                params.files = files;
            }
            //区分新增提交和编辑提交
            if (params.inspectId === 0) {
                createSubmitInspection(params, navigator, updateData);
            } else {
                editSubmitInspection(params, navigator, updateData);
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
                // console.log('55555555555555555555555555555f33333333333')
                // console.log(data)
                callback({ res: "success", data: data, });
            }).catch(err => {
                Toast.hide();
            })
    }).catch(err => {
        Toast.hide();
        callback({ res: "error", data: err });
    });
    
}


/**
 * 检查单 新增 提交
 * @param {*} params 
 */
function createSubmitInspection(params, navigator, updateData) {
    delete params.inspectId;
    let requestParams = buildRequestParams(params);
    API.createSubmitInspection(storage.loadProject(), params.inspectionType, requestParams)
        .then(data => {
            // console.log('---------1111111111---------')
            // console.log(data)
            if (updateData) {
                updateData();
            }
            Toast.hide();
            if (data && data.data && data.data.id) {
                storage.goBack(navigator, null);
            }
        }).catch(err => {
            Toast.hide();
            Toast.info("提交失败", 1);
        })
}
/**
 * 检查单 编辑   提交
 */
function editSubmitInspection(params, navigator, updateData) {
    let inspectId = params.inspectId;
    delete params.inspectId;
    let requestParams = buildRequestParams(params);
    API.editSubmitInspection(storage.loadProject(), inspectId, params.inspectionType, requestParams)
        .then(data => {
            if (updateData) {
                updateData();
            }
            Toast.hide();
            storage.goBack(navigator, null);
        }).catch(err => {
            Toast.hide();
            Toast.info("提交失败", 1);
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
            // console.log('444444444444444444')
            // console.log(params)
            //区分新增提交和编辑提交
            if (params.inspectId > 0) {
                editSaveInspection(params, callback);
            } else {
                createSaveInspection(params, callback);
            }
        });
    }
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
 * 检查单 新增 保存
 * @param {*} params 
 */
function createSaveInspection(params, callback) {
    if(OfflineStateUtil.isOnLine()){
        delete params.inspectId;
    }
    let requestParams = buildRequestParams(params);
    API.createSaveInspection(storage.loadProject(), params.inspectionType, requestParams)
        .then(data => {
            Toast.hide();
            if (data) {
                params.id = data.data.id;
                params.code = data.data.code;
                    callback({
                        inspectId: data.data.id,
                        code: data.data.code,
                        inspectionInfo: params,
                    });
                
                Toast.success('保存成功', 1);
            }
        }).catch(err => {
            Toast.hide();
            Toast.info("保存失败", 1);
        })
}
/**
 * 检查单 编辑   保存
 * @param {*} params 
 */
function editSaveInspection(params, callback) {
    let inspectId = params.inspectId;
    delete params.inspectId;
    let requestParams = buildRequestParams(params);
    API.editSaveInspection(storage.loadProject(), inspectId, params.inspectionType, requestParams)
        .then(data => {
            console.log(data)
            Toast.hide();
            callback({
                inspectionInfo: params,
            });
            Toast.success('保存成功', 1);
        }).catch(err => {
            Toast.hide();
            console.log(err)
            Toast.info("保存失败", 1);
        })
}

/**
 * 是否有过修改
 * @param {*} requestParams 
 * @param {*} inspectionInfo 原始数据或者保存后的数据
 * @param {*} imageChooserEle 
 * @param {*} callback 
 */
export function isEditInfoChange(requestParams, inspectionInfo, imageChooserEle, callback) {
    if (!imageChooserEle) {
        callback(false);
        return;
    }
    imageChooserEle._loadFile((files) => {
        if (isFileChange(inspectionInfo.files, files)) {
            callback(true);
        } else if (isParamsChange(requestParams, inspectionInfo)) {
            callback(true);
        } else {
            callback(false);
        }
    });
}

function isFileChange(oldFiles, newFiles) {
    let oldLen = oldFiles ? oldFiles.length : 0;
    let newLen = newFiles ? newFiles.length : 0;
    resetFiles(oldFiles, newFiles);
    if (oldLen != newLen) {
        return true;
    } else {
        for (let index in newFiles) {
            if (!(newFiles[index]).objectId) {
                return true;
            }
        }
        return false;
    }
    return false;
}

function resetFiles(oldFiles, newFiles) {
    if (newFiles) {
        newFiles.map((item) => {
            let oldFile = relateOldFile(oldFiles, item);
            if (oldFile) {
                item.name = oldFile.name;
                item.objectId = oldFile.objectId;
                item.extension = oldFile.extension;
                item.digest = oldFile.digest;
                item.length = oldFile.length;
                item.uploadTime = oldFile.uploadTime;
            }
        })
    }
}

function relateOldFile(oldFiles, file) {
    if (oldFiles) {
        for (let index in oldFiles) {
            if (oldFiles[index].path === file.path) {
                return oldFiles[index];
            }
        }
    }
    return null;
}


function isParamsChange(requestParams, inspectionInfo) {
    let params = assembleParams(requestParams);

    if (inspectionInfo.code != params.code) {
        return true;
    }
    if (inspectionInfo.qualityCheckpointName != params.qualityCheckpointName) {
        return true;
    }
    if (inspectionInfo.inspectionCompanyId != params.inspectionCompanyId) {
        return true;
    }
    if (inspectionInfo.constructionCompanyId != params.constructionCompanyId) {
        return true;
    }
    if (inspectionInfo.needRectification != params.needRectification) {
        return true;
    }
    if (inspectionInfo.needRectification && params.needRectification) {
        if (inspectionInfo.lastRectificationDate != params.lastRectificationDate) {
            return true;
        }
    }
    if (inspectionInfo.description != params.description) {
        return true;
    }

    if (inspectionInfo.responsibleUserId != params.responsibleUserId) {
        return true;
    }
    if (inspectionInfo.drawingGdocFileId != params.drawingGdocFileId) {
        return true;
    }
    if (inspectionInfo.gdocFileId != params.gdocFileId) {
        return true;
    }
    return false;
}


/**
 * 删除草稿
 */
export function deleteInspection(inspectId, inspectionType, callback) {
    API.createDeleteInspection(storage.loadProject(), inspectionType, inspectId)
        .then(data => {
            callback();
        }).catch(err => {
            Toast.hide();
            Toast.info("删除失败", 1);
        })
}

/**
 * 获取选择模型构件的信息
 */
export function getModelElementProperty(relevantModel, callback) {
    API.getModelElementProperty(storage.loadProject(), storage.projectIdVersionId, relevantModel.gdocFileId, relevantModel.elementId)
        .then(responseData => {
            relevantModel.elementName = responseData.data.data.name;
            callback({ relevantModel: relevantModel })
        });
}