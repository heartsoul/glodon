import * as types from './../constants/docMarkupTypes'
import SERVICE from 'app-api/service'
// 获取数据
export function fetchData(listType, modelVersionId, fileId, dataMap, creatorId, page, pageSize = 15) {
    return dispatch => {
        let list = [];
        if (page == 0) {
            dispatch(_loading(listType));
        } else if (dataMap) {
            list = dataMap;
        }
        SERVICE.getModelMarkups(modelVersionId, fileId, creatorId, page, pageSize)
            .then(data => {
                let hasMore = data.length > 0;
                dispatch(_loadingSuccess(listType, list.concat(data), page, hasMore))
            }).catch(err => {
                dispatch(_loadingFail(listType, list, page, true))
            })
    }
}

/**
 * 获取批注评论列表
 * @param {*} dataArray 
 * @param {*} modelVersionId 
 * @param {*} fileId 
 * @param {*} markupId 
 * @param {*} offset 
 * @param {*} limit 
 */
export function getModelMarkupComments(dataArray, modelVersionId, fileId, markupId, offset, limit) {
    return dispatch => {
        // getModelMarkupComments(modelVersionId, fileId, markupId, offset, limit)
        let list = [];
        if (offset != 0) {
            list = dataArray;
        }
        SERVICE.getModelMarkupComments(modelVersionId, fileId, markupId, offset, limit)
            .then(data => {
                let hasMore = data.length > 0;
                dispatch(_loadingSuccess('listType', list.concat(data), offset, hasMore))
            }).catch(err => {

            })
    }
}


function _loading(listType) {
    return {
        type: types.DOC_MARKUP_TYPE_LOADING,
        listType: listType,
    }
}

function _loadingSuccess(listType, data, page, hasMore) {
    return {
        type: types.DOC_MARKUP_TYPE_LOADING_SUCCESS,
        listType: listType,
        data: data,
        page: page,
        hasMore: hasMore
    }
}
function _loadingFail(listType, data, page, hasMore) {
    return {
        type: types.DOC_MARKUP_TYPE_LOADING_FAIL,
        listType: listType,
        data: data,
        page: page,
        hasMore: hasMore
    }
}

