import * as API from 'app-api'
import * as types from '../constants/equipmentInfoTypes'

/**
 * 提交材设单 新增时的response {"id": 5200418,"code": "CSYS_20180504_002"}，编辑时response未测试。
 * @param {*} params 
 */
export function submit(params) {
    let fieldId = params.id;//根据单据id区分编辑和新增
    fieldId = 0;//单据的id
    return dispatch => {
        if (fieldId && fieldId != 0) {
            API.equipmentEditSubmit(storage.loadProject(), fieldId, params)
                .then((responseData) => {

                }).catch(error => {
                    console.log(error);
                })
        } else {
            API.equipmentCreateSubmit(storage.loadProject(), params)
                .then((responseData) => {

                }).catch(error => {
                    console.log(error);
                })
        }
    }
}

/**
 * 保存材设单 新增时的response {"id": 5200418,"code": "CSYS_20180504_002"}，编辑时response未测试。
 * @param {*} params 
 */
export function save(params) {
    let fieldId = params.id;//根据单据id区分编辑和新增
    fieldId = 0;//单据的id
    return dispatch => {
        if (fieldId && fieldId != 0) {
            API.equipmentEditSave(storage.loadProject(), fieldId, params)
                .then((responseData) => {

                }).catch(error => {
                    console.log(error);
                })
        } else {
            API.equipmentCreateSave(storage.loadProject(), params)
                .then((responseData) => {

                }).catch(error => {
                    console.log(error);
                })
        }
    }
}

/**
 * 删除，response no content
 * @param {*} fieldId 单据id 
 */
export function equipmentDelete(fieldId) {
    return dispatch => {
        API.equipmentDelete(storage.loadProject(), fieldId)
            .then((responseData) => {

            }).catch(error => {
                console.log(error);
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
        API.equipmentDetail(storage.loadProject(), fieldId).then((responseData) => {
            dispatch(_loadSuccess(responseData.data));
        }).catch(error => {
            dispatch(_loadError(error));
        });

    }
}

function equipmentAcceptanceCompanies(dispatch) {
    API.equipmentAcceptanceCompanies(storage.loadProject())
        .then(responseData => {
            dispatch(_loadingAcceptanceCompaniesSuccess(responseData.data));
        }).catch(error => { })
}


export function switchPage(data) {
    return dispatch => {
        dispatch(_loadSuccess(data));
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

function _loadingAcceptanceCompaniesSuccess(data){
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
