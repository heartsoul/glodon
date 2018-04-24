import * as API from 'app-api';
import * as types from "./../constants/reviewRepairTypes";

/**
 * 获取质检单详情
 */
export function getInspectionDetail(fieldId) {
    return dispatch => {
        API.getQualityInspectionDetail(storage.loadProject(), fieldId).then((responseData) => {
            dispatch(_loadDetailSuccess(responseData.data));
        }).catch(err => {
            dispatch(_loadError(error));
        });
    }
}

/**
 * 获取以前保存的信息
 */
export function getReviewInfo(fieldId) {

    API.getReviewInfo(storage.loadProject(), fieldId).then((responseData) => {
        dispatch(_loadReviewInfoSuccess(responseData.data));
    }).catch(err => {
        dispatch(_loadError(error))
    });

}

export function _loadDetailSuccess(data) {
    return {
        type: types.REVIEW_REPAIR_LOAD_DETAIL,
        detailInfo: data,
    }
}

export function _loadReviewInfoSuccess(data) {
    return {
        type: types.REVIEW_REPAIR_LOAD_REVIEWiNFO,
        reviewInfo: data,
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