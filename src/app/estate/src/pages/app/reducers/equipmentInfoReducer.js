'use strict'

import * as types from '../constants/equipmentInfoTypes';

const initialState = {
    data: {
        inspectionInfo:{},
        progressInfos:[]
    },
    isLoading: true,
    error:null,
    isSuccessed:false,
}

export default (state = initialState, action) => {
    switch (action.type) {
        case types.EQUIPMENT_INFO_DOING:
            return {
                ...state,
                isLoading: true,
                error:null,
                isSuccessed:false
            }
        case types.EQUIPMENT_INFO_DONE:
            return {
                ...state,
                isLoading: false,
                data: action.data,
                error:null,
                isSuccessed:true
            }
        case types.EQUIPMENT_INFO_ERROR:
            return {
                ...state,
                isLoading: false,
                error:action.error,
                isSuccessed:false
            }
        case types.EQUIPMENT_INFO_INIT:
            return initialState;
        default:
            return state;
    }
};