'use strict'

import * as types from '../constants/projectListTypes';

const initialState = {
    data: [],
    isLoading: true,
    error:null,
    isSuccessed:false,
    hasMore:true,
    page:0
}

export default (state = initialState, action) => {
    switch (action.type) {
        case types.PROJECT_LIST_DOING:
            return {
                ...state,
                isLoading: true,
                error:null,
                isSuccessed:false
            }
        case types.PROJECT_LIST_DONE:
            return {
                ...state,
                isLoading: false,
                data: action.data,
                page:action.page+1,
                error:null,
                isSuccessed:true,
                hasMore:action.hasMore
            }
        case types.PROJECT_LIST_ERROR:
            return {
                ...state,
                isLoading: false,
                error:action.error,
                isSuccessed:false
            }
        case types.PROJECT_LIST_INIT:
            return initialState;
        default:
            return state;
    }
};