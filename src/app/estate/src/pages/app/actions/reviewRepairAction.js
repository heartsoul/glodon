import * as API from 'app-api';
import * as types from "./../constants/reviewRepairTypes";
import { Modal, Toast } from 'antd-mobile';
import * as UpdateDataAction from "./updateDataAction";

export function fetchData(fieldId, type) {
    return dispatch => {
        getQualityInfo(fieldId, dispatch);
        if (type === API.CREATE_TYPE_REVIEW) {//新建复查单
            getReviewInfo(fieldId, dispatch);
        } else if (type === API.CREATE_TYPE_RECTIFY) {//新建整改单
            getRepairInfo(fieldId, dispatch);
        }
    }
}

function loadingToast() {
    Toast.loading('加载中...', 0, null, true);
}


/**
 * 获取质检单详情
 */
function getQualityInfo(fieldId, dispatch) {
    API.getQualityInspectionDetail(storage.loadProject(), fieldId).then((responseData) => {
        dispatch(_loadDetailSuccess(responseData.data));
    }).catch(err => {
        dispatch(_loadError(err));
    });
}

/**
 * 获取以前保存的复查单信息
 */
function getReviewInfo(fieldId, dispatch) {
    API.getReviewInfo(storage.loadProject(), fieldId).then((responseData) => {
        dispatch(_loadEditInfoSuccess(responseData.data));
    }).catch(err => {
        dispatch(_loadError(err))
    });
}
/**
 * 获取以前保存的整改单信息
 */
