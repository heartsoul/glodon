'use strict'

import * as types from './../constants/docMarkupTypes';

const initialState = {

    datas: {
        'all': {
            page: 0,
            isLoading: false,
            data: [],
            hasMore: true
        }
        ,
        'my': {
            page: 0,
            isLoading: false,
            data: [],
            hasMore: true
        }
        ,
        '@me': {
            page: 0,
            isLoading: false,
            data: [],
            hasMore: true
        }
        ,
    },
    comments: {
        data: [],
        offset: 0,
        hasMore: true,
        isLoading: false,
    },
    sendComments: {
        data: {},
        status: '',//sending success fail
    }
}

export default (state = initialState, action) => {
    switch (action.type) {
        case types.DOC_MARKUP_TYPE_LOADING:
            let dataItem = state.datas[action.listType]
            dataItem.isLoading = true;
            return {
                ...state,
            }
        case types.DOC_MARKUP_TYPE_LOADING_SUCCESS:
            let dataItem1 = state.datas[action.listType]
            dataItem1.isLoading = false;
            dataItem1.data = action.data;
            dataItem1.page = action.page;
            dataItem1.hasMore = action.hasMore;
            return {
                ...state,
            }
        case types.DOC_MARKUP_TYPE_LOADING_FAIL:
            let dataItem2 = state.datas[action.listType]
            dataItem2.isLoading = false;
            dataItem2.data = action.data;
            dataItem2.page = action.page;
            dataItem2.hasMore = action.hasMore;
            return {
                ...state,
            }
        case types.DOC_MARKUP_TYPE_LOADING_COMMENTS:
            let comments = state.comments
            comments.isLoading = true;
            return {
                ...state,
            }
        case types.DOC_MARKUP_TYPE_LOAD_COMMENTS_COMPLETE:
            let comments2 = state.comments
            comments2.isLoading = false;
            comments2.data = action.data;
            comments2.offset = action.offset;
            comments2.hasMore = action.hasMore;
            return {
                ...state,
            }
        case types.DOC_MARKUP_TYPE_SENDING_COMMENTS:
            let sendComments1 = state.sendComments;
            sendComments1.status = 'sending';
            return {
                ...state,
            }
        case types.DOC_MARKUP_TYPE_SEND_COMMENTS_SUCCESS:
            let sendComments2 = state.sendComments;
            sendComments2.data = action.data;
            sendComments2.status = 'success';
            let commentsData = state.comments.data
            commentsData.splice(0, 0, action.data)
            return {
                ...state,
            }
        case types.DOC_MARKUP_TYPE_SEND_COMMENTS_FAIL:
            let sendComments3 = state.sendComments;
            sendComments3.status = 'fail';
            return {
                ...state,
            }
        default:
            return state;
    }
};