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
        default:
            return state;
    }
};