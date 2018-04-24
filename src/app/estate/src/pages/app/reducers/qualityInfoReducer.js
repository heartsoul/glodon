'use strict'

import * as types from '../constants/qualityInfoTypes';

const initialState = {
    data: {
        inspectionInfo:{},
        progressInfos:[]
    },
    isLoading: true,
    item:{},
    error:null,
    isSuccessed:false,
}

export default (state = initialState, action) => {
    switch (action.type) {
        case types.QUALITY_INFO_DOING:
            return {
                ...state,
                isLoading: true,
                error:null,
                isSuccessed:false
            }
        case types.QUALITY_INFO_DONE:
            return {
                ...state,
                isLoading: false,
                data: action.data,
                error:null,
                isSuccessed:true
            }
        case types.QUALITY_INFO_ERROR:
            return {
                ...state,
                isLoading: false,
                error:action.error,
                isSuccessed:false
            }
        case types.QUALITY_INFO_INIT:
            return initialState;
        default:
            return state;
    }
};