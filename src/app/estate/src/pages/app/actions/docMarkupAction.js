import * as types from './../constants/docMarkupTypes'
import SERVICE from 'app-api/service'
// 获取批注列表数据
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
export function getModelMarkupComments(dataArray, modelVersionId, fileId, markupId, offset, limit = 15) {
    return dispatch => {
        let list = [];
        if (offset == 0) {
            dispatch(_loadingComments());
        } else if (dataArray) {
            list = dataArray;
        }
        SERVICE.getModelMarkupComments(modelVersionId, fileId, markupId, offset, limit)
            .then(data => {
                let hasMore = data.length > 0;
                let newData = list.concat(data);
                let newoffset = offset + newData.length;
                dispatch(_loadCommentsComplete(newData, newoffset, hasMore))
            }).catch(err => {
                dispatch(_loadCommentsComplete(list, offset, true))
            })
    }
}

/**
 * 添加评论
 * @param {*} modelVersionId 
 * @param {*} fileId 
 * @param {*} markupId 
 * @param {*} content 
 * @param {*} deptId 
 * @param {*} receiverIds 
 */
export function addModelMarkupComment(modelVersionId, fileId, markupId, content, deptId, receiverIds = []) {
    return dispatch => {
        dispatch(_sendingComments())
        SERVICE.addModelMarkupComment(modelVersionId, fileId, markupId, content, deptId, receiverIds)
            .then(data => {
                //把新增的评论加入到列表
                dispatch(_sendCommentsSuccess(data))
            }).catch(err => {
                dispatch(_sendCommentsFAIL(data))
            })
    }
}
/**
 * 添加新的@人员
 * @param {*} users
 * @param {*} cacheUserMap 
 */
export function addAtUser(users, cacheUserMap) {
    return dispatch => {
        if (!cacheUserMap) {
            cacheUserMap = new Map();
        }
        users.map(user => {
            if (!cacheUserMap.get(user.name)) {
                cacheUserMap.set(user.name, user)
            }
        })
        dispatch(_addAtUser(users, cacheUserMap))
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

function _loadingComments() {
    return {
        type: types.DOC_MARKUP_TYPE_LOADING_COMMENTS,
    }
}

function _loadCommentsComplete(data, offset, hasMore) {
    return {
        type: types.DOC_MARKUP_TYPE_LOAD_COMMENTS_COMPLETE,
        data: data,
        offset: offset,
        hasMore: hasMore
    }
}

function _sendingComments() {
    return {
        type: types.DOC_MARKUP_TYPE_SENDING_COMMENTS,
    }
}

function _sendCommentsSuccess(data) {
    return {
        type: types.DOC_MARKUP_TYPE_SEND_COMMENTS_SUCCESS,
        data: data,
    }
}

function _sendCommentsFAIL() {
    return {
        type: types.DOC_MARKUP_TYPE_SEND_COMMENTS_FAIL,
    }
}

function _addAtUser(users, cacheUserMap) {
    return {
        type: types.DOC_MARKUP_TYPE_ADD_AT_USER,
        atUsers: users,
        cacheUserMap: cacheUserMap,
    }
}

export function resetAt() {
    return {
        type: types.DOC_MARKUP_TYPE_RESET_AT,
    }
}
