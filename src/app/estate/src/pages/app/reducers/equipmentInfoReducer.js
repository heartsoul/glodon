'use strict'

import * as API from 'app-api';
import * as types from '../constants/equipmentInfoTypes';


const initialState = {
    data: {},
    oldData:{},
    isLoading: true,
    error: null,
    isSuccessed: false,
    editType: API.EQUIPMENT_EDIT_TYPE_BASE, // 默认是新建
    acceptanceCompanies:{}
}

export default (state = initialState, action) => {
    switch (action.type) {
        case types.EQUIPMENT_INFO_DOING:
            return {
                ...state,
                isLoading: true,
                error: null,
                isSuccessed: false,
                editType: action.editType,
            }
        case types.EQUIPMENT_INFO_DONE:
            return {
                ...state,
                isLoading: false,
                data: action.data,
                oldData:{...action.data},
                error: null,
                isSuccessed: true,
                editType: action.editType,
            }
        case types.EQUIPMENT_INFO_PAGE:
            return {
                ...state,
                isLoading: false,
                data: action.data,
                error: null,
                isSuccessed: true,
                editType: action.editType,
            }
        case types.EQUIPMENT_INFO_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.error,
                isSuccessed: false,
                editType: action.editType,
            }
        case types.EQUIPMENT_ACCEPTANCE_COMPANIES:
            return {
                ...state,
                acceptanceCompanies: action.acceptanceCompanies,
            }
        case types.EQUIPMENT_INFO_INIT:
            return initialState;
        default:
            return state;
    }
};