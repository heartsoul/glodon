'use strict'

import API from 'app-api';
import * as types from '../constants/equipmentInfoTypes';


const initialState = {
    data: {
        inspectionInfo:{},
        progressInfos:[]
    },
    isLoading: true,
    error:null,
    isSuccessed:false,
    editType:API.EQUIPMENT_EDIT_TYPE_BASE, // 默认是新建
}

export default (state = initialState, action) => {
    switch (action.type) {
        case types.EQUIPMENT_NEW_DOING:
            return {
                ...state,
                isLoading: true,
                error:null,
                isSuccessed:false,
                editType:action.editType,
            }
        case types.EQUIPMENT_NEW_DONE:
            return {
                ...state,
                isLoading: false,
                data: action.data,
                error:null,
                isSuccessed:true,
                editType:action.editType,
            }
        case types.EQUIPMENT_NEW_ERROR:
            return {
                ...state,
                isLoading: false,
                error:action.error,
                isSuccessed:false,
                editType:action.editType,
            }
        case types.EQUIPMENT_NEW_INIT:
            return initialState;
        default:
            return state;
    }
};