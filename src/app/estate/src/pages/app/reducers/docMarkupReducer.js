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
        default:
            return state;
    }
};