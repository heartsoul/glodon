import * as types from './../constants/docMarkupTypes'
import SERVICE from 'app-api/service'
// 获取数据
export function fetchData(listType, modelVersionId, fileId, creatorId, pageIndex, pageSize = 15) {
    return dispatch => {
        if (pageIndex == 0) {
            dispatch(_loading(listType, pageIndex, ));
        }
        SERVICE.getModelMarkups(modelVersionId, fileId, creatorId, pageIndex, pageSize)
            .then(data => {
                dispatch(_loadingSuccess(listType, data, pageIndex, pageSize))
            }).catch(err => {
                dispatch(_loadingFail(listType, data, pageIndex, pageSize))
            })
    }
}

function _loading(listType, data, page, hasMore) {
    return {
        type: types.DOC_MARKUP_TYPE_LOADING,
        listType: listType,
        data: data,
        page: page,
        hasMore: hasMore,
    }
}

function _loadingSuccess(listType) {
    return {
        type: types.DOC_MARKUP_TYPE_LOADING_SUCCESS,
        listType: listType,

    }
}
function _loadingFail(listType) {
    return {
        type: types.DOC_MARKUP_TYPE_LOADING_FAIL,
        listType: listType,
    }
}