function getRepairInfo(fieldId, dispatch) {
    API.getRepairInfo(storage.loadProject(), fieldId).then((responseData) => {
        dispatch(_loadEditInfoSuccess(responseData.data));
    }).catch(err => {
        dispatch(_loadError(err))
    });
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
 * 复查单的参数
 * @param {*} inspectionId 
 * @param {*} description 
 * @param {*} status 
 * @param {*} lastRectificationDate 
 * @param {*} editInfo //草稿信息
 */
function assembleReviewParams(inspectionId, description, status, lastRectificationDate, qualityInfo, editInfo) {
    let ret = {
        code: editInfo.code,
        description: description,
        inspectionId: inspectionId,
        status: status,
        //整改期限
        lastRectificationDate: lastRectificationDate.getTime(),
        // 复查单对应的整改单的id
        rectificationId: getRectificationId(qualityInfo),
    }
    return ret;
}
/**
 * 整改单的参数
 * @param {*} inspectionId 
 * @param {*} description 
 * @param {*} status 
 * @param {*} lastRectificationDate 
 * @param {*} editInfo //草稿信息
 */
function assembleRepairParams(inspectionId, description, qualityInfo, editInfo) {
    let ret = {
        code: editInfo.code,
        description: description,
        inspectionId: inspectionId,
        flawId: getFlawId(qualityInfo, inspectionId),
    }
    return ret;
}

/**
 * 复查单对应的整改单的id
 */
function getRectificationId(qualityInfo) {
    if (qualityInfo) {
        let progressInfos = qualityInfo.progressInfos;
        if (progressInfos && progressInfos.length > 0) {
            return progressInfos[progressInfos.length - 1].id;
        }
    }
    return "";
}

/**
 * 整改单flawId，最后一条如果是复查单  传此code 如果没有  则是检查单的code
 */
function getFlawId(qualityInfo, inspectionId) {
    let flawId = inspectionId;
    if (qualityInfo) {
        let progressInfos = qualityInfo.progressInfos;
        if (progressInfos && progressInfos.length > 0) {
            flawId = progressInfos[progressInfos.length - 1].id;
        } 
    }
    return flawId;
}

/**
 * 校验复查单必填信息
 */
function checkReviewMustInfo(params) {
    let isDescriptionEmpty = (!params.description || params.description.length == 0);
    let isDateEmpty = (!params.lastRectificationDate || params.lastRectificationDate.length == 0);
    let isDateDisable = false;
    if (!isDateEmpty) {
        var timeStamp = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
        isDateDisable = (timeStamp > params.lastRectificationDate);
    }

    let msg = "";
    let checked = true;//是否合格
    if (params.status === API.STATUS_CLOSED) {
        checked = (!isDescriptionEmpty && !isDateEmpty && !isDateDisable)
        if (isDescriptionEmpty && isDateEmpty) {
            msg = "您还未选择现场情况描述和整改期限!";
        } else if (isDescriptionEmpty) {
            msg = "您还未选择现场情况描述!";
        } else if (isDateEmpty) {
            msg = "您还未选择整改期限!";
        } else if (isDateDisable) {
            msg = "整改期限不能早于当前日期！";
        }
    } else if (params.status === API.STATUS_NOT_ACCEPTED) {
        checked = !isDescriptionEmpty;
        if (isDescriptionEmpty) {
            msg = "您还未选择现场情况描述!";
        }
    }
    let ret = { checked: checked, msg: msg }
    return ret;
}

/**
 * 校验整改单必填信息
 */
function checkRepairMustInfo(params) {
    let isDescriptionEmpty = (!params.description || params.description.length == 0);
    let msg = "";
    let checked = true;//是否合格
    checked = !isDescriptionEmpty;
    if (isDescriptionEmpty) {
        msg = "您还未选择现场情况描述!";
    }
    let ret = { checked: checked, msg: msg }
    return ret;
}

/**
 * 提交
 * @param {*} inspectionId 
 * @param {*} description 
 * @param {*} status 
 * @param {*} lastRectificationDate 
 * @param {*} qualityInfo 
 * @param {*} editInfo 
 * @param {*} type 
 */
export function submit(inspectionId, description, status, lastRectificationDate, qualityInfo, editInfo, type, navigator, imageChooserEle) {
    return dispatch => {
        if (type === API.CREATE_TYPE_REVIEW) {//新建复查单
            submitReview(inspectionId, description, status, lastRectificationDate, qualityInfo, editInfo, dispatch, navigator, imageChooserEle);
        } else if (type === API.CREATE_TYPE_RECTIFY) {//新建整改单
            submitRepair(inspectionId, description, qualityInfo, editInfo, dispatch, navigator, imageChooserEle);
        }
    }
}

/**
 * 提交整改单
 * @param {*} inspectionId 
 * @param {*} description 
 * @param {*} status //整改单为空
 * @param {*} lastRectificationDate //整改单为空
 * @param {*} qualityInfo 
 * @param {*} editInfo 
 * @param {*} dispatch 
 * @param {*} navigator 
 */
function submitReview(inspectionId, description, status, lastRectificationDate, qualityInfo, editInfo, dispatch, navigator, imageChooserEle) {
    let reviewId = editInfo.id;
    let params = assembleReviewParams(inspectionId, description, status, lastRectificationDate, qualityInfo, editInfo);
    let mustInfo = checkReviewMustInfo(params);

    if (mustInfo.checked) {
        loadingToast();
        uploadFile(imageChooserEle, (files) => {
            if (files) {
                params.files = files;
            }
            let props = JSON.stringify(params);
            if (!reviewId) {//新建提交
                API.createSubmitReview(storage.loadProject(), props).then(responseData => {
                    //pop页面
                    dispatch(UpdateDataAction.updateData());
                    storage.goBack(navigator, null)
                    Toast.hide();
                }).catch((err)=>{
                    Toast.info("提交失败!", 1);
                })
            } else {//编辑提交
                API.editSubmitReview(storage.loadProject(), reviewId, props).then(responseData => {
                    //pop页面
                    dispatch(UpdateDataAction.updateData());
                    storage.goBack(navigator, null)
                    Toast.hide();
                }).catch((err)=>{
                    Toast.info("提交失败!", 1);
                })
            }

        });


    } else {
        //显示提示
        Toast.info(mustInfo.msg, 1);
    }
}

/**
 * 提交复查单
 * @param {*} inspectionId 
 * @param {*} description 
 * @param {*} qualityInfo 
 * @param {*} editInfo 
 * @param {*} dispatch 
 * @param {*} navigator 
 */
function submitRepair(inspectionId, description, qualityInfo, editInfo, dispatch, navigator, imageChooserEle) {
    let reviewId = editInfo.id;
    let params = assembleRepairParams(inspectionId, description, qualityInfo, editInfo);
    let mustInfo = checkRepairMustInfo(params);

    if (mustInfo.checked) {
        loadingToast();
        uploadFile(imageChooserEle, (files) => {
            if (files) {
                params.files = files;
            }
            let props = JSON.stringify(params);
            if (!reviewId) {//新建提交
                API.createSubmitRepair(storage.loadProject(), props).then(responseData => {
                    //pop页面
                    dispatch(UpdateDataAction.updateData())
                    storage.goBack(navigator, null);
                    Toast.hide();
                }).catch((err)=>{
                    Toast.info("提交失败!", 1);
                })
            } else {//编辑提交
                API.editSubmitRepair(storage.loadProject(), reviewId, props).then(responseData => {
                    //pop页面
                    dispatch(UpdateDataAction.updateData())
                    storage.goBack(navigator, null);
                    Toast.hide();
                }).catch((err)=>{
                    Toast.info("提交失败!", 1);
                })
            }
        });


    } else {
        //显示提示
        Toast.info(mustInfo.msg, 1);
    }
}

/**
 * 保存
 * @param {*} inspectionId 
 * @param {*} description 
 * @param {*} status //整改单为空
 * @param {*} lastRectificationDate //整改单为空
 * @param {*} qualityInfo 
 * @param {*} editInfo 
 * @param {*} type 
 */
export function save(inspectionId, description, status, lastRectificationDate, qualityInfo, editInfo, type, imageChooserEle) {
    return dispatch => {
        if (type === API.CREATE_TYPE_REVIEW) {//新建复查单
            saveReview(inspectionId, description, status, lastRectificationDate, qualityInfo, editInfo, dispatch, imageChooserEle);
        } else if (type === API.CREATE_TYPE_RECTIFY) {//新建整改单
            saveRepair(inspectionId, description, qualityInfo, editInfo, dispatch, imageChooserEle);
        }
    }
}
/**
 * 保存复查单
 * @param {*} inspectionId 
 * @param {*} description 
 * @param {*} status 
 * @param {*} lastRectificationDate 
 * @param {*} qualityInfo 
 * @param {*} editInfo 
 * @param {*} dispatch 
 */
function saveReview(inspectionId, description, status, lastRectificationDate, qualityInfo, editInfo, dispatch, imageChooserEle) {
    let reviewId = editInfo.id;
    let params = assembleReviewParams(inspectionId, description, status, lastRectificationDate, qualityInfo, editInfo);
    let mustInfo = checkReviewMustInfo(params);
    if (mustInfo.checked) {
        loadingToast();
        uploadFile(imageChooserEle, (files) => {
            if (files) {
                params.files = files;
            }
            let props = JSON.stringify(params);
            if (!reviewId) {//新建保存
                API.createSaveReview(storage.loadProject(), props).then(responseData => {
                    //"保存成功！"  { data: { id: 5200032, code: 'ZLFC_20180424_001' } }
                    let resetEditInfo = {
                        id: responseData.data.id,
                        code: responseData.data.code,
                        description: description,
                        lastRectificationDate: lastRectificationDate,
                        status: status,
                    }
                    dispatch(_loadEditInfoSuccess(resetEditInfo))
                    Toast.hide();
                    Toast.info("保存成功！", 1);
                }).catch((err)=>{
                    Toast.info("保存失败!", 1);
                })
            } else {//编辑保存
                API.editSaveReview(storage.loadProject(), reviewId, props).then(responseData => {
                    let resetEditInfo = {
                        id: editInfo.id,
                        code: editInfo.code,
                        description: description,
                        lastRectificationDate: lastRectificationDate,
                        status: status,
                    }
                    dispatch(_loadEditInfoSuccess(editInfo))
                    //"保存成功！" 
                    Toast.hide();
                    Toast.info("保存成功！", 1);
                }).catch((err)=>{
                    Toast.info("保存失败!", 1);
                })
            }
        });


    } else {
        //显示提示窗
        Toast.info(mustInfo.msg, 1);
    }
}

/**
 * 保存整改单
 * @param {*} inspectionId 
 * @param {*} description 
 * @param {*} qualityInfo 
 * @param {*} editInfo 
 * @param {*} dispatch 
 */
function saveRepair(inspectionId, description, qualityInfo, editInfo, dispatch, imageChooserEle) {
    let reviewId = editInfo.id;
    let params = assembleRepairParams(inspectionId, description, qualityInfo, editInfo);
    let mustInfo = checkRepairMustInfo(params);
    if (mustInfo.checked) {
        loadingToast();
        uploadFile(imageChooserEle, (files) => {
            if (files) {
                params.files = files;
            }
            let props = JSON.stringify(params);
            if (!reviewId) {//新建保存
                API.createSaveRepair(storage.loadProject(), props).then(responseData => {
                    //"保存成功！"  { data: { id: 5200032, code: 'ZLFC_20180424_001' } }
  
                    let resetEditInfo = {
                        id: responseData.data.id,
                        code: responseData.data.code,
                        description: description,
                    }
                    dispatch(_loadEditInfoSuccess(resetEditInfo))
                    Toast.hide();
                    Toast.info("保存成功！", 1);
                }).catch((err)=>{
                    Toast.info("保存失败!", 1);
                })
            } else {//编辑保存
                API.editSaveRepair(storage.loadProject(), reviewId, props).then(responseData => {
                    let resetEditInfo = {
                        id: editInfo.id,
                        code: editInfo.code,
                        description: description,
                    }
                    dispatch(_loadEditInfoSuccess(editInfo))
                    Toast.hide();
                    //"保存成功！" 
                    Toast.info("保存成功！", 1);
                }).catch((err)=>{
                    Toast.info("保存失败!", 1);
                })
            }

        });

    } else {
        //显示提示窗
        Toast.info(mustInfo.msg, 1);
    }
}

/**
 * 删除单据
 * @param {*} fileId 单据id
 * @param {*} type 
 * @param {*} navigator 
 */
export function deleteForm(fileId, type, navigator) {
    return dispatch => {
        if (type === API.CREATE_TYPE_REVIEW) {//删除复查单
            API.deleteReview(storage.loadProject(), fileId).then(responseData => {
                dispatch(reset())
                storage.goBack(navigator, null)
            })
        } else if (type === API.CREATE_TYPE_RECTIFY) {//删除整改单
            API.deleteRepair(storage.loadProject(), fileId).then(responseData => {
                dispatch(reset())
                storage.goBack(navigator, null)
            })
        }
    }
}


export function _loadDetailSuccess(data) {
    return {
        type: types.REVIEW_REPAIR_LOAD_DETAIL,
        qualityInfo: data,
    }
}

export function _loadEditInfoSuccess(data) {
    return {
        type: types.REVIEW_REPAIR_LOAD_EDITINFO,
        editInfo: data,
    }
}

function _loadError(error) {
    return {
        type: types.REVIEW_REPAIR_LOAD_ERROR,
        error: error,
    }
}

function reset() {
    return {
        type: types.REVIEW_REPAIR_INIT,
    }
}